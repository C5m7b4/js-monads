import { compose } from './utils';

export const identity = (x) => x;

export const Task = (fork) => ({
  fork,
  map: (f) => Task((err, ok) => fork(err, compose(f, ok))),
  chain: (f) => Task((err, ok) => fork(err, (x) => f(x).fork(err, ok))),
  unwrap: () => this.chain(identity),
});

Task.of = (x) => (_, ok) => ok(x);

Task.http = (method, url, body) => {
  return Task((err, ok) => {
    const r = new XMLHttpRequest();
    r.open(method, url);

    r.addEventListener('readystatechange', () => {
      switch (r.readyState) {
        case 0:
          console.log('awaiting send...');
          break;
        case 1:
          console.log('opened request');
          break;
        case 2:
          console.log('header received');
          break;
        case 3:
          console.log('awaiting data');
          break;
        case 4:
          if (r.status === 200) {
            return ok(JSON.parse(r.responseText));
          } else {
            console.warn(`weird status: ${r.status}`);
          }
          break;
        default:
          console.warn(`unknown ready state: ${r.readyState}`);
          break;
      }
    });

    r.onError = (e) => {
      return err(e);
    };

    r.send(body);
  });
};

// export const Task = (fork) => ({
//   fork,
//   map(f) {
//     return Task((err, ok) => this.fork(err, compose(f, ok)));
//   },
//   chain(f) {
//     return Task((err, ok) => this.fork(err, (x) => f(x).fork(err, ok)));
//   },
//   unwrap() {
//     this.chain(identity);
//   },
// });
