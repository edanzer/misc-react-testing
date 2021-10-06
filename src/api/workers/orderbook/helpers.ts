import { 
    RawOrderList, 
    RawOrderBook, 
    FinishedOrderList, 
    FinishedOrderBook,
    OrderBookAction 
} from "../../../types/orderBookTypes"

/*
 * Set initial orderbook based on snapshot
 */
export function setInitialOrderBook(asks: RawOrderList, bids: RawOrderList): RawOrderBook {
    const rawOrderBook: RawOrderBook = [ asks, bids ]
    return rawOrderBook
}

/* 
 * Update the orderbook with new values
 */
export function updateOrderBook(rawOrderBook: RawOrderBook, newAsks: RawOrderList, newBids: RawOrderList) {    
    const updateOrderbook = {
        asks: updateRawOrders(rawOrderBook[0], newAsks),
        bids: updateRawOrders(rawOrderBook[1], newBids)
    }
}

/*
 * Update list of orders with new orders
 */
export function updateRawOrders(currentOrders: RawOrderList, newOrders: RawOrderList): RawOrderList {
    /* 
     * Map over existing orders. 
     * For each, check if updated orders exist at the same price.
     * If so, return the updated orders.
     * If not, return the existing orders.
     */
    const updatedOrders = currentOrders.map(currentOrder => {
        let match = newOrders.find(newOrder => newOrder[0] === currentOrder[0])
        return match ? match : currentOrder;
    });

    return updatedOrders; 
}

/*
 * Post orderbook from this web worker to React
 */
export function postOrderBook(action: OrderBookAction, rawOrderBook: RawOrderBook): void {    
    const finishedOrderBook: FinishedOrderBook = prepareOrderBook(rawOrderBook);

    postMessage({
        type: action,
        finishedOrderBook
    });
}

/* 
 * Prepare the orderbook for posting back to React
 */
export function prepareOrderBook(rawOrderBook: RawOrderBook): FinishedOrderBook {
    const finishedOrderBook: FinishedOrderBook = {
        asks: addTotals(rawOrderBook[0]),
        bids: addTotals(rawOrderBook[1])
    }
    
    return finishedOrderBook
}

/* 
 * Add cumulative order totals
 */
export function addTotals(orders: RawOrderList): FinishedOrderList {
    let total = 0

    // Map through orders, update and add the total
    const ordersWithTotals: FinishedOrderList = orders.map(order => {
        return {
            price: order[0],
            size: order[1],
            total: total += order[1]
        }
    })

    return ordersWithTotals
}