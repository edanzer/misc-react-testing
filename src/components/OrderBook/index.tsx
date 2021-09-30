// Import Componetns
import { Header } from './Header'
import { Table } from './Table'
import { Footer } from './Footer'

// Import Styles
import styles from "./styles.module.css"

export const OrderBook = () => {
    return (
        <div className={styles.orderbook}>
            <Header/>
            <Table orderType="buy" />
            <Table orderType="sell" />
            <Footer />
        </div>
    )
}
