# js-monads

here we are going to take a look at a few monads

lets create a folder in our programming folder and call it js-monads

bring up the command prompt in the folder and type

```js
npx kreat
```

you should see this:

![alt setup](images/01-setup.png)

Im choosing javascript playground for this repo. then just answer the questions for if you want as git repo and if you want to install the dependencies. I would suggest at least for installing the dependencies as you are going to have to do that at some point.

now you can open that project in vscode.

now lets bring up the terminal and type 

```js
npm start
```

you should be presented with this in the console after webpack starts up

![alt ready](images/02-ready.png)

## branch 1

### Maybe monad

lets firt start with a problem. say we had this code:

```js
const a = {
  b: {
    c: 'my code',
  },
};

const appendString = (obj) => obj.b.c + ' works properly';
const result = appendString(a);
console.log(result);

```

save it and your web console should look like this:

![alt works](images/03-works.png)

now what happens if say we remove c

```js
const a = {
  b: {},
};
```

ok, it doesnt entirely break, but it looks kind of strange, right:

![alt strange](images/04-strange.png)

if we ask a for is b child, now problem, but when we ask b for its c child its just undefined and thats actually not really a problem per say. the code will still work, you just wont get the wished for outcome, right?

now, what happens if we remove b

```js
const a = {};
```

ok, now we really have a problem:

![alt broken](images/05-broken.png)

if we ask a for its b child, its not there. no problem. but if we try to ask b for its c child, well, b is not there and therefore has no children so things will start to blow up.

so, how do we solve for this problem? bring in the Maybe monad.

lets create a file called Maybe.js

we are first going to start out with some helper functions

```js
const isNullOrUndef = (v) => v === null || typeof v === 'undefined';

const maybe = (x) => ({
  isNothing: () => isNullOrUndef(x),
  extract: () => x
})
```

lets start out with a simple factory function like so:

```js
export const Maybe = {
  just: maybe,
  nothing: () => maybe(null),
};
```

we will start with that and then come back later and add some more functions to it.

first let's test it out and see if everything works, so in our index.js file, lets add this:

at the top of the file, lets import our Maybe function

```js
import { Maybe } from './Maybe';
```

then ad the end of the file, lets write some testing code

```js
const maybeNumberOne = Maybe.just(1);
const maybeNumberTwo = Maybe.nothing();

console.log('maybe.just is nothing?', maybeNumberOne.isNothing());
console.log('maybe.nothing is nothing?', maybeNumberTwo.isNothing());
```

now we should see this in our console.

![alt test](images/06-test.png)

lets commit what we have so far, and we'll continue in the next branch.
