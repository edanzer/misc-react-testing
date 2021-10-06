// Import Resources
import { useEffect, useState } from "react"
import { FinishedOrderList } from "../types/orderBookTypes";

// eslint-disable-next-line
import Worker from "worker-loader!../api/workers/orderbook/orders.worker.ts";

export const useOrderWorker = () => {

    const [ asks, setAsks ] = useState<FinishedOrderList>([])
    const [ bids, setBids ] = useState<FinishedOrderList>([])

    useEffect(() => {
        const worker = new Worker()
        function handleMessage(e: any) {
            if (e.data.type === "initial" || e.data.type === "update") {
                // console.log(e);
                setAsks(e.data.finishedOrderBook.asks)
                setBids(e.data.finishedOrderBook.bids)
            }
        }
        worker.addEventListener('message', handleMessage);
    }, [])

    return { asks, bids } 
}
