/* 
 * Orderbook Types 
 */

// Basic data
export type Price = number
export type Size = number
export type Total = number

// Raw orders received from websocket
export type RawOrder = [Price, Size]
export type RawOrderBook = [ RawOrder[], RawOrder[] ]

// Finished orders, with totals, sent from worker to react
export type FinishedOrder = {price: Price, size: Size, total: Total}
export type FinishedOrderBook = {asks: FinishedOrder[], bids: FinishedOrder[]}

// Orderbook actions and types
export type OrderBookAction = "initial" | "update" | "clear"
export type OrderType = 'asks' | 'bids';