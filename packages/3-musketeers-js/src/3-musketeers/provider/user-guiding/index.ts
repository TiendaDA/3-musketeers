import {loadScriptRaw} from '../../../utils';
import {Provider, ProviderInitOptions} from '../provider';

export class UserGuiding extends Provider {
  static providerName: string = 'user-guiding';
  providerName: string = 'user-guiding';
  mapTrackEvent: ProviderInitOptions['mapTrackEvent'];

  init(containerId: string, options: ProviderInitOptions = {}): void {
    Provider.logAction('INIT', `[${this.providerName}]`, containerId);
    this.saveOptions(options);

    const src = `(function(g,u,i,d,e,s){g[e]=g[e]||[];var f=u.getElementsByTagName(i)[0];var k=u.createElement(i);k.async=true;k.src='https://static.userguiding.com/media/user-guiding-'+s+'-embedded.js';f.parentNode.insertBefore(k,f);if(g[d])return;var ug=g[d]={q:[]};ug.c=function(n){return function(){ug.q.push([n,arguments])};};var m=['previewGuide','finishPreview','track','identify','hideChecklist','launchChecklist'];for(var j=0;j<m.length;j+=1){ug[m[j]]=ug.c(m[j]);}})(window,document,'script','userGuiding','userGuidingLayer','${containerId}');`;

    loadScriptRaw(src);
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

    window.userGuiding.track(mappedName, mappedParams);
    if (typeof callback === 'function') callback();
  }
  identify(userId: string, params?: Record<string, unknown>): void {
    Provider.logAction('IDENTIFY', `[${this.providerName}]`, userId, params);
    if (window.userGuiding) window.userGuiding.identify(userId, params);
  }
}
