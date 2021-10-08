// Import Resources
import { useEffect, useState, useRef } from "react"
import { FinishedOrder } from "../types/orderBookTypes";

// eslint-disable-next-line
import Worker from "worker-loader!../api/workers/orderbook/orders.worker.ts";

export const useSubscribeOrderWorker = () => {
    let worker = useRef<Worker | null>(null);
    const url = "wss://www.cryptofacilities.com/ws/v1"

    const [ asks, setAsks ] = useState<FinishedOrder[]>([])
    const [ bids, setBids ] = useState<FinishedOrder[]>([])
    const [ pair, setPair ] = useState<string>("PI_XBTUSD")
    
    function handleMessage(e: MessageEvent) {
        console.log(e);
        if (e.data.type === "initial" || e.data.type === "update") {
            setAsks(e.data.finishedOrderBook.asks)
            setBids(e.data.finishedOrderBook.bids)
        }
    }

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker()

            worker.current.postMessage({
                action: "open",
                url,
                pair
            })
    
            worker.current.addEventListener('message', handleMessage);
        }

        return () => {
            if (worker.current !== null) {
                worker.current.postMessage({
                    action: "close",
                })
            }
            worker.current = null;
        }
    }, [pair])

    return { asks, bids, pair, setPair } 
}
