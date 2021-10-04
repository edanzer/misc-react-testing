// Import Resources
import { useEffect, useState } from "react"
import { FinishedOrderList } from "../types/orderBookTypes";

// eslint-disable-next-line
import Worker from "worker-loader!../workers/orders.worker.ts";

export const useOrderWorker = () => {

    const [ asks, setAsks ] = useState<FinishedOrderList>([])
    const [ bids, setBids ] = useState<FinishedOrderList>([])

    useEffect(() => {
        const worker = new Worker()
        function handleMessage(e: any) {
            if (e.data.type === "SNAPSHOT") {
                setAsks(e.data.asks)
                setBids(e.data.bids)
            }
        }
        worker.addEventListener('message', handleMessage);
    }, [])

    return { asks, bids } 
}
