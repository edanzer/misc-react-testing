import { RawOrderBook } from "../../../types/orderBookTypes"
import { getUpdatedOrderBook, sendOrderBook } from "./orderWorkerHelpers"

(function OrderWorker() {

    let rawOrderBook: RawOrderBook
    let socket: WebSocket
    let currentPair: string = ''

    onmessage = e => {
        const message = e.data
        switch(message.action) {
            case "open":
                if (socket) closeSocket(currentPair)
                openSocket(message.url, message.pair)
                break;
            case "close":
                closeSocket(message.pair)
                break;
            default:
                console.log('Invalid action');
          }
    };

    function openSocket(url: string, pair: string) {

        socket = new WebSocket(url)

        socket.onopen = () => {
            const subscription = {
                "event": "subscribe",
                "feed": "book_ui_1",
                "product_ids": [pair]
            }
            socket.send(JSON.stringify(subscription))
            currentPair = pair
        };

        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            
            if (data.hasOwnProperty("bids")) {
                rawOrderBook = getUpdatedOrderBook(rawOrderBook, data.asks, data.bids)
            } else {
                console.log(data)
            } 
        };

        socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            
            if (data.hasOwnProperty("bids")) {
                rawOrderBook = getUpdatedOrderBook(rawOrderBook, data.asks, data.bids)
            } else {
                console.log(data)
            } 
        };

        socket.onclose = () => {
            console.log("Socket closed.")
            clearTimeout(timer);
        };

        const timer = setInterval( () => sendOrderBook("update", rawOrderBook), 200 )
        setTimeout(closeSocket, 10000); // For testing, close webocket after 5 seconds

    }

    function closeSocket(pair: string) {
        const unsubscribe = {
            event: "unsubscribe",
            feed: "book_ui_1",
            product_ids: pair,
        }
        socket.send(JSON.stringify(unsubscribe))
        socket.close()
        currentPair = ''
        postMessage({
            type: "FEED_KILLED",
        })
    }
})()

export default {}
