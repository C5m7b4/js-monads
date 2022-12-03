const isNullOrUndef = (v) => v === null || typeof v === 'undefined';

const maybe = (x) => ({
  isNothing: () => isNullOrUndef(x),
  extract: () => x,
});

export const Maybe = {
  just: maybe,
  nothing: () => maybe(null),
};
