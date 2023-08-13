import {Provider} from './provider';
export * from './provider';
import {GoogleAnalytics} from './google-analytics';

export function getProvider(providerName: string): Provider {
  switch (providerName) {
    case GoogleAnalytics.providerName:
      return new GoogleAnalytics();
  }
  return undefined;
}
