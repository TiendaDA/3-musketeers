/* eslint-disable @typescript-eslint/no-explicit-any */
import {log, LogMessage} from '../../logging';

export type ProviderInitOptions = {
  mapTrackEventName?: (name: string) => string;
};

export type ProviderActions = 'INIT' | 'PAGE' | 'TRACK';

export abstract class Provider {
  static providerName: string = 'provider';

  static logAction(action: ProviderActions, ...message: LogMessage[]) {
    log.info(`[${action}]`, ...message);
  }

  abstract init(...args: unknown[]): void;

  abstract ready(): boolean;

  abstract pageView(...args: unknown[]): void;

  abstract track(
    eventName: string,
    params?: Record<string, any>,
    callback?: () => void
  ): void;
}

export type ProviderClass = typeof Provider;

export type ProviderImpl = {new (): Provider} & typeof Provider;
