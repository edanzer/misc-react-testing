import { useEffect, useState, useRef, useCallback } from "react"
import { FinishedOrder, Pair } from "../types/orderBookTypes";

/*
 * NOTE: Loading web workers is tricky without ejecting Create React App.
 * The below method was the simplest of immediate obvious options.
 * But it also requires an extra line for eslint.
 */
// eslint-disable-next-line
import Worker from "worker-loader!../api/workers/orderbook/orders.worker.ts";

export const useSubscribeOrderWorker = (): { asks: FinishedOrder[], bids: FinishedOrder[], pair: Pair, subscribe: Function} => {
    let worker = useRef<Worker | null>(null);
    const url = "wss://www.cryptofacilities.com/ws/v1"

    const [ asks, setAsks ] = useState<FinishedOrder[]>([])
    const [ bids, setBids ] = useState<FinishedOrder[]>([])
    /*
     * NOTE: The pair should likely belong to global state. 
     * Other aspects of the trading interface, like charts,
     * will also udpate based on the pair.
     */
    const [ pair, setPair ] = useState<Pair>("PI_XBTUSD")

    const subscribe = useCallback((newPair: Pair) => {
        if (worker.current) {
            worker.current.postMessage({
                action: "subscribe",
                url,
                pair: newPair
            })
        }
        setPair(newPair)
    }, []);

    /* 
     * NOTE: This method should be updated to handle other
     * possible message types received from worker.
     */
    function handleMessagefromWorker(e: MessageEvent) {
        switch (e.data.type) {
            case "socketOpened":
                subscribe(pair)
                break;
            case "update":
                setAsks(e.data.finishedOrderBook?.asks)
                setBids(e.data.finishedOrderBook?.bids)
                break;
        }
    }

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker()
            
            worker.current.postMessage({ action: "open", url, pair })
            worker.current.addEventListener('message', handleMessagefromWorker);
        }

        return () => {               
            worker.current?.postMessage({action: "close" })
            worker.current?.removeEventListener('message', handleMessagefromWorker);
            worker.current = null;
        }
    }, [])

    return { asks, bids, pair, subscribe } 
}
