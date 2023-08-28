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

    const _cio = _cio || [];
    (function () {
      const a, b, c;
      a = function (f) {
        return function () {
          _cio.push([f].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      b = ['load', 'identify', 'sidentify', 'track', 'page', 'on', 'off'];
      for (c = 0; c < b.length; c++) {
        _cio[b[c]] = a(b[c]);
      }
      const t = document.createElement('script'),
        s = document.getElementsByTagName('script')[0];
      t.async = true;
      t.id = 'cio-tracker';
      t.setAttribute('data-site-id', siteId);

      t.setAttribute('data-use-array-params', `${!!useArrayParams}`);
      t.setAttribute('data-auto-track-page', `${!!autoTrackPage}`);
      t.setAttribute('data-use-in-app', `${!!useInApp}`);
      t.setAttribute('data-cross-site-support', `${!!crossSiteSupport}`);
      t.setAttribute(
        'data-enable-in-memory-storage',
        `${!!enableInMemoryStorage}`
      );

      let src = 'https://assets.customer.io/assets/track.js';
      if (location === 'EU')
        src = 'https://assets.customer.io/assets/track-eu.js';

      t.src = src;
      s.parentNode.insertBefore(t, s);
    })();
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
    params?: Record<string, any> | undefined,
    callback?: (() => void) | undefined
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
