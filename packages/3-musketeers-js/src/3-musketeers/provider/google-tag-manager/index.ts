import {Provider, ProviderInitOptions} from '../provider';
import {loadScript} from '../../../utils';

export class GoogleTagManager extends Provider {
  static providerName: string = 'google-tag-manager';
  providerName: string = 'google-tag-manager';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  init(tagId: string, options: ProviderInitOptions = {}): void {
    Provider.logAction('INIT', `[${this.providerName}]`, tagId);
    this.saveOptions(options);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', tagId);
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${tagId}`);
  }

  ready(): boolean {
    return !!window.gtag;
  }

  pageView(name: string, params?: Record<string, string>): void {
    Provider.logAction('PAGE', `[${this.providerName}]`, name, params);
    window.gtag('event', 'page_view', {page_title: name, ...params});
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
    window.gtag('event', mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }

  identify(userId: string, params?: Record<string, unknown>): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);
    window.gtag('set', 'user_id', userId);
    window.gtag('set', 'user_properties', params);
  }
}
