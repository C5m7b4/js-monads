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
