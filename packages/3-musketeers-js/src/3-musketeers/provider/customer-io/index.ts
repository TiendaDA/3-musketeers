import {loadScriptRaw} from '../../../utils';
import {Provider, ProviderInitOptions} from '../provider';

const customerIoScript =
  '!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdp.customer.io/v1/analytics-js/snippet/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._writeKey=key;analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.15.3"; }}()';

export class CustomerIo extends Provider {
  static providerName: string = 'customer-io';
  providerName: string = 'customer-io';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  init(customerIoKey: string, options: ProviderInitOptions = {}): void {
    Provider.logAction('INIT', `[${this.providerName}]`, customerIoKey);
    this.saveOptions(options);
    loadScriptRaw(customerIoScript, {
      async: true,
    });

    window.analytics.load(customerIoKey);
  }
  ready(): boolean {
    return !!window.analytics;
  }
  pageView(name: string, params?: Record<string, string> | undefined): void {
    Provider.logAction('PAGE', `[${this.providerName}]`, name, params);
    window.analytics.page({name, ...params});
  }
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
    window.analytics.track(mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }
  identify(userId: string, params?: Record<string, unknown> | undefined): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);

    window.analytics.identify(userId, params);
  }
}
