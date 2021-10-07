// Import Resources
import { useEffect, useState } from "react"
import { FinishedOrder } from "../types/orderBookTypes";

// eslint-disable-next-line
import Worker from "worker-loader!../api/workers/orderbook/orders.worker.ts";

export const useSubscribeOrderWorker = () => {

    const [ asks, setAsks ] = useState<FinishedOrder[]>([])
    const [ bids, setBids ] = useState<FinishedOrder[]>([])

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
