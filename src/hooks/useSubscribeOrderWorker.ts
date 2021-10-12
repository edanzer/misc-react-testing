import { useEffect, useState, useRef, useCallback } from "react"
import { FinishedOrder, Pair } from "../types/orderBookTypes";

/*
 * NOTE: Loading web workers is tricky without ejecting Create React App.
 * The below method was the simplest of immediate obvious options.
 * But it also requires an extra line for eslint.
 */
// eslint-disable-next-line
import Worker from "worker-loader!../api/workers/orderbook/orders.worker.ts";

export const useSubscribeOrderWorker = (url: string, pair: Pair): { asks: FinishedOrder[], bids: FinishedOrder[], openSocket: Function, closeSocket: Function, subscribeToPair: Function, } => {
    let worker = useRef<Worker | null>(null);
    const [ asks, setAsks ] = useState<FinishedOrder[]>([])
    const [ bids, setBids ] = useState<FinishedOrder[]>([])

    /* 
     * Sends message to worker to open the socket
     */
    const openSocket = useCallback(() => {
        if (!worker.current) {
            worker.current = new Worker()
            
            worker.current.postMessage({ action: "open", url })
            worker.current.addEventListener('message', handleMessagefromWorker)
            document.addEventListener("visibilitychange", handleWindowLoseFocus)
        }
    }, [url]);

    /* 
     * Sends message to worker to close the socket
     */
    const closeSocket = useCallback(() => {
        if (worker.current) {
            worker.current?.postMessage({action: "close" })
            worker.current?.removeEventListener('message', handleMessagefromWorker)
            document.removeEventListener("blur", handleWindowLoseFocus);
            worker.current = null;
        }
    }, []);

    /* 
     * Sends message to worker to subscribe to trading pair
     */
    const subscribeToPair = useCallback((newPair: Pair) => {
        if (worker.current) {
            worker.current.postMessage({
                action: "subscribe",
                pair: newPair
            })
        }
    }, []);

    /* 
     * Handles incoming messages from Socket
     *
     * NOTE: This method should be updated to handle other
     * possible message types received from worker.
     */
    const handleMessagefromWorker = (e: MessageEvent) => {
        switch (e.data.type) {
            case "socketOpened":
                subscribeToPair(pair)
                break;
            case "update":
                setAsks(e.data.finishedOrderBook?.asks)
                setBids(e.data.finishedOrderBook?.bids)
                break;
        }
    }

    /* 
     * Ensure that socket is closed when window loses focus.
     * Reopen socket if window comes back in focus.
     */
    const handleWindowLoseFocus = () => {
        if(document.visibilityState==="hidden"){
            console.log("Tab lost visibility. Socket closed.")
            closeSocket()
        }
        else{
            console.log("Tab now visible. Socket opened")
            openSocket()
            subscribeToPair(pair)
        }
    } 

    useEffect(() => {
        openSocket()
    
        return () => {               
            closeSocket()
        }
    }, [])

    return { asks, bids, openSocket, closeSocket, subscribeToPair } 
}
