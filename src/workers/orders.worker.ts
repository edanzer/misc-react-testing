const feed = new WebSocket("wss://www.cryptofacilities.com/ws/v1")

feed.onopen = () => {
    const subscription = {
        "event": "subscribe",
        "feed": "book_ui_1",
        "product_ids": ["PI_XBTUSD"]
    }
    feed.send(JSON.stringify(subscription))
};

feed.onmessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    console.log(data)
};

feed.onclose = () => {
    console.log("Feed was closed!")
};

function closeFeed() {
    try {
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
    } catch (e) {
        console.log("Caught error")
        throw e
    }
}

setTimeout(closeFeed, 10000);

export default {}