import { listenAndServe } from "https://deno.land/std@0.74.0/http/server.ts";
import { Status } from "https://deno.land/std@0.74.0/http/http_status.ts";
import { format } from "https://deno.land/std@0.74.0/datetime/mod.ts";

const env = Deno.env.toObject()
const PORT: number = Number(env.PORT) || 8000
const HOST = env.HOST || '127.0.0.1'
const scaleOut: boolean = Boolean(env.SCALE_OUT) || false

console.log(`Listening on ${HOST}:${PORT}`);
const options = { port: PORT };
listenAndServe(options, (req) => {
    if (req.method !== 'GET') {
        return req.respond({ status: Status.NotFound, body: "'Not Found\n" });
    }

    const urlPattern = req.url.match(/^\/fib\/([0-9]+)$/);
    if (! urlPattern ) {
        return req.respond({ status: Status.BadRequest, body: "Bad Request\n" });
    }
    const fib: number = Number(urlPattern[1]);

    const worker = new Worker(new URL("worker.ts", import.meta.url).href, { type: "module", name: "fib_worker" });
    function killWorker() {
        worker.terminate;
    }
    worker.onmessage = function(message) {
        req.respond({ body: `{ "result": ${message.data} }\n` });
        const now = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
        console.log(`[${now}] ${urlPattern[1]} => ${message.data}`);
        killWorker();
    };

    worker.postMessage({
        number: urlPattern[1],
        host: HOST,
        port: scaleOut ? PORT + fib : PORT
    });
});
