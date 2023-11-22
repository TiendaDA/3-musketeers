(()=>{var R=!1;function x(r){R=r}var d={info:(...r)=>I(1,...r),warn:(...r)=>I(2,...r),error:(...r)=>I(3,...r)};function I(r,...n){if(R){let e=["\u{1F93A} %c[3-musketeers]"];switch(r){case 1:e.push("color: #06989A; font-weight: 600"),console.log(...e,...n);break;case 2:e.push("color: #C4A000; font-weight: 600"),console.warn(...e,...n);break;case 3:e.push("color: #CC0000; font-weight: 600"),console.error(...e,...n);break;default:break}}}var C=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)]/;function f(r){if(r==null)return String(r);let n=C.exec(Object.prototype.toString.call(Object(r)));return n?n[1].toLowerCase():"object"}function g(r){return f(r)==="array"}function O(r){return f(r)==="string"}function l(r,n){return Object.prototype.hasOwnProperty.call(Object(r),n)}function m(r){if(!r||f(r)!="object"||r.nodeType||r==r.window)return!1;try{if(r.constructor&&!l(r,"constructor")&&!l(r.constructor.prototype,"isPrototypeOf"))return!1}catch{return!1}let n;for(n in r);return n===void 0||l(r,n)}function j(r){return f(r)==="arguments"}function u(r,n){let e=!r._clear;for(let t in r)if(l(r,t)){let i=r[t];g(i)&&e?(g(n[t])||(n[t]=[]),u(i,n[t])):m(i)&&e?(m(n[t])||(n[t]={}),u(i,n[t])):n[t]=i}delete n._clear}function T(r,n){let e={},t=e,i=r.split(".");for(let o=0;o<i.length-1;o++)t=t[i[o]]={};return t[i[i.length-1]]=n,e}function v(r,n={}){let{async:e,defer:t,attributes:i}=n,o=document.createElement("script");o.async=!!e,o.defer=!!t,i&&Object.keys(i).forEach(s=>{o.setAttribute(s,i[s])}),o.setAttribute("src",r),document.body.appendChild(o)}function c(r,n={}){let{async:e,attributes:t,defer:i}=n,o=document.createElement("script");e&&(o.async=!0),i&&(o.defer=!0),t&&Object.keys(t).forEach(s=>{o.setAttribute(s,t[s])}),o.appendChild(document.createTextNode(r)),document.body.appendChild(o)}function M(r){return{set:(n,e)=>{u(T(n,e),r.model_)},get:n=>r.get(n)}}function D(r,n){O(r[0])||d.warn(`Error processing command, no command was run. The first argument must be of type string, but was of type ${typeof r[0]}.
The command run was ${r}`);let e=r[0].split("."),t=e.pop(),i=r.slice(1),o=n;for(let s=0;s<e.length;s++){if(o[e[s]]===void 0){d.warn(`Error processing command, no command was run as the object at ${e} was undefined.
The command run was ${r}`);return}o=o[e[s]]}try{o[t](...i)}catch{d.error(`An exception was thrown by the method ${t}, so no command was run.
The method was called on the data layer object at the location ${e}.`)}}var w=class{constructor(n,e={}){this.dataLayer_=n,this.listener_=e.listener||(()=>{}),this.listenToPast_=!!e.listenToPast,this.processed_=!1,this.executingListener_=!1,this.model_={},this.unprocessed_=[],this.abstractModelInterface_=M(this),e.debugMode&&x(!0);let t=this.dataLayer_.push;this.dataLayer_.push=(...i)=>{let o=[].slice.call(i,0),s=t.apply(this.dataLayer_,o);return this.processStates_(o),s},e.processNow&&this.process()}process(){this.processed_&&d.error("Process has already been run. This method should only run a single time to prepare the helper."),this.processed_=!0;let n=this.dataLayer_.length;for(let e=0;e<n;e++)this.processStates_([this.dataLayer_[e]],!this.listenToPast_)}get(n){let e=this.model_,t=n.split(".");for(let i=0;i<t.length;i++){if(e[t[i]]===void 0)return;e=e[t[i]]}return e}processStates_(n,e=!1){if(this.processed_&&(this.unprocessed_.push(...n),!this.executingListener_))for(;this.unprocessed_.length>0;){let t=this.unprocessed_.shift();if(g(t))D(t,this.model_);else if(!j(t))if(typeof t=="function")try{t.call(this.abstractModelInterface_)}catch(i){d.error(`An exception was thrown when running the method ${t}, execution was skipped.`,i)}else if(m(t))for(let i in t)u(T(i,t[i]),this.model_);else continue;e||(this.executingListener_=!0,this.listener_(this.model_,t),this.executingListener_=!1)}}};function _(r,n){r.forEach(e=>{let[t,i]=n;e.pageView(t,i)})}function L(r,n){r.forEach(e=>{let[t,i,o]=n;e.track(t,i,o)})}function q(r,n){r.forEach(e=>{let[t,i]=n;e.identify(t,i)})}var h=class{constructor(n=[]){this.listener=(n,e)=>{let t=[...e].splice(0,e.length);switch(t.shift()){case"init":let o=t.shift(),s=this.getProviderInstance(o);if(!s){d.error(`Provider '${o}' not found`);return}this.providers.push(s),s.init(...t);break;case"track":L(this.providers,t);break;case"page":_(this.providers,t);break;case"identify":q(this.providers,t);break}};this.availableProviders=n,this.providers=[];let e=window.dataQueue||[];this.helper=new w(e,{listener:this.listener,listenToPast:!0,processNow:!0,debugMode:!0})}getProviderInstance(n){let e=this.availableProviders.find(t=>t.providerName===n);if(e)return new e}};var a=class{static{this.providerName="provider"}static logAction(n,...e){d.info(`[${n}]`,...e)}saveOptions(n={}){n.mapTrackEvent&&(this.mapTrackEvent=n.mapTrackEvent)}getTrackEvent(n,e){return this.mapTrackEvent?this.mapTrackEvent(n,e):{eventName:n,params:e}}};var y=class r extends a{static{this.providerName="google-tag-manager"}init(e,t={}){a.logAction("INIT",`[${r.providerName}]`,e),this.saveOptions(t),window.dataLayer=window.dataLayer||[],window.gtag=function(){window.dataLayer.push(arguments)},window.gtag("js",new Date),window.gtag("config",e),v(`https://www.googletagmanager.com/gtag/js?id=${e}`)}ready(){return!!window.gtag}pageView(e,t){a.logAction("PAGE",`[${r.providerName}]`,e,t),window.gtag("event","page_view",{page_title:e,...t})}track(e,t,i){let{eventName:o,params:s}=this.getTrackEvent(e,t);a.logAction("TRACK",`[${r.providerName}]`,o,s),window.gtag("event",o,s),typeof i=="function"&&i()}identify(e,t){a.logAction("IDENTIFY",`[${r.providerName}]`,e,t),window.gtag("set","user_id",e),window.gtag("set","user_properties",t)}};var k=class r extends a{static{this.providerName="amplitude"}init(e,t={},i,o={}){a.logAction("INIT",`[${r.providerName}]`,e),this.saveOptions(t),c(G),i?window.amplitude.init(e,null,o):window.amplitude.init(e,i,o)}ready(){return!!window.amplitude}pageView(){}track(e,t,i){let{eventName:o,params:s}=this.getTrackEvent(e,t);a.logAction("TRACK",`[${r.providerName}]`,o,s),window.amplitude.track(o,s),typeof i=="function"&&i()}identify(e,t={}){a.logAction("IDENTIFY",`[${r.providerName}]`,e,t),window.amplitude.setUserId(e);let i=new window.amplitude.Identify;Object.keys(t).forEach(o=>i.set(o,t[o])),window.amplitude.identify(i)}},G='!function(){"use strict";!function(e,t){var n=e.amplitude||{_q:[],_iq:{}};if(n.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{var r=function(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}},s=function(e,t,n){return function(r){e._q.push({name:t,args:Array.prototype.slice.call(n,0),resolve:r})}},o=function(e,t,n){e[t]=function(){if(n)return{promise:new Promise(s(e,t,Array.prototype.slice.call(arguments)))}}},i=function(e){for(var t=0;t<m.length;t++)o(e,m[t],!1);for(var n=0;n<g.length;n++)o(e,g[n],!0)};n.invoked=!0;var u=t.createElement("script");u.type="text/javascript",u.integrity="sha384-x0ik2D45ZDEEEpYpEuDpmj05fY91P7EOZkgdKmq4dKL/ZAVcufJ+nULFtGn0HIZE",u.crossOrigin="anonymous",u.async=!0,u.src="https://cdn.amplitude.com/libs/analytics-browser-2.0.0-min.js.gz",u.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var a=t.getElementsByTagName("script")[0];a.parentNode.insertBefore(u,a);for(var c=function(){return this._q=[],this},p=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],l=0;l<p.length;l++)r(c,p[l]);n.Identify=c;for(var d=function(){return this._q=[],this},f=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],v=0;v<f.length;v++)r(d,f[v]);n.Revenue=d;var m=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset","extendSession"],g=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"];i(n),n.createInstance=function(e){return n._iq[e]={_q:[]},i(n._iq[e]),n._iq[e]},e.amplitude=n}}(window,document)}();';var F='!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdp.customer.io/v1/analytics-js/snippet/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._writeKey=key;analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.15.3"; }}()',b=class r extends a{static{this.providerName="customer-io"}init(e,t={}){a.logAction("INIT",`[${r.providerName}]`,e),this.saveOptions(t),c(F,{async:!0}),window.analytics.load(e)}ready(){return!!window.analytics}pageView(e,t){a.logAction("PAGE",`[${r.providerName}]`,e,t),window.analytics.page({name:e,...t})}track(e,t,i){let{eventName:o,params:s}=this.getTrackEvent(e,t);a.logAction("TRACK",`[${r.providerName}]`,o,s),window.analytics.track(o,s),typeof i=="function"&&i()}identify(e,t){a.logAction("IDENTIFY",`[${r.providerName}]`,e,t),window.analytics.identify(e,t)}};var P=class r extends a{static{this.providerName="facebook-pixel"}init(e,t={},i){a.logAction("INIT",`[${r.providerName}]`,e),this.saveOptions(t),!this.ready()&&(window.fbq=function(){window.fbq.callMethod?window.fbq.callMethod.apply(window.fbq,arguments):window.fbq.queue.push(arguments)},window._fbq||(window._fbq=window.fbq),window.fbq.push=window.fbq,window.fbq.loaded=!0,window.fbq.version="2.0",window.fbq.queue=[],v("https://connect.facebook.net/en_US/fbevents.js"),window.fbq("init",e,i),window.fbq("track","PageView"))}ready(){return!!window.fbq}pageView(e,t){a.logAction("PAGE",`[${r.providerName}]`,e,t),window.fbq("track","PageView",t)}track(e,t,i){let{eventName:o,params:s}=this.getTrackEvent(e,t);a.logAction("TRACK",`[${r.providerName}]`,o,s),window.fbq("track",o,s),typeof i=="function"&&i()}identify(e,t){a.logAction("IDENTIFY",`[${r.providerName}]`,e,t),window.fbq("setUserId",e),window.fbq("track","CompleteRegistration",t)}};var $=()=>typeof window<"u",S=()=>!(!$()||!window.hj),A=(r,...n)=>{if($()&&window.hj)return window.hj(r,...n);throw Error("Hotjar is not available, make sure init has been called.")},V=(r,n,e)=>{if(!((t,i,o)=>{try{let s=document.getElementById(i)||document.createElement("script");return s.id=i,s.nonce=o,s.innerText=t,s.crossOrigin="anonymous",document.head.appendChild(s),!0}catch{return!1}})(`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${r},hjsv:${n},hjdebug:${e?.debug||!1}};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,"hotjar-init-script",e?.nonce)||!S())throw Error("Failed to initialize Hotjar tracking script.")},K={init:(r,n,e)=>{try{return V(r,n,e),!0}catch(t){return console.error("Error:",t),!1}},event:r=>{try{return A("event",r),!0}catch(n){return console.error("Error:",n),!1}},identify:(r,n)=>{try{return A("identify",r,n),!0}catch(e){return console.error("Error:",e),!1}},stateChange:r=>{try{return A("stateChange",r),!0}catch(n){return console.error("Error:",n),!1}},isReady:S},p=K;var E=class r extends a{static{this.providerName="hotjar"}init(e,t,i={}){a.logAction("INIT",`[${r.providerName}]`,e),this.saveOptions(i),p.init(e,t)}ready(){return!!p}pageView(e,t){a.logAction("PAGE",`[${r.providerName}]`,e,t),p.stateChange(e)}track(e,t,i){let{eventName:o,params:s}=this.getTrackEvent(e,t);a.logAction("TRACK",`[${r.providerName}]`,o,s),p.event(o),typeof i=="function"&&i()}identify(e,t){throw a.logAction("IDENTIFY",`[${r.providerName}]`,e,t),p.identify(e,t),new Error("Method not implemented.")}};var N=class r extends a{static{this.providerName="user-guiding"}init(e,t={}){a.logAction("INIT",`[${r.providerName}]`,e),this.saveOptions(t);let i=`(function(g,u,i,d,e,s){g[e]=g[e]||[];var f=u.getElementsByTagName(i)[0];var k=u.createElement(i);k.async=true;k.src='https://static.userguiding.com/media/user-guiding-'+s+'-embedded.js';f.parentNode.insertBefore(k,f);if(g[d])return;var ug=g[d]={q:[]};ug.c=function(n){return function(){ug.q.push([n,arguments])};};var m=['previewGuide','finishPreview','track','identify','hideChecklist','launchChecklist'];for(var j=0;j<m.length;j+=1){ug[m[j]]=ug.c(m[j]);}})(window,document,'script','userGuiding','userGuidingLayer','${e}');`;c(i)}ready(){return!!window.userGuiding}pageView(){}track(e,t,i){let{eventName:o,params:s}=this.getTrackEvent(e,t);a.logAction("TRACK",`[${r.providerName}]`,o,s),window.userGuiding.track(o,s),typeof i=="function"&&i()}identify(e,t){a.logAction("IDENTIFY",`[${r.providerName}]`,e,t),window.userGuiding&&window.userGuiding.identify(e,t)}};var Y=new h([y,k,b,P,E,N]);window.t3musketeers=Y;})();
