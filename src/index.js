console.log('you are ready to start coding...');
import { Maybe } from './Maybe';

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const main = document.createElement('div');
const child = document.createElement('p');
child.innerHTML = 'Hello';
main.appendChild(child);
root.appendChild(main);

const maybeNumberOne = Maybe.just(1);
const mappedJust = maybeNumberOne.map((x) => x + 1);
console.log(mappedJust.extract());

const maybeNumberTwo = Maybe.nothing();
const mappedNothing = maybeNumberTwo.map((x) => x + 1);
console.log(mappedNothing.extract());

const prop = (propName) => (obj) => obj[propName];
const append = (appendee) => (appendix) => appendix + appendee;

const appendToC = Maybe.chain(prop('b'), prop('c'), append(' works still'));

const goodInput = Maybe.just({
  b: {
    c: 'my code',
  },
});

const badInput = Maybe.just({});

console.log(appendToC(goodInput).extract());
console.log(appendToC(badInput).extract());

import { data } from './data';
import { formatMoney } from './utils';

const maybeData = Maybe.just(data)
  .map((x) => x.filter((i) => i.dept === 32))
  .map((x) => x.filter((i) => i.price > 2))
  .map((x) => x.map((i) => ({ ...i, price: formatMoney(i.price) })))
  .extract();
console.log(maybeData);

console.log('********************* tasks');
import { Task } from './Task';

Task.test = (x) =>
  Task((err, ok) => {
    try {
      return ok([1, 2, 3, 4, 5]);
    } catch (e) {
      return err(e);
    }
  });

const processData = (data) => data.map((x) => x + 1);

const testTask = Task.test(5).map(processData);

testTask.fork(console.err, (x) => {
  console.log('x', x);
});

const URL = 'https://jsonplaceholder.typicode.com/users/1/todos';
const reverseById = (x) => x.sort((a, b) => b.id - a.id);
const todos = Task.http('GET', URL).map(reverseById);

todos.fork(console.error, (xs) => {
  console.log('xs', xs);
});

const myData = Task.http('GET', 'https://localhost:7237/test/testdb');

myData.fork(console.warn, (x) => console.log('data', x));
