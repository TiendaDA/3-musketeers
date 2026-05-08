import * as amplitude from '@amplitude/analytics-browser';

import {Provider, ProviderInitOptions} from '../provider';

export class Amplitude extends Provider {
  static providerName: string = 'amplitude';
  providerName: string = 'amplitude';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];
  private initialized = false;

  init(
    apiKey: string,
    options: ProviderInitOptions = {},
    userId?: string,
    amplitudeInitOptions: Record<string, unknown> = {}
  ): void {
    Provider.logAction('INIT', `[${this.providerName}]`, apiKey, {
      userId,
      amplitudeInitOptions,
    });
    this.saveOptions(options);

    const initOptions: Record<string, unknown> = {
      ...amplitudeInitOptions,
    };

    if (userId) {
      amplitude.init(apiKey, userId, initOptions);
    } else {
      amplitude.init(apiKey, initOptions);
    }

    this.initialized = true;
  }

  ready(): boolean {
    return this.initialized;
  }

  pageView(): void {}

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
    amplitude.track(mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }

  identify(userId: string, params: Record<string, string> = {}): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);
    amplitude.setDeviceId(userId);
    const identifyEvent = new amplitude.Identify();
    Object.keys(params).forEach((k) => identifyEvent.set(k, params[k]));
  }
}
