(()=>{var m=!1;function b(e){m=e}var a={info:(...e)=>g(1,...e),warn:(...e)=>g(2,...e),error:(...e)=>g(3,...e)};function g(e,...r){if(m){let t=["\u{1F93A} %c[3-musketeers]"];switch(e){case 1:t.push("color: #06989A; font-weight: 600"),console.log(...t,...r);break;case 2:t.push("color: #C4A000; font-weight: 600"),console.warn(...t,...r);break;case 3:t.push("color: #CC0000; font-weight: 600"),console.error(...t,...r);break;default:break}}}var k=/\[object (Boolean|Number|String|Function|Array|Date|RegExp|Arguments)]/;function u(e){if(e==null)return String(e);let r=k.exec(Object.prototype.toString.call(Object(e)));return r?r[1].toLowerCase():"object"}function l(e){return u(e)==="array"}function w(e){return u(e)==="string"}function d(e,r){return Object.prototype.hasOwnProperty.call(Object(e),r)}function p(e){if(!e||u(e)!="object"||e.nodeType||e==e.window)return!1;try{if(e.constructor&&!d(e,"constructor")&&!d(e.constructor.prototype,"isPrototypeOf"))return!1}catch{return!1}let r;for(r in e);return r===void 0||d(e,r)}function _(e){return u(e)==="arguments"}function c(e,r){let t=!e._clear;for(let n in e)if(d(e,n)){let s=e[n];l(s)&&t?(l(r[n])||(r[n]=[]),c(s,r[n])):p(s)&&t?(p(r[n])||(r[n]={}),c(s,r[n])):r[n]=s}delete r._clear}function y(e,r){let t={},n=t,s=e.split(".");for(let o=0;o<s.length-1;o++)n=n[s[o]]={};return n[s[s.length-1]]=r,t}function v(e){return{set:(r,t)=>{c(y(r,t),e.model_)},get:r=>e.get(r)}}function O(e,r){w(e[0])||a.warn(`Error processing command, no command was run. The first argument must be of type string, but was of type ${typeof e[0]}.
The command run was ${e}`);let t=e[0].split("."),n=t.pop(),s=e.slice(1),o=r;for(let i=0;i<t.length;i++){if(o[t[i]]===void 0){a.warn(`Error processing command, no command was run as the object at ${t} was undefined.
The command run was ${e}`);return}o=o[t[i]]}try{o[n](...s)}catch{a.error(`An exception was thrown by the method ${n}, so no command was run.
The method was called on the data layer object at the location ${t}.`)}}var f=class{constructor(r,t={}){this.dataLayer_=r,this.listener_=t.listener||(()=>{}),this.listenToPast_=!!t.listenToPast,this.processed_=!1,this.executingListener_=!1,this.model_={},this.unprocessed_=[],this.abstractModelInterface_=v(this),t.debugMode&&b(!0);let n=this.dataLayer_.push;this.dataLayer_.push=(...s)=>{let o=[].slice.call(s,0),i=n.apply(this.dataLayer_,o);return this.processStates_(o),i},t.processNow&&this.process()}process(){this.processed_&&a.error("Process has already been run. This method should only run a single time to prepare the helper."),this.processed_=!0;let r=this.dataLayer_.length;for(let t=0;t<r;t++)this.processStates_([this.dataLayer_[t]],!this.listenToPast_)}get(r){let t=this.model_,n=r.split(".");for(let s=0;s<n.length;s++){if(t[n[s]]===void 0)return;t=t[n[s]]}return t}processStates_(r,t=!1){if(this.processed_&&(this.unprocessed_.push(...r),!this.executingListener_))for(;this.unprocessed_.length>0;){let n=this.unprocessed_.shift();if(l(n))O(n,this.model_);else if(!_(n))if(typeof n=="function")try{n.call(this.abstractModelInterface_)}catch(s){a.error(`An exception was thrown when running the method ${n}, execution was skipped.`,s)}else if(p(n))for(let s in n)c(y(s,n[s]),this.model_);else continue;t||(this.executingListener_=!0,this.listener_(this.model_,n),this.executingListener_=!1)}}};function L(e,r){e.forEach(t=>{let[n,s]=r;t.pageView(n,s)})}function P(e,r){e.forEach(t=>{let[n,s,o]=r;t.track(n,s,o)})}function x(e,r){e.forEach(t=>{let[n,s]=r;t.identify(n,s)})}var h=class{constructor(r=[]){this.listener=(r,t)=>{let n=[...t].splice(0,t.length);switch(n.shift()){case"init":let o=n.shift(),i=this.getProviderInstance(o);if(!i){a.error(`Provider '${o}' not found`);return}this.providers.push(i),i.init(...n);break;case"track":P(this.providers,n);break;case"page":L(this.providers,n);break;case"identify":x(this.providers,n);break}};this.availableProviders=r,this.providers=[];let t=window.dataQueue||[];this.helper=new f(t,{listener:this.listener,listenToPast:!0,processNow:!0,debugMode:!0})}getProviderInstance(r){let t=this.availableProviders.find(n=>n.providerName===r);if(t)return new t}};var R=new h;window.t3musketeers=R;})();
