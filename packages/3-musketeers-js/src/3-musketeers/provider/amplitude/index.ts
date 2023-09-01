import {Provider, ProviderInitOptions} from '../provider';

import {loadScriptRaw} from '../../../utils';

export class Amplitude extends Provider {
  static providerName: string = 'amplitude';
  mapTrackEventName: ProviderInitOptions['mapTrackEventName'];

  init(
    apiKey: string,
    options: ProviderInitOptions = {},
    userId?: string,
    amplitudeInitOptions: unknown = {}
  ): void {
    Provider.logAction('INIT', `[${Amplitude.providerName}]`, apiKey);
    this.saveOptions(options);

    if (userId) {
      window.amplitude.getInstance().init(apiKey, null, amplitudeInitOptions);
    } else {
      window.amplitude.getInstance().init(apiKey, userId, amplitudeInitOptions);
    }

    loadScriptRaw(amplitudeScript);
  }

  ready(): boolean {
    return !!window.amplitude;
  }

  pageView(): void {}

  track(
    eventName: string,
    params?: Record<string, unknown>,
    callback?: () => void
  ): void {
    const name = this.getTrackEventName(eventName);
    Provider.logAction('TRACK', `[${Amplitude.providerName}]`, name, params);
    window.amplitude.getInstance().logEvent(name, params);
    if (typeof callback === 'function') callback();
  }

  identify(userId: string, params: Record<string, unknown> = {}): void {
    Provider.logAction(
      'IDENTIFY',
      `[${Amplitude.providerName}]`,
      userId,
      params
    );
    window.amplitude.setUserId(userId);
    const identifyEvent = new window.amplitude.Identify();
    Object.keys(params).forEach((k) => identifyEvent.set(k, params[k]));
    window.amplitude.getInstance().identify(identifyEvent);
  }
}

const amplitudeScript = `
(function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
r.type="text/javascript";
r.integrity="sha384-5fhzC8Xw3m+x5cBag4AMKRdf900vw3AoaLty2vYfcKIX1iEsYRHZF4RLXIsu2o+F"
r.crossOrigin="anonymous";r.async=true;
r.src="https://cdn.amplitude.com/libs/amplitude-8.21.4-min.gz.js";
r.onload=function(){if(!e.amplitude.runQueuedFunctions){console.log(
"[Amplitude] Error: could not load SDK")}};var s=t.getElementsByTagName("script"
)[0];s.parentNode.insertBefore(r,s);function i(e,t){e.prototype[t]=function(){
this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
var o=function(){this._q=[];return this};var a=["add","append","clearAll",
"prepend","set","setOnce","unset","preInsert","postInsert","remove"];for(
var c=0;c<a.length;c++){i(o,a[c])}n.Identify=o;var l=function(){this._q=[];
return this};var u=["setProductId","setQuantity","setPrice","setRevenueType",
"setEventProperties"];for(var p=0;p<u.length;p++){i(l,u[p])}n.Revenue=l;var d=[
"init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut",
"setVersionName","setDomain","setDeviceId","enableTracking",
"setGlobalUserProperties","identify","clearUserProperties","setGroup",
"logRevenueV2","regenerateDeviceId","groupIdentify","onInit","onNewSessionStart"
,"logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId",
"getDeviceId","getUserId","setMinTimeBetweenSessionsMillis",
"setEventUploadThreshold","setUseDynamicConfig","setServerZone","setServerUrl",
"sendEvents","setLibrary","setTransport"];function v(t){function e(e){t[e
]=function(){t._q.push([e].concat(Array.prototype.slice.call(arguments,0)))}}
for(var n=0;n<d.length;n++){e(d[n])}}v(n);n.getInstance=function(e){e=(
!e||e.length===0?"$default_instance":e).toLowerCase();if(
!Object.prototype.hasOwnProperty.call(n._iq,e)){n._iq[e]={_q:[]};v(n._iq[e])}
return n._iq[e]};e.amplitude=n})(window,document);
`;
