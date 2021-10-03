export type Price = number
export type Size = number
export type Total = number
export type RawOrder = [Price, Size]
export type FinishedOrder = [Price, Size, Total]
export type RawOrderList = RawOrder[]
export type FinishedOrderList = FinishedOrder[]