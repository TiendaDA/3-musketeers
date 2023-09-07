import {loadScript} from '../../../utils';
import {Provider, ProviderInitOptions} from '../provider';

export class UserGuiding extends Provider {
  static providerName: string = 'user-guiding';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  init(containerId: string, options: ProviderInitOptions = {}): void {
    Provider.logAction('INIT', `[${UserGuiding.providerName}]`, containerId);
    this.saveOptions(options);

    const scriptUrl = `https://static.userguiding.com/media/user-guiding-${containerId}-embedded.js`;

    loadScript(scriptUrl);

    window.userGuidingLayer = window.userGuidingLayer || [];

    const userGuiding: Partial<Window['userGuiding']> = window.userGuiding || {
      q: [],
    };

    userGuiding.c = function (n) {
      return function () {
        // eslint-disable-next-line prefer-rest-params
        userGuiding.q.push([n, arguments]);
      };
    };

    const methods = [
      'previewGuide',
      'finishPreview',
      'track',
      'identify',
      'hideChecklist',
      'launchChecklist',
    ];

    for (const method of methods) {
      userGuiding[method] = userGuiding.c(method);
    }
  }
  ready(): boolean {
    return !!window.userGuiding;
  }
  pageView(): void {}
  track(
    eventName: string,
    params: Record<string, unknown>,
    callback?: () => void
  ): void {
    const {name: mappedName, params: mappedParams} = this.getTrackEvent(
      eventName,
      params
    );
    Provider.logAction(
      'TRACK',
      `[${UserGuiding.providerName}]`,
      mappedName,
      mappedParams
    );

    window.userGuiding.track(mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }
  identify(userId: string, params?: Record<string, unknown>): void {
    Provider.logAction(
      'IDENTIFY',
      `[${UserGuiding.providerName}]`,
      userId,
      params
    );
    window.userGuiding.identify(userId, params);
  }
}
