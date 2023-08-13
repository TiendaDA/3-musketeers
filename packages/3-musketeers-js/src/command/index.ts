import {log} from '../logging';
import {getProvider, Provider} from '../provider';

export function handleInit(
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
}

export function handleTrack(providers: Provider[], args: unknown[]) {
  providers.forEach((p) => {
    p.track(...args);
  });
}
