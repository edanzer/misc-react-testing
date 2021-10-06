import { RawOrderBook, OrderBookAction } from "../../../types/orderBookTypes"
import { setInitialOrderBook, updateOrderBook, postOrderBook } from "./helpers"

let rawOrderBook: RawOrderBook;

/* 
 * Send request to open websocket
 */
const feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1")

/* 
 * When websocket is confirmed, send request to subscribe to feed
 */
feed.onopen = () => {
    const subscription = {
        "event": "subscribe",
        "feed": "book_ui_1",
        "product_ids": ["PI_XBTUSD"]
    }
    feed.send(JSON.stringify(subscription))
};

/* 
 * Handle all messages received via websocket
 */
feed.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)

    if (data.hasOwnProperty("event")) {

        // console.log(data.event)

    } else if(data.hasOwnProperty("numLevels")) {

        rawOrderBook = setInitialOrderBook(data.asks, data.bids)
        postOrderBook(OrderBookAction.Initial, rawOrderBook)

    } else {

        rawOrderBook = updateOrderBook(rawOrderBook, data.asks, data.bids)

    }
};

/* 
 * Send request to close websocket
 */
function closeFeed() {
    const unsubscribe = {
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: "PI_XBTUSD",
    }
    feed.send(JSON.stringify(unsubscribe))
    feed.close()
    postMessage({
        type: "FEED_KILLED",
    })
}

/* 
 * Run any needed action when websocket is confirmed as closed
 */
feed.onclose = () => {
    console.log("Feed was closed!")
    clearTimeout(timer);
};

/*
 * Periodically post updated orderbook to React 
 */
const timer = setInterval( () => postOrderBook(OrderBookAction.Update, rawOrderBook), 1000 );
setTimeout(closeFeed, 10000); // For testing, close webocket after 5 seconds

// Post updated orderbook to react every half second
// setInterval(postUpdatedOrderBook, 1000, currentAsks, currentBids); 

export default {}


// Question 1: How to handle state in this file
// Question 2: How to handle periodically returning the order to react