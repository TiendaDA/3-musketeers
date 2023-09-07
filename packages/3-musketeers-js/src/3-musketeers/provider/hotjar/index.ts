import HotjarSdk from '@hotjar/browser';

import {Provider, ProviderInitOptions} from '../provider';

export class Hotjar extends Provider {
  static providerName: string = 'hotjar';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  init(
    siteId: number,
    hotjarVersion: number,
    options: ProviderInitOptions = {}
  ): void {
    Provider.logAction('INIT', `[${Hotjar.providerName}]`, siteId);
    this.saveOptions(options);

    HotjarSdk.init(siteId, hotjarVersion);
  }
  ready(): boolean {
    return !!HotjarSdk;
  }
  pageView(name: string, params?: Record<string, string>): void {
    Provider.logAction('PAGE', `[${Hotjar.providerName}]`, name, params);

    HotjarSdk.stateChange(name);
  }
  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const {name: mappedName, params: mappedParams} = this.getTrackEvent(
      eventName,
      params
    );
    Provider.logAction(
      'TRACK',
      `[${Hotjar.providerName}]`,
      mappedName,
      mappedParams
    );

    HotjarSdk.event(mappedName);
    if (typeof callback === 'function') callback();
  }
  identify(
    userId: string,
    params?: Record<string, string | number | boolean | Date>
  ): void {
    Provider.logAction('IDENTIFY', `[${Hotjar.providerName}]`, userId, params);

    HotjarSdk.identify(userId, params);
    throw new Error('Method not implemented.');
  }
}
