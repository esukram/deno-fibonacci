import * as fibModule from './fib.ts'

self.onmessage = async (message) => {
  const data = message.data;

  fibModule.setBaseUrl(`http://${data.host}:${data.port}`);
  const fib = await fibModule.fibonacci(data.number);

  self.postMessage(fib);
  self.close();
};

