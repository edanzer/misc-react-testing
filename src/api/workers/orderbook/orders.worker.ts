import { RawOrderBook, Pair } from "../../../types/orderBookTypes"
import { getUpdatedOrderBook, sendOrderBook } from "./orderWorkerHelpers"

(function OrderWorker() {
    let socket: WebSocket | null
    let isSubscribed: boolean = false

    let currentPair: Pair = ''
    let rawOrderBook: RawOrderBook = null
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

        // Listen and respond to socket onopen event
        socket.onopen = () => {
            postMessage({ type: "socketOpened" })
        }

        // Listen  and respond to socket messages
        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            if (data.hasOwnProperty("event")) {
                switch(data.event) {
                    case "subscribed": 
                        isSubscribed = true
                        currentPair = pair
                        postMessage({ type: "socketSubscribed", pair })
            
                        // Also start timer to send udpate Orderbook back to React
                        timer = setInterval( () => sendOrderBook("update", rawOrderBook), 200)
                        setTimeout(closeSocket, 20000); // For testing, close webocket after 5 seconds
                        break;
                    case "unsubscribed":
                        isSubscribed = false
                        postMessage({ type: "socketUnsubscribed", pair: data.product_ids })
                        currentPair = ''
                        break;
                    case "subscribed-failed": 
                        postMessage({ type: "socketSubscribedFailed", pair: data.product_ids })
                        break;
                    case "unsubscribed-failed":
                        postMessage({ type: "socketUnsubscribedFailed", pair: data.product_ids })
                        break;
                    case "error":
                        postMessage({ type: "socketError", message: data.message })
                        break;
                    default:
                        console.log(data)
                }

            } else if (data.hasOwnProperty("bids"))  {
                rawOrderBook = getUpdatedOrderBook(rawOrderBook, data.asks, data.bids)
            } else {
                console.log("Unknown message received from socket:", data)
            }
        };

        // Listen and respond to socket close event
        socket.onclose = () => {
            if (timer) clearTimeout(timer)
            postMessage({ type: "socketClosed" })
            currentPair = ''
            isSubscribed = false
        };
    }

    function subscribe(pair: Pair) {
        const subscription = { "event": "subscribe", "feed": "book_ui_1", "product_ids": [pair] }
        if (socket) socket.send(JSON.stringify(subscription))
    }

    function unSubscribe(pair: Pair) {
        if (timer) clearInterval(timer)
        const unsubscribe = { event: "unsubscribe", feed: "book_ui_1", product_ids: [pair] }
        if (socket) socket.send(JSON.stringify(unsubscribe))
    }

    function closeSocket() {
        if (timer) clearInterval(timer)
        if (socket) socket.close()
    }
})()

export default {}
