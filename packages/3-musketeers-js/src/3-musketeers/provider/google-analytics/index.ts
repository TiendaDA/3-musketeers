import {Provider, ProviderInitOptions} from '../provider';
import {loadScript} from '../../../utils';

export class GoogleAnalytics extends Provider {
  static providerName: string = 'google-analytics';
  mapTrackEventName: ProviderInitOptions['mapTrackEventName'];

  init(tagId: string, options: ProviderInitOptions = {}): void {
    Provider.logAction('INIT', `[${GoogleAnalytics.providerName}]`, tagId);
    this.saveOptions(options);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'G-JJYRJMRN07');
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${tagId}`);
  }

  ready(): boolean {
    return !!window.gtag;
  }

  pageView(name: string, params?: Record<string, string>): void {
    Provider.logAction(
      'PAGE',
      `[${GoogleAnalytics.providerName}]`,
      name,
      params
    );
    window.gtag('event', 'page_view', {page_title: name, ...params});
  }

  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const name = this.getTrackEventName(eventName);
    Provider.logAction(
      'TRACK',
      `[${GoogleAnalytics.providerName}]`,
      name,
      params
    );
    window.gtag('event', name, params);
    if (typeof callback === 'function') callback();
  }

  identify(userId: string, params?: Record<string, unknown>): void {
    Provider.logAction(
      'IDENTIFY',
      `[${GoogleAnalytics.providerName}]`,
      userId,
      params
    );
    window.gtag('set', 'user_id', userId);
    window.gtag('set', 'user_properties', params);
  }
}
