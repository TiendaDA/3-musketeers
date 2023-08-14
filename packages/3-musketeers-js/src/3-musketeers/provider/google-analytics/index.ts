import {Provider, ProviderInitOptions} from '../provider';
import {loadScript} from '../../../utils';

export class GoogleAnalytics extends Provider {
  static providerName: string = 'google-analytics';
  mapTrackEventName: ProviderInitOptions['mapTrackEventName'];

  init(tagId: string, options: ProviderInitOptions = {}): void {
    Provider.logAction('INIT', `${GoogleAnalytics.providerName} (${tagId})`);
    if (options.mapTrackEventName) {
      this.mapTrackEventName = options.mapTrackEventName;
    }
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
    Provider.logAction('PAGE', name, params);
    window.gtag('event', 'page_view', {page_title: name, ...params});
  }

  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const name = this.mapTrackEventName
      ? this.mapTrackEventName(eventName)
      : eventName;
    Provider.logAction('TRACK', name, params);
    window.gtag('event', name, params);
    if (typeof callback === 'function') callback();
  }
}
