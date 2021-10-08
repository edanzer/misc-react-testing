import { FinishedOrder, OrderType } from "../../types/orderBookTypes"

// Import Styles
import styles from "./styles.module.css"

interface OrderBookTableProps {
    orders: FinishedOrder[],
    orderType: OrderType
    total: number
}

interface RowBackground {
    background: string
}

export const OrderBookTable = ({orders, orderType, total}: OrderBookTableProps) => {

    const getRowBackground = (rowTotal: number ): RowBackground => {
        const fraction = rowTotal/total
        const direction = orderType === "bid" ? "-90deg" : "90deg"
        const color = orderType === "bid" ? "rgba(0, 163, 108, .15)" : "rgba(238, 75, 43, .15)"

        const background = `linear-gradient(${direction}, ${color} ${toPercent(fraction)}, rgba(0,0,0,0) ${toPercent(fraction + .001)})`

        const rowBackground = {
            background
        };

        return rowBackground;
    }

    const toPercent = (num: number ): string => {
        return num.toLocaleString('en-US',{style: 'percent', minimumFractionDigits:2})
    }
    
    return (
        <div className={styles[orderType + "Table"]}>
            <div className={`${styles.tableHeader} ${styles[orderType]}`}>
                <div className={styles.item}>Price</div>
                <div className={styles.item}>Size</div>
                <div className={styles.item}>Total</div>
            </div>
                {
                    orders.map((row: FinishedOrder) => (
                        <div key={row.price.toFixed(2)} className={`${styles.row} ${styles[orderType]}`} style={getRowBackground(row.total)}>
                            <div className={`${styles.item} ${styles[orderType + "Price"]}`}>{row.price.toFixed(2)}</div>
                            <div className={styles.item}>{row.size.toLocaleString('en')}</div>
                            <div className={styles.item}>{row.total.toLocaleString('en')}</div>
                        </div>
                    ))
                }
        </div>
    )
}
