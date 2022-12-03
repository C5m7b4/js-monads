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

const a = {
  b: {
    c: 'my code',
  },
};

const appendString = (obj) => obj.b.c + ' works properly';
const result = appendString(a);
console.log(result);

const maybeNumberOne = Maybe.just(1);
const maybeNumberTwo = Maybe.nothing();

console.log('maybe.just is nothing?', maybeNumberOne.isNothing());
console.log('maybe.nothing is nothing?', maybeNumberTwo.isNothing());
