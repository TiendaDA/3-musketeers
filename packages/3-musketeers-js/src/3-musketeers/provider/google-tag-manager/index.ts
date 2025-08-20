import {Provider, ProviderInitOptions} from '../provider';

export class GoogleTagManager extends Provider {
  static providerName: string = 'google-tag-manager';
  providerName: string = 'google-tag-manager';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  init(gtmId: string, options: ProviderInitOptions = {}): void {
    Provider.logAction('INIT', `[${this.providerName}]`, gtmId);
    this.saveOptions(options);

    window.dataLayer = window.dataLayer || [];

    (function (w: unknown, d: Document, s: string, l: string, i: string) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s) as HTMLScriptElement;
      const dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      if (f.parentNode) {
        f.parentNode.insertBefore(j, f);
      }
    })(window, document, 'script', 'dataLayer', gtmId);
  }

  ready(): boolean {
    return Array.isArray(window.dataLayer);
  }

  pageView(name: string, params?: Record<string, string>): void {
    Provider.logAction('PAGE', `[${this.providerName}]`, name, params);
    window.dataLayer.push({
      event: 'page_view',
      page_title: name,
      ...params,
    });
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
    window.dataLayer.push({
      event: mappedName,
      ...mappedParams,
    });
    if (typeof callback === 'function') callback();
  }

  identify(userId: string, params?: Record<string, unknown>): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);
    window.dataLayer.push({
      event: 'user_identify',
      user_id: userId,
      user_properties: params,
    });
  }
}
