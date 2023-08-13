/* eslint-disable @typescript-eslint/no-explicit-any */
import {Provider} from '../provider';
import {log} from '../../logging';
import {loadScript} from '../../utils';

export class GoogleAnalytics extends Provider {
  static providerName: string = 'google-analytics';

  init(tagId: string): void {
    log.info('[INIT]', `${GoogleAnalytics.providerName} (${tagId})`);
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

  track(name: string): void {
    window.gtag('');
    log.info('[TRACK]', name);
  }
}
