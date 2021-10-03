// Import Styles
import styles from "./styles.module.css"
import { useOrders }  from "../../hooks/useOrders"

export const OrderBook = () => {

    useOrders();
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
                <div className={`${styles.row} ${styles.buy}`}>
                    <div className={`${styles.item} ${styles.buyPrice}`}>price</div>
                    <div className={styles.item}>size</div>
                    <div className={styles.item}>total</div>
                </div>
            </div>
            <div className={styles.sellTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.item}>Price</div>
                    <div className={styles.item}>Size</div>
                    <div className={styles.item}>Total</div>
                </div>
                <div className={styles.row}>
                    <div className={`${styles.item} ${styles.sellPrice}`}>price</div>
                    <div className={styles.item}>size</div>
                    <div className={styles.item}>total</div>
                </div>
            </div>
            <div className={styles.footer}>
                <button className={styles.toggle}>Toggle Feed</button>
            </div>
        </div>
    )
}
