import {initAll, track, identify, Identify} from '@amplitude/unified';
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
    Provider.logAction('INIT', `[${this.providerName}]`, apiKey);
    this.saveOptions(options);

    const initOptions: Record<string, unknown> = {
      ...amplitudeInitOptions,
    };

    if (userId) {
      initOptions.userId = userId;
    }

    initAll(apiKey, initOptions);
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
    track(mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }

  identify(userId: string, params: Record<string, unknown> = {}): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);
    const identifyEvent = new Identify();
    Object.keys(params).forEach((k) => identifyEvent.set(k, params[k]));
    identify(identifyEvent, {user_id: userId});
  }
}
