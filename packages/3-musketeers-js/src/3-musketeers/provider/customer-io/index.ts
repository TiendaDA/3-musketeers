import {
  AnalyticsBrowser,
  type InitOptions,
} from '@customerio/cdp-analytics-browser';

import {Provider, ProviderInitOptions} from '../provider';

export type CustomerIoInAppEvent = {
  type: string;
};

export type CustomerIoInitOptions = {
  /** Use `https://cdp-eu.customer.io` for EU data center */
  cdnURL?: string;
  /** Site ID for in-app messaging */
  siteId?: string;
  /** Handler for in-app message events */
  inAppEvents?: (event: CustomerIoInAppEvent) => void;
};

type CustomerIoLoadOptions = {
  integrations?: Record<
    string,
    {
      siteId: string;
      events?: (event: CustomerIoInAppEvent) => void;
    }
  >;
};

function getAnalyticsInstance(
  writeKey: string,
  customerIoOptions: CustomerIoInitOptions = {}
): NonNullable<Window['cioanalytics']> {
  if (!window.cioanalytics) {
    const settings = {
      writeKey,
      ...(customerIoOptions.cdnURL && {cdnURL: customerIoOptions.cdnURL}),
    };

    const loadOptions: CustomerIoLoadOptions = {};

    if (customerIoOptions.siteId) {
      loadOptions.integrations = {
        'Customer.io In-App Plugin': {
          siteId: customerIoOptions.siteId,
          ...(customerIoOptions.inAppEvents && {
            events: customerIoOptions.inAppEvents,
          }),
        },
      };
    }

    window.cioanalytics = AnalyticsBrowser.load(
      settings,
      loadOptions as unknown as InitOptions
    );
  }

  return window.cioanalytics;
}

export class CustomerIo extends Provider {
  static providerName: string = 'customer-io';
  providerName: string = 'customer-io';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  init(
    writeKey: string,
    options: ProviderInitOptions = {},
    customerIoOptions: CustomerIoInitOptions = {}
  ): void {
    Provider.logAction(
      'INIT',
      `[${this.providerName}]`,
      writeKey,
      customerIoOptions
    );
    this.saveOptions(options);
    getAnalyticsInstance(writeKey, customerIoOptions);
  }

  ready(): boolean {
    return !!window.cioanalytics;
  }

  pageView(name: string, params?: Record<string, string>): void {
    Provider.logAction('PAGE', `[${this.providerName}]`, name, params);
    window.cioanalytics?.page({name, ...params});
  }

  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const {eventName: mappedName, params: mappedParams} = this.getTrackEvent(
      eventName,
      params ?? {}
    );
    Provider.logAction(
      'TRACK',
      `[${this.providerName}]`,
      mappedName,
      mappedParams
    );
    window.cioanalytics?.track(mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }

  identify(userId: string, params?: Record<string, unknown>): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);
    window.cioanalytics?.identify(userId, params);
  }
}
