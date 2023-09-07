/* eslint-disable @typescript-eslint/no-explicit-any */
import {log, LogMessage} from '../../logging';

type MapTrackEventResult = {
  eventName: string;
  params: Record<string, unknown>;
};

export type ProviderInitOptions = {
  mapTrackEvent?: (
    eventName: string,
    params: Record<string, unknown>
  ) => MapTrackEventResult;
};

export type ProviderActions = 'INIT' | 'PAGE' | 'TRACK' | 'IDENTIFY';

export abstract class Provider {
  static providerName: string = 'provider';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  static logAction(action: ProviderActions, ...message: LogMessage[]) {
    log.info(`[${action}]`, ...message);
  }

  saveOptions(options: ProviderInitOptions = {}) {
    if (options.mapTrackEvent) {
      this.mapTrackEvent = options.mapTrackEvent;
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

  getTrackEvent(
    eventName: string,
    params: Record<string, unknown>
  ): MapTrackEventResult {
    if (this.mapTrackEvent) {
      return this.mapTrackEvent(eventName, params);
    }

    return {
      eventName,
      params,
    };
  }
}

export type ProviderClass = typeof Provider;

export type ProviderImpl = {new (): Provider} & typeof Provider;
