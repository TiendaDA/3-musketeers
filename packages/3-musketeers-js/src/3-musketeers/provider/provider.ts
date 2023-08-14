/* eslint-disable @typescript-eslint/no-explicit-any */
import {log, LogMessage} from '../../logging';

export type ProviderInitOptions = {
  mapTrackEventName?: (name: string) => string;
};

export type ProviderActions = 'INIT' | 'PAGE' | 'TRACK' | 'IDENTIFY';

export abstract class Provider {
  static providerName: string = 'provider';
  mapTrackEventName: ProviderInitOptions['mapTrackEventName'];

  static logAction(action: ProviderActions, ...message: LogMessage[]) {
    log.info(`[${action}]`, ...message);
  }

  saveOptions(options: ProviderInitOptions = {}) {
    if (options.mapTrackEventName) {
      this.mapTrackEventName = options.mapTrackEventName;
    }
  }

  abstract init(...args: unknown[]): void;

  abstract ready(): boolean;

  abstract pageView(name: string, params?: Record<string, string>): void;

  abstract track(
    eventName: string,
    params?: Record<string, any>,
    callback?: () => void
  ): void;

  abstract identify(userId: string, params?: Record<string, unknown>): void;

  getTrackEventName(eventName: string): string {
    if (this.mapTrackEventName) {
      return this.mapTrackEventName(eventName);
    }

    return eventName;
  }
}

export type ProviderClass = typeof Provider;

export type ProviderImpl = {new (): Provider} & typeof Provider;
