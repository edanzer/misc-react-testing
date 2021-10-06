/* 
 * Orderbook Types 
 */

// Basic data
export type Price = number
export type Size = number
export type Total = number

// Raw orders received from websocket
export type RawOrder = [Price, Size]
export type RawOrderList = RawOrder[]
export type RawOrderBook = [ RawOrderList, RawOrderList ]

// Finished orders, with totals, sent from worker to react
export type FinishedOrder = {price: Price, size: Size, total: Total}
export type FinishedOrderList = FinishedOrder[]
export type FinishedOrderBook = {asks: FinishedOrderList, bids: FinishedOrderList}

// Orderbook actions
export enum OrderBookAction {Initial = "initial", Update = "update", Clear = "clear"}