import createInstanceFactory from './create-instance';
import { IFactories, IPureFactories } from './types';
import allNames from './utils/all-names';
import mapObject from './utils/map-object';

export const prepareAll = <C extends object>(container: C): C =>
  mapObject(container, name => container[name]);

export const factoriesFrom = <C extends object, N extends keyof C = keyof C>(
  container: C,
  names?: N[],
): IPureFactories<Pick<C, N>> =>
    mapObject<C, N, IPureFactories<Pick<C, N>>>(container, name => () => container[name], names);

function diContainer<C extends object>(factories: IFactories<C>): C {
  const createInstance = createInstanceFactory(factories);

  const container: C = allNames(factories).reduce<C>(
    (containerObj, name) =>
      Object.defineProperty(containerObj, name, {
        configurable: false,
        enumerable: Object.getOwnPropertyDescriptor(factories, name).enumerable,
        get: () => createInstance(container, name),
      }),
    Object.create(null),
  );

  return container;
}

export default diContainer;
