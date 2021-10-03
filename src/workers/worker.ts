// self.addEventListener('message', handleMessage);
// function handleMessage(e) {
//   self.postMessage({ ...e.data, received: Date.now() });
// }

let i = 0;

export function timedCount() {
//   i = i + 1;
  postMessage('hello');
//   setTimeout(timedCount(),500);
}

timedCount();