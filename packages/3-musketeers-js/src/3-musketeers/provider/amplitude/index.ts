import {Provider, ProviderInitOptions} from '../provider';
import * as amplitude from '@amplitude/analytics-browser';
import {BrowserOptions, ValidPropertyType} from '@amplitude/analytics-types';
import {pageViewTrackingPlugin} from '@amplitude/plugin-page-view-tracking-browser';

export class Amplitude extends Provider {
  static providerName: string = 'amplitude';
  mapTrackEventName: ProviderInitOptions['mapTrackEventName'];

  init(
    apiKey: string,
    options: ProviderInitOptions = {},
    userId?: string,
    amplitudeInitOptions: BrowserOptions = {}
  ): void {
    Provider.logAction('INIT', `[${Amplitude.providerName}]`, apiKey);
    this.saveOptions(options);
    amplitude.add(
      pageViewTrackingPlugin({
        trackOn: () => true,
        trackHistoryChanges: 'all',
      })
    );
    if (userId) {
      amplitude.init(apiKey, userId, amplitudeInitOptions);
    } else {
      amplitude.init(apiKey, amplitudeInitOptions);
    }
  }

  ready(): boolean {
    return !!amplitude;
  }

  pageView(name: string): void {
    Provider.logAction(
      'PAGE',
      `[${Amplitude.providerName}]`,
      name,
      '(done by plugin)'
    );
  }

  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const name = this.getTrackEventName(eventName);
    Provider.logAction('TRACK', `[${Amplitude.providerName}]`, name, params);
    amplitude.track(name, params);
    if (typeof callback === 'function') callback();
  }

  identify(
    userId: string,
    params: Record<string, ValidPropertyType> = {}
  ): void {
    Provider.logAction(
      'IDENTIFY',
      `[${Amplitude.providerName}]`,
      userId,
      params
    );
    amplitude.setUserId(userId);
    const identifyEvent = new amplitude.Identify();
    Object.keys(params).forEach((k) => identifyEvent.set(k, params[k]));
    amplitude.identify(identifyEvent);
  }
}
