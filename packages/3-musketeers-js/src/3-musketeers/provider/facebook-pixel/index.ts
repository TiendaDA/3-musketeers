import {loadScript} from '../../../utils';
import {Provider, ProviderInitOptions} from '../provider';

type AdvancedMatching = {
  em?: string;
  fn?: string;
  ln?: string;
  ph?: string;
  ge?: 'm' | 'f';
  db?: string;
  ct?: string;
  st?: string;
  zp?: string;
  country?: string;
  external_id?: string;
};

export class FacebookPixel extends Provider {
  static providerName: string = 'facebook-pixel';
  providerName: string = 'facebook-pixel';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];
  private pixelIds: string[] = [];

  init(
    pixelId: string,
    options: ProviderInitOptions = {},
    advancedMatching?: AdvancedMatching
  ): void {
    Provider.logAction('INIT', `[${this.providerName}]`, pixelId);
    this.saveOptions(options);

    if (this.pixelIds.includes(pixelId)) {
      Provider.logAction(
        'INIT',
        `[${this.providerName}]`,
        `Pixel ${pixelId} already initialized`
      );
      return;
    }

    if (!this.ready()) {
      this.initializeFacebookPixelScript();
    }

    this.pixelIds.push(pixelId);
    window.fbq('init', pixelId, advancedMatching);
    window.fbq('track', 'PageView');
  }

  private initializeFacebookPixelScript(): void {
    /* eslint-disable prefer-spread */
    /* eslint-disable prefer-rest-params */
    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    } as never;
    /* eslint-enable prefer-spread */
    /* eslint-enable prefer-rest-params */
    if (!window._fbq) window._fbq = window.fbq;

    window.fbq.push = window.fbq;
    window.fbq.loaded = !0;
    window.fbq.version = '2.0';
    window.fbq.queue = [];

    loadScript(`https://connect.facebook.net/en_US/fbevents.js`);
  }
  ready(): boolean {
    return !!window.fbq;
  }
  pageView(name: string, params?: Record<string, string> | undefined): void {
    Provider.logAction('PAGE', `[${this.providerName}]`, name, params);

    window.fbq('track', 'PageView', params);
  }
  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const {eventName: mappedName, params: mappedParams} = this.getTrackEvent(
      eventName,
      params
    );
    Provider.logAction(
      'TRACK',
      `[${this.providerName}]`,
      mappedName,
      mappedParams
    );

    window.fbq('track', mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }
  identify(): void {}
}
