export abstract class Provider {
  static providerName: string = 'provider';

  abstract init(...args: unknown[]): void;

  abstract ready(): boolean;

  abstract track(...args: unknown[]): void;
}
