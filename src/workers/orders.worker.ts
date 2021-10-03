import { RawOrderList } from "../types/orderBookTypes"

/* 
 * Send request to open websocket
 */
const feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1")

/* 
 * When websocket is confirmed, send initial request to subscribe to feed
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
        returnInitialOrderBook(data.asks, data.bids);
    } else {
        // console.log(data)
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
setTimeout(closeFeed, 5000); // For testing, close webocket after 5 seconds

/* 
 * Handle message confirming websocket closure
 */
feed.onclose = () => {
    console.log("Feed was closed!")
};

/*
 * Helper Function: Return initial orderbook, based on snapshot, to React
 */
function returnInitialOrderBook(asks: RawOrderList, bids: RawOrderList) {
    // Add totals to all orders
    const asksWithTotals = addTotals(asks)
    const bidsWithTotals = addTotals(bids)

    // Post message back to React useOrders hook
    postMessage({
        type: "SNAPSHOT",
        asks: asksWithTotals,
        bids: bidsWithTotals
    });
}

/* 
 * Helper function: add cumulative order total to each order
 */
function addTotals(orders: RawOrderList) {
    // Set counter to track total
    let total = 0

    // Map through orders, update and add the total
    const ordersWithTotals = orders.map(order => {
        return [...order, total += order[1]]
    })

    return ordersWithTotals
}

export default {}