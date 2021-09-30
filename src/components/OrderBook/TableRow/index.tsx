// Import Resources
import classnames from "classnames"

// Import Styles
import styles from "./styles.module.css"

interface TableRowProps {
    orderType: string
}

export const TableRow = ( {orderType}: TableRowProps ) => {

    const rowClasses = classnames(
        styles.row, {
            [styles.buy]: orderType==="buy", 
            [styles.sell]: orderType==="sell"
        }
    )

    const priceClasses = classnames(
        styles.item, {
            [styles.buy]: orderType==="buy", 
            [styles.sell]: orderType==="sell"
        }
    )

    return (
        <div className={rowClasses}>
            <div className={priceClasses}>price</div>
            <div className={styles.item}>size</div>
            <div className={styles.item}>total</div>
        </div>
    )
    
}
