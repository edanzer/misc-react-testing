// Import Resources
import classnames from 'classnames';

// Import Components
import { TableRow } from '../TableRow'
import { TableHeader } from '../TableHeader'

// Import Styles
import styles from "./styles.module.css"

interface TableProps {
    orderType: string
}

export const Table = ( {orderType}: TableProps) => {

    const tableClasses = classnames({
        [styles.buy]: orderType==="buy", 
        [styles.sell]: orderType==="sell"
    })

    return (
        <div className={tableClasses}>
            <TableHeader orderType={orderType} />
            <TableRow orderType={orderType} />
            <TableRow orderType={orderType} />
            <TableRow orderType={orderType} />
            <TableRow orderType={orderType} />
            <TableRow orderType={orderType} />
        </div>
    )
}
