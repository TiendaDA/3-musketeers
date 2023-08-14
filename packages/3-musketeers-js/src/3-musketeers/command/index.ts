import {Provider} from '../provider';

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
    p.pageView(name, params);
  });
}

export function handleTrack(providers: Provider[], args: unknown[]) {
  providers.forEach((p) => {
    const [eventName, params, callback] = args as [
      string,
      Record<string, unknown>,
      () => void,
    ];
    p.track(eventName, params, callback);
  });
}

export function handleIdentify(providers: Provider[], args: unknown[]) {
  providers.forEach((p) => {
    const [userId, params] = args as [
      string,
      Record<string, unknown>,
      () => void,
    ];
    p.identify(userId, params);
  });
}
