import { FinishedOrder } from "../../types/orderBookTypes"

// Import Styles
import styles from "./styles.module.css"

interface OrderBookTableProps {
    orders: FinishedOrder[],
    orderType: string
}

export const OrderBookTable = ({orders, orderType}: OrderBookTableProps) => {

    const tableType = (orderType === "buy") ? "buyTable" : "sellTable"

    return (
        <div className={styles[orderType + "Table"]}>
            <div className={`${styles.tableHeader} ${styles[orderType]}`}>
                <div className={styles.item}>Price</div>
                <div className={styles.item}>Size</div>
                <div className={styles.item}>Total</div>
            </div>
                {
                    orders.map((row: FinishedOrder) => (
                        <div key={row.price.toFixed(2)} className={`${styles.row} ${styles[orderType]}`}>
                            <div className={`${styles.item} ${styles[orderType + "Price"]}`}>{row.price.toFixed(2)}</div>
                            <div className={styles.item}>{row.size.toLocaleString('en')}</div>
                            <div className={styles.item}>{row.total.toLocaleString('en')}</div>
                        </div>
                    ))
                }
        </div>
    )
}
