import { IFactory, IFactoryTuple } from './types';
import memo from './utils/memo';

type Releasable<C extends {}> = {
  release: (container: C) => void;
}

const factorySingleton = <C extends {}, N extends keyof C>(
  factory: IFactory<C, N>,
): IFactory<C, N> & Releasable<C> => {
  const cache = new Map<C, C[N]>();

  const release = (container: C) => { cache.delete(container); };

  return Object.assign(
    memo(factory, cache),
    { release },
  );
};

const getContainer = <C>(_: any, container: C) => container;

const factoryTupleSingleton = <C extends {}, N extends keyof C>(
  [factory, initializer]: IFactoryTuple<C, N>,
): IFactoryTuple<C, N> & Releasable<C> => {
  const fCache = new Map<C, C[N]>();
  const iCache = new Map<C, void>();

  const release = (container: C) => {
    fCache.delete(container);
    iCache.delete(container);
  };

  const tuple: IFactoryTuple<C, N> = [
    memo(factory, fCache),
    memo(initializer, iCache, getContainer),
  ];

  return Object.assign(tuple, { release });
};

type ISingleton = {
  <C extends {}, N extends keyof C>(
    factory: IFactory<C, N>
  ): IFactory<C, N> & Releasable<C>;

  <C extends {}, N extends keyof C>(
    factoryTuple: IFactoryTuple<C, N>
  ): IFactoryTuple<C, N> & Releasable<C>;
}

const singleton: ISingleton = factoryOrTuple =>
  (Array.isArray(factoryOrTuple)
    ? factoryTupleSingleton(factoryOrTuple as any)
    : factorySingleton(factoryOrTuple)) as any;

export default singleton;
