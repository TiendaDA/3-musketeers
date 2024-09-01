import deepClone from '../../utils/deep-clone';
import {filterProviders, Provider} from '../provider';

/*export function handleInit(
  providers: Provider[],
  providerName: string,
  args: unknown[]
) {
  const provider = getProvider(providerName);

  if (!provider) {
    log.error(`Provider '${providerName}' not found`);
    return;
  }

  providers.push(provider);
  provider.init(...args);
}*/

export function handlePageView(providers: Provider[], args: unknown[]) {
  const [name, params, onlyProvider] = args as [
    string,
    Record<string, string>,
    string[],
  ];

  const filteredProviders = filterProviders(providers, onlyProvider);

  filteredProviders.forEach((p) => {
    const paramsCopy = deepClone(params);
    p.pageView(name, paramsCopy);
  });
}

export function handleTrack(providers: Provider[], args: unknown[]) {
  const [eventName, params, onlyProvider, callback] = args as [
    string,
    Record<string, unknown>,
    string[],
    () => void,
  ];

  const filteredProviders = filterProviders(providers, onlyProvider);

  filteredProviders.forEach((p) => {
    const paramsCopy = deepClone(params);
    p.track(eventName, paramsCopy, callback);
  });
}

export function handleIdentify(providers: Provider[], args: unknown[]) {
  const [userId, params, onlyProvider] = args as [
    string,
    Record<string, unknown>,
    string[],
  ];

  const filteredProviders = filterProviders(providers, onlyProvider);

  filteredProviders.forEach((p) => {
    const paramsCopy = deepClone(params);
    p.identify(userId, paramsCopy);
  });
}
