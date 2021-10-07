import { useState, useEffect } from "react"
import { useSubscribeOrderWorker }  from "../../hooks/useSubscribeOrderWorker"
import { FinishedOrder } from "../../types/orderBookTypes"

// Import Styles
import styles from "./styles.module.css"

export const OrderBook = () => {

    const { asks, bids } = useSubscribeOrderWorker()
    const [ spread, setSpread ] = useState<number>(0)
    const [ spreadPercent, setSpreadPercent ] = useState<string>('')
    
    useEffect(() => {
        if (asks[0] && bids[0]) setSpread(asks[0].price - bids[0].price)
    }, [asks, bids])

    useEffect(() => {
        if (asks[0] && bids [0]) {
            const percent = (spread/asks[0].price).toLocaleString('en-US',{style: 'percent', minimumFractionDigits:2})
            setSpreadPercent(percent);
        }
    }, [spread])

    return (
        <div className={styles.orderbook}>
            <div className={styles.header}>
                <div className={styles.title}>Order Book</div>
                <div className={styles.spread}>Spread: {`${spread} (${spreadPercent})`}</div>
            </div>
            <div className={`${styles.table} ${styles.buyTable}`}>
                <div className={`${styles.tableHeader} ${styles.buy}`}>
                    <div className={styles.item}>Price</div>
                    <div className={styles.item}>Size</div>
                    <div className={styles.item}>Total</div>
                </div>
                    {
                        bids.map((row: FinishedOrder) => (
                            <div key={row.price.toFixed(2)} className={`${styles.row} ${styles.buy}`}>
                                <div className={`${styles.item} ${styles.buyPrice}`}>{row.price.toFixed(2)}</div>
                                <div className={styles.item}>{row.size.toLocaleString('en')}</div>
                                <div className={styles.item}>{row.total.toLocaleString('en')}</div>
                            </div>
                        ))
                    }
            </div>
            <div className={`${styles.table} ${styles.sellTable}`}>
                <div className={styles.tableHeader}>
                    <div className={styles.item}>Price</div>
                    <div className={styles.item}>Size</div>
                    <div className={styles.item}>Total</div>
                </div>
                    {
                        asks.map((row: FinishedOrder) => (
                            <div key={row.price.toFixed(2)} className={styles.row}>
                                <div className={`${styles.item} ${styles.sellPrice}`}>{row.price.toFixed(2)}</div>
                                <div className={styles.item}>{row.size.toLocaleString('en')}</div>
                                <div className={styles.item}>{row.total.toLocaleString('en')}</div>
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
