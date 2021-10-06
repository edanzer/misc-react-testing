import { 
    RawOrderList, 
    RawOrderBook, 
    FinishedOrderList, 
    FinishedOrderBook,
    OrderBookAction, 
} from "../../../types/orderBookTypes"

/* 
 * Update the orderbook with new values
 */
export function getUpdatedOrderBook(rawOrderBook: RawOrderBook, newAsks: RawOrderList, newBids: RawOrderList): RawOrderBook {    
    if (typeof rawOrderBook === 'undefined') {
        const updatedOrderbook: RawOrderBook = [ newAsks, newBids ]
        return updatedOrderbook
    }

    const updatedOrderbook: RawOrderBook = [
        removeZeros(getUpdatedOrders(rawOrderBook[0], newAsks)),
        removeZeros(getUpdatedOrders(rawOrderBook[1], newBids))
    ]
    return updatedOrderbook
}

/*
 * Update list of orders with new orders
 */
export function getUpdatedOrders(currentOrders: RawOrderList, newOrders: RawOrderList): RawOrderList {
    // First, all new orders should be included
    let updatedOrders: RawOrderList = newOrders;

    // Second, for old orders, include them if their prices don't match existing orders
    for (let i=0; i < currentOrders.length; i++) {
        if (!updatedOrders.find(updatedOrder => updatedOrder[0] == currentOrders[i][0])) {
            updatedOrders.push(currentOrders[i])
        }
    }

    return updatedOrders
}

/*
 * Post orderbook from this web worker to React
 */
export function postOrderBook(action: OrderBookAction, rawOrderBook: RawOrderBook): void { 
    if (typeof rawOrderBook === 'undefined') return;   
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

/* 
 * Remove order levels with size of 0
 */
export function removeZeros(orders: RawOrderList): RawOrderList {
    const trimmedOrders: RawOrderList = orders.filter(order => order[1] != 0);
    return trimmedOrders
}