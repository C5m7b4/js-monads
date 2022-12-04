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

## branch 2

lets get rid of this code, but we'll come back to it later

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

now lets add some functionality to this maybe character so we can actually start to do things

```js
const maybe = (x) => ({
  isNothing: () => isNullOrUndef(x),
  extract: () => x,
  map: (f) => (!isNullOrUndef(x) ? Maybe.just(f(x)) : Maybe.nothing()),
});
```

so when we map, if there is something thats mappable, we just return a new maybe and execute the map function of the value that the maybe is holding for us. if the value inside the maybe cant be mapped, we just return a nothing, so this way, nothing ever breaks

now let's modify our testing like so:

```js
const maybeNumberOne = Maybe.just(1);
const mappedJust = maybeNumberOne.map((x) => x + 1);
console.log(mappedJust.extract());

const maybeNumberTwo = Maybe.nothing();
const mappedNothing = maybeNumberTwo.map((x) => x + 1);
console.log(mappedNothing.extract());
```

and then lets remove this code

```js
console.log('maybe.just is nothing?', maybeNumberOne.isNothing());
console.log('maybe.nothing is nothing?', maybeNumberTwo.isNothing());
```

now, we should see this in the console:

![alt test](images/07-test.png)

so, when we mapped over the first maybe that was holding a 1, we just added 1 to it, but when we mapped over the second maybe that was holding nothing, nothing broke. all is well in the world.

now that we seen that we can map, we can bring back in a version of our origin problem and see how maybe solves that problem of things blowing up.

```js
const a = {
  b: {
    c: 'my code',
  },
};

const maybeA = Maybe.just(a)
  .map((a) => a.b)
  .map((b) => b.c)
  .map((c) => c + ' works perfectly')
  .extract();

console.log(maybeA);
```

now your console should be printing our that you code works perfectly again, and we can run our tests where we remove c

```js
const a = {
  b: {},
};
```

you should just see null in the console, and now if we remove b

```js
const a = {};
```

still just getting null, and we know from previously, that this would have blown up our console.

## branch 3

i wanted to start a new branch here because we are going to be modifying our example to use something called point free. this is just going to be a way of passing higher order functions so that the mapping process will automatically feed the results of the previous function into the next function. lets take a look

in our idex.js file, lets add this code near the top

```js
const prop = (propName) => (obj) => obj[propName];
const append = (appendee) => (appendix) => appendix + appendee;
```

so, lets talk about these

- prop is a function that takes a propname and returns a function that takes an object and returns a function that fetches the property of that object. so if we have an object that looks like our a object we have been using, then calling

```js
console.log(prop('b')(a));
```

this should print:

![alt code](images/08-my-code.png)

lets clarify one thing right here. if you console is throwing up errors, thats probably because eslint is telling you that are have defined a variable and are not using it. we can change that one of two ways, you can either comment out the line declaring the append function because we are not using it or we can add something to eslintrs.json to fix this. open up the eslintrc.json file and make this modification:

```js
      "react/prop-types": 0,
      "react/react-in-jsx-scope":0,
      "no-console": 0,
      "no-debugger": 1,
      "no-unused-vars": 0
```

the no-unused-vars is the one we are adding. Now you will have to kill webpack and then run an npm start again, but now your console should be clean even with the unused variable declaration.

now everything should be good

- the append function takes in an appendee and returns a function that expects appendix and then just returns the concatenation of the two. so now we can put these guys to use

```js
const maybeA = Maybe.just(a)
  .map(prop('b'))
  .map(prop('c'))
  .map(append(' works perfectly again'))
  .extract();
```

we can remove the test line for prop

```js
// console.log(prop('b')(a));
```

that was just an example, but the code still works fine:

![alt works](images/09-works.png)

Now, I'm not the biggest fan of this because for me, this might look hard to read. we know that Maybe is holding an a, but a year from now, this might confuse us when we come back to this code. I promise, I will come back and show you an acceptable and much more reabable way, but I figured some people would like this approach.

## branch 4

now, lets add a function that can add a composable feel to our maybes. We'll see what composable in later, and I probably should have shown that first, but we are winging this so, that that. here is our new maybe function

```js
export const Maybe = {
  just: maybe,
  nothing: () => maybe(null),
  chain: (...fns) => (x) => fns.reduce((y, f) => y.map(f), x)
};
```

now lets change our test code:

```js
const appendToC = Maybe.chain(prop('b'), prop('c'), append(' works still'));

const goodInput = Maybe.just({
  b: {
    c: 'my code',
  },
});

const badInput = Maybe.just({});

console.log(appendToC(goodInput).extract());
console.log(appendToC(badInput).extract());
```

just for posteritys sake, your index.js should look liks this now:

```js
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

```

and your Maybe.js should look like this:

```js
const isNullOrUndef = (v) => v === null || typeof v === 'undefined';

const maybe = (x) => ({
  isNothing: () => isNullOrUndef(x),
  extract: () => x,
  map: (f) => (!isNullOrUndef(x) ? Maybe.just(f(x)) : Maybe.nothing()),
});

export const Maybe = {
  just: maybe,
  nothing: () => maybe(null),
  chain:
    (...fns) =>
    (x) =>
      fns.reduce((y, f) => y.map(f), x),
};

```

just wanted to clear that up. now our console should look like this:

![alt still-works](images/010-still-works.png)

i think this is pretty dope all the way through. hopefully this was all a good understanding of what you can really do with this wil actual real data, but if not, we'll look at that too in the next branch
