type Args = unknown[];
type Fn<A extends Args, R> = (...args: A) => R;

function getFirstArg<A extends Args>(): A[0] {
  return arguments[0]; // eslint-disable-line prefer-rest-params
}

const memo = <A extends Args, R, K = A[0]>(
  fn: Fn<A, R>,
  cache = new Map<K, R>(),
  getKey: Fn<A, K> = getFirstArg as Fn<A, K>,
): Fn<A, R> => function memoized() {
    const key: K = getKey.apply(this, arguments); // eslint-disable-line prefer-rest-params
    if (cache.has(key)) return cache.get(key);

    const result: R = fn.apply(this, arguments); // eslint-disable-line prefer-rest-params
    cache.set(key, result);

    return result;
  };

export default memo;
