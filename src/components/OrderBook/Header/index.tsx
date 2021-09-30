// Import Styles
import styles from "./styles.module.css"

export const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.title}>Order Book</div>
            <div className={styles.spread}>Spread</div>
        </div>
    )
}
