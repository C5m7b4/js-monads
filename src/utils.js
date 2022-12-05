export const compose =
  (...fns) =>
  (x) =>
    fns.reduce((y, f) => f(y), x);

export const formatMoney = (x) => {
  x = x.toString();
  const pos = x.indexOf('.');
  const left = x.substring(0, pos);
  let right = x.substring(pos + 1);
  if (right.length === 1) {
    right = right + '0';
  }
  return `${left}.${right}`;
};
