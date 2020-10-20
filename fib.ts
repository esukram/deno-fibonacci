import { MuxAsyncIterator } from "https://deno.land/std@0.74.0/async/mod.ts";
import { pooledMap } from "https://deno.land/std@0.74.0/async/mod.ts"
import { deferred } from "https://deno.land/std@0.74.0/async/deferred.ts"

let baseUrl = 'http://localhost:8000/fib/'
function setBaseUrl(url: string) {
  baseUrl = `${url}/fib/`;
}

async function fetchFib(fib: number): Promise<number> {
  const response = await fetch(`${baseUrl}${fib}`);
  const json = await response.json();

  return json.result;
}

async function fib(fib: number): Promise<number> {
  if ( fib <= 1 ) return 1;

  const prev2 = fetchFib(fib - 2);
  const prev1 = fetchFib(fib - 1);

  let temp: number = 0;
  function increaseNumer(value: number) {
    temp += value;
  }

  await Promise.all( [prev1, prev2] ).then(( [ result1, result2] ) => {
    increaseNumer(result1 + result2);
  });

  for (let i = 0; i < 1000; i++) { }

  return temp;
}

export { fib as fibonacci };
export { setBaseUrl };
