/* eslint-disable @typescript-eslint/no-explicit-any */
import {log} from '../../../logging';
import {Provider, ProviderInitOptions} from '../provider';

type AdvancedMatching = {
  email?: string;
  phone_number?: string;
  external_id?: string;
};

export class TiktokPixel extends Provider {
  static providerName: string = 'tiktok-pixel';
  providerName: string = 'tiktok-pixel';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  private loadTiktokPixelScript(
    w: Window,
    t: string,
    pixelId: string,
    advancedMatching: AdvancedMatching = {}
  ): void {
    (w as any).TiktokAnalyticsObject = t;
    const ttq = ((w as any)[t] = (w as any)[t] || []);
    ttq.methods = [
      'page',
      'track',
      'identify',
      'instances',
      'debug',
      'on',
      'off',
      'once',
      'ready',
      'alias',
      'group',
      'enableCookie',
      'disableCookie',
    ];
    ttq.setAndDefer = function (t: any, e: any) {
      t[e] = function () {
        // eslint-disable-next-line prefer-rest-params
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };

    for (let i = 0; i < ttq.methods.length; i++)
      ttq.setAndDefer(ttq, ttq.methods[i]);
    ttq.instance = function (t: any) {
      // eslint-disable-next-line no-var
      for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
        ttq.setAndDefer(e, ttq.methods[n]);
      return e;
    };
    ttq.load = function (e: string, n: any) {
      const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      const o = document.createElement('script');
      o.type = 'text/javascript';
      o.async = !0;
      o.src = i + '?sdkid=' + e + '&lib=' + t;
      const a = document.getElementsByTagName('script')[0];
      a?.parentNode?.insertBefore(o, a);
    };
    if (!pixelId) {
      log.error('Please insert pixel id for initializing');
    } else {
      ttq.load(pixelId);
      ttq.page();
      if (advancedMatching) {
        ttq.identify(advancedMatching);
      }
    }
  }

  init(
    tiktokPixelCode: string,
    options: ProviderInitOptions = {},
    advancedMatching?: AdvancedMatching
  ): void {
    Provider.logAction('INIT', `[${this.providerName}]`, tiktokPixelCode);
    this.saveOptions(options);
    if (this.ready()) return;

    this.loadTiktokPixelScript(
      window,
      'ttq',
      tiktokPixelCode,
      advancedMatching
    );
  }
  ready(): boolean {
    return !!window.ttq;
  }
  pageView(name: string, params?: Record<string, string> | undefined): void {
    Provider.logAction('PAGE', `[${this.providerName}]`, name, params);
    window.ttq.page();
  }
  track(
    eventName: string,
    params?: Record<string, any>,
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
    window.ttq.track(mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }
  identify(userId: string, params?: Record<string, any> | undefined): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);

    window.ttq.identify({
      external_id: userId,
      ...params,
    });
  }
}
