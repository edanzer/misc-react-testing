// Import Resources
import { useEffect, useState, useRef } from "react"
import { FinishedOrder, Pair } from "../types/orderBookTypes";

// eslint-disable-next-line
import Worker from "worker-loader!../api/workers/orderbook/orders.worker.ts";


export const useSubscribeOrderWorker = () => {
    let worker = useRef<Worker | null>(null);
    const url = "wss://www.cryptofacilities.com/ws/v1"

    const [ asks, setAsks ] = useState<FinishedOrder[]>([])
    const [ bids, setBids ] = useState<FinishedOrder[]>([])
    const [ pair, setPair ] = useState<Pair>("PI_XBTUSD")

    function subscribe(pair: Pair ): void {
        if (worker.current) {
            worker.current.postMessage({
                action: "subscribe",
                url,
                pair
            })
        }
        setPair(pair)
    }

    function handleMessage(e: MessageEvent) {
        // console.log(e);
        switch (e.data.type) {
            case "socketOpened":
                subscribe(pair)
                break;
            case "update":
                setAsks(e.data.finishedOrderBook.asks)
                setBids(e.data.finishedOrderBook.bids)
        }
    }

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker()
            
            worker.current.postMessage({ action: "open", url, pair })
            worker.current.addEventListener('message', handleMessage);
        }

        return () => {               
            worker.current?.postMessage({action: "close" })
            worker.current?.removeEventListener('message', handleMessage);
            worker.current = null;
        }
    }, [])

    return { asks, bids, pair, subscribe } 
}
