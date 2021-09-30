//Import Resources
import classnames from "classnames"

// Import Styles
import styles from "./styles.module.css"

interface TableHeaderProps {
    orderType: string
}

export const TableHeader = ( {orderType }: TableHeaderProps) => {

    const headerClasses = classnames(
        styles.header, {
            [styles.buy]: orderType==="buy", 
            [styles.sell]: orderType==="sell"
        }
    )

    return (
        <div className={headerClasses}>
            <div className={styles.item}>Price</div>
            <div className={styles.item}>Size</div>
            <div className={styles.item}>Total</div>
        </div>
    )
}
