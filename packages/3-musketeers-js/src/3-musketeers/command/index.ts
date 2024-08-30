import {Provider} from '../provider';
import copy from 'fast-copy';

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
  providers.forEach((p) => {
    const [name, params] = args as [string, Record<string, string>];
    const paramsCopy = copy(params);
    p.pageView(name, paramsCopy);
  });
}

export function handleTrack(providers: Provider[], args: unknown[]) {
  providers.forEach((p) => {
    const [eventName, params, callback] = args as [
      string,
      Record<string, unknown>,
      () => void,
    ];
    const paramsCopy = copy(params);
    p.track(eventName, paramsCopy, callback);
  });
}

export function handleIdentify(providers: Provider[], args: unknown[]) {
  providers.forEach((p) => {
    const [userId, params] = args as [
      string,
      Record<string, unknown>,
      () => void,
    ];
    const paramsCopy = copy(params);
    p.identify(userId, paramsCopy);
  });
}
