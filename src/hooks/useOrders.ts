// Import Resources
import { useEffect } from "react"

// eslint-disable-next-line
import Worker from "worker-loader!../workers/orders.worker.ts";

export const useOrders = () => {
    useEffect(() => {
        const worker = new Worker()
        function handleMessage(e: any) {
            console.log(e)
        }
        worker.addEventListener('message', handleMessage);
    }, [])
}
