// Import Resources
import { useEffect, useState } from "react"
import { FinishedOrder } from "../types/orderBookTypes";

// eslint-disable-next-line
import Worker from "worker-loader!../api/workers/orderbook/orders.worker.ts";

export const useSubscribeOrderWorker = () => {
    const [ asks, setAsks ] = useState<FinishedOrder[]>([])
    const [ bids, setBids ] = useState<FinishedOrder[]>([])
    const url = "wss://www.cryptofacilities.com/ws/v1"
    const pair = "PI_XBTUSD"

    useEffect(() => {
        const worker = new Worker()

        worker.postMessage({
            action: "open",
            url,
            pair
        })

        function handleMessage(e: MessageEvent) {
            console.log(e);
            if (e.data.type === "initial" || e.data.type === "update") {
                setAsks(e.data.finishedOrderBook.asks)
                setBids(e.data.finishedOrderBook.bids)
            }
        }
        worker.addEventListener('message', handleMessage);
    }, [])

    return { asks, bids } 
}
