import { useOrders }  from "../../hooks/useOrders"
import { FinishedOrder } from "../../types/orderBookTypes"

// Import Styles
import styles from "./styles.module.css"

export const OrderBook = () => {

    const { asks, bids } = useOrders();

    return (
        <div className={styles.orderbook}>
            <div className={styles.header}>
                <div className={styles.title}>Order Book</div>
                <div className={styles.spread}>Spread</div>
            </div>
            <div className={styles.buyTable}>
                <div className={`${styles.tableHeader} ${styles.buy}`}>
                    <div className={styles.item}>Price</div>
                    <div className={styles.item}>Size</div>
                    <div className={styles.item}>Total</div>
                </div>
                    {
                        bids.map((row: FinishedOrder) => (
                            <div key={row[0].toFixed(2)} className={`${styles.row} ${styles.buy}`}>
                                <div className={`${styles.item} ${styles.buyPrice}`}>{row[0].toFixed(2)}</div>
                                <div className={styles.item}>{row[1].toLocaleString('en')}</div>
                                <div className={styles.item}>{row[2].toLocaleString('en')}</div>
                            </div>
                        ))
                    }
            </div>
            <div className={styles.sellTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.item}>Price</div>
                    <div className={styles.item}>Size</div>
                    <div className={styles.item}>Total</div>
                </div>
                    {
                        asks.map((row: FinishedOrder) => (
                            <div key={row[0].toFixed(2)} className={styles.row}>
                                <div className={`${styles.item} ${styles.sellPrice}`}>{row[0].toFixed(2)}</div>
                                <div className={styles.item}>{row[1].toLocaleString('en')}</div>
                                <div className={styles.item}>{row[2].toLocaleString('en')}</div>
                            </div>
                        ))
                    }
            </div>
            <div className={styles.footer}>
                <button className={styles.toggle}>Toggle Feed</button>
            </div>
        </div>
    )
}
