// import { useSubscribeOrderWorker } from "../../../hooks/useSubscribeOrderWorker"
import { RawOrderBook, Pair } from "../../../types/orderBookTypes"
import { getUpdatedOrderBook, sendOrderBook } from "./orderWorkerHelpers"

(function OrderWorker() {
    let socket: WebSocket
    let isSubscribed: boolean = false

    let currentPair: Pair = ''
    let rawOrderBook: RawOrderBook
    let timer: NodeJS.Timeout

    /* 
    * Handle messages from React 
    */
    onmessage = e => {
        const message = e.data
        switch(message.action) {
            case "open":
                openSocket(message.url, message.pair)
                break;
            case "subscribe":
                if (isSubscribed) unSubscribe(currentPair)
                subscribe(message.pair)
                break;
            case "close":
                closeSocket()
                break;
            default:
                console.log('Invalid action');
        }
    }

    /* 
     * Open socket and set up socket event listeners
     */
    function openSocket(url: string, pair: Pair) {

        // Open Socket
        socket = new WebSocket(url)

        // Listen for and respond to socket onopen event
        socket.onopen = () => {
            postMessage({ type: "socketOpened" })
        }

        // Listen for and respond to socket messages
        // Critical method for receiving and updating Orderbook
        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            switch(data.hasOwnProperty("event")) {
                case true: 
                    console.log("socketEvent",  data)
                    break;
                case false:
                    rawOrderBook = getUpdatedOrderBook(rawOrderBook, data.asks, data.bids)
                    break;
                default:
                    console.log(data)
            }
        };

        // Listen for and respond to socket close event
        socket.onclose = () => {
            if (timer) clearTimeout(timer)
            postMessage({ type: "socketClosed" })
        };
    }

    function subscribe(pair: Pair) {
        // Subscribe
        const subscription = { "event": "subscribe", "feed": "book_ui_1", "product_ids": [pair] }
        socket.send(JSON.stringify(subscription))
        
        // Update local "state" values and send subscribed message to React
        currentPair = pair
        isSubscribed = true
        postMessage({ type: "subscribed", pair })

        // Also start timer to send udpate Orderbook back to React
        timer = setInterval( () => sendOrderBook("update", rawOrderBook), 250 )
        setTimeout(closeSocket, 8000); // For testing, close webocket after 5 seconds
    }

    function unSubscribe(pair: Pair) {
        // Stop sending Orderbook updates to React
        if (timer) clearInterval(timer)
        
        // Unsubscribe
        const unsubscribe = { event: "unsubscribe", feed: "book_ui_1", product_ids: [pair] }
        socket.send(JSON.stringify(unsubscribe))

        // Update local "state" and send unsubscribe message to React
        currentPair = ''
        isSubscribed = false
        postMessage({ type: "unsubscribed", pair })
    }

    function closeSocket() {
        // Stop sending Orderbook updates to React
        if (timer) clearInterval(timer)

        // Close the socket
        socket.close()

        // Update local "state" and send closed message to React
        postMessage({ type: "socketClosed." })
        currentPair = ''
        isSubscribed = false
    }
})()

export default {}
