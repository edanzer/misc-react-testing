import { useState, useEffect } from "react"
import { useSubscribeOrderWorker }  from "../../hooks/useSubscribeOrderWorker"
import { OrderBookTable } from "../OrderBookTable"

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
            <OrderBookTable orderType="bid" orders={bids} />
            <OrderBookTable orderType="ask" orders={asks} />
            <div className={styles.footer}>
                <button className={styles.toggle}>Toggle Feed</button>
            </div>
        </div>
    )
}
