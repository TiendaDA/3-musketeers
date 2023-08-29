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
  mapTrackEventName: ProviderInitOptions['mapTrackEventName'];

  init(
    pixelId: string,
    version: string,
    options: ProviderInitOptions = {},
    advancedMatching?: AdvancedMatching
  ): void {
    Provider.logAction('INIT', `[${FacebookPixel.providerName}]`, pixelId);
    this.saveOptions(options);

    if (this.ready()) return;

    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = window.fbq;

    window.fbq.push = window.fbq;
    window.fbq.loaded = !0;
    window.fbq.version = version;
    window.fbq.queue = [];

    loadScript(`https://connect.facebook.net/en_US/fbevents.js`);

    window.fbq('init', pixelId, advancedMatching);
  }
  ready(): boolean {
    return !!window.fbq;
  }
  pageView(name: string, params?: Record<string, string> | undefined): void {
    Provider.logAction('PAGE', `[${FacebookPixel.providerName}]`, name, params);

    window.fbq('track', 'PageView', params);
  }
  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const name = this.getTrackEventName(eventName);
    Provider.logAction(
      'TRACK',
      `[${FacebookPixel.providerName}]`,
      name,
      params
    );

    window.fbq('track', name, params);
    if (typeof callback === 'function') callback();
  }
  identify(userId: string, params?: Record<string, unknown>): void {
    Provider.logAction(
      'IDENTIFY',
      `[${FacebookPixel.providerName}]`,
      userId,
      params
    );

    window.fbq('setUserId', userId);
    window.fbq('track', 'CompleteRegistration', params);
  }
}
