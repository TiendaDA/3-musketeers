import {loadScript} from '../../../utils';
import {Provider, ProviderInitOptions} from '../provider';

type CustomerIoOptions = {
  useArrayParams?: boolean;
  autoTrackPage?: boolean;
  useInApp?: boolean;
  crossSiteSupport?: boolean;
  enableInMemoryStorage?: boolean;
};
const defaultOptions: CustomerIoOptions = {
  useArrayParams: true,
  autoTrackPage: true,
};

export class CustomerIo extends Provider {
  static providerName: string = 'customer-io';
  mapTrackEventName: ProviderInitOptions['mapTrackEventName'];

  init(
    siteId: string,
    options: ProviderInitOptions = {},
    customerIoOptions: CustomerIoOptions = defaultOptions,
    location: 'EU' | 'US' = 'US'
  ): void {
    Provider.logAction('INIT', `[${CustomerIo.providerName}]`, siteId);
    this.saveOptions(options);

    const {
      useArrayParams,
      autoTrackPage,
      useInApp,
      crossSiteSupport,
      enableInMemoryStorage,
    } = customerIoOptions;

    const _cio = window._cio || [];

    const a = function (f) {
      return function () {
        // eslint-disable-next-line prefer-rest-params
        _cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    const methods = [
      'load',
      'identify',
      'sidentify',
      'track',
      'page',
      'on',
      'off',
    ];

    for (const method of methods) {
      _cio[method] = a(method);
    }

    let src = 'https://assets.customer.io/assets/track.js';
    if (location === 'EU')
      src = 'https://assets.customer.io/assets/track-eu.js';

    const attributes: Record<string, string> = {
      id: 'cio-tracker',
      'data-site-id': siteId,
      'data-use-array-params': `${!!useArrayParams}`,
      'data-auto-track-page': `${!!autoTrackPage}`,
      'data-use-in-app': `${!!useInApp}`,
      'data-cross-site-support': `${!!crossSiteSupport}`,
      'data-enable-in-memory-storage': `${!!enableInMemoryStorage}`,
    };

    loadScript(src, {async: true, attributes});
  }
  ready(): boolean {
    return !!window._cio;
  }
  pageView(name: string, params?: Record<string, string> | undefined): void {
    Provider.logAction('PAGE', `[${CustomerIo.providerName}]`, name, params);
    window._cio.page(name, params);
  }
  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const name = this.getTrackEventName(eventName);
    Provider.logAction('TRACK', `[${CustomerIo.providerName}]`, name, params);
    window._cio.track(name, params);
    if (typeof callback === 'function') callback();
  }
  identify(userId: string, params?: Record<string, unknown> | undefined): void {
    window._cio.identify({
      id: userId,
      created_at: Date.now(),
      ...params,
    });
  }
}
