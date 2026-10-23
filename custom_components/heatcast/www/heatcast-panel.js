var K=globalThis,B=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,q=Symbol(),we=new WeakMap,M=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(B&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=we.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&we.set(t,e))}return e}toString(){return this.cssText}},ve=a=>new M(typeof a=="string"?a:a+"",void 0,q),b=(a,...e)=>{let t=a.length===1?a[0]:e.reduce((i,o,s)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+a[s+1],a[0]);return new M(t,a,q)},ze=(a,e)=>{if(B)a.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),o=K.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=t.cssText,a.appendChild(i)}},Y=B?a=>a:a=>a instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return ve(t)})(a):a;var{is:Ve,defineProperty:qe,getOwnPropertyDescriptor:Ye,getOwnPropertyNames:Je,getOwnPropertySymbols:Xe,getPrototypeOf:Qe}=Object,F=globalThis,$e=F.trustedTypes,et=$e?$e.emptyScript:"",tt=F.reactiveElementPolyfillSupport,D=(a,e)=>a,J={toAttribute(a,e){switch(e){case Boolean:a=a?et:null;break;case Object:case Array:a=a==null?a:JSON.stringify(a)}return a},fromAttribute(a,e){let t=a;switch(e){case Boolean:t=a!==null;break;case Number:t=a===null?null:Number(a);break;case Object:case Array:try{t=JSON.parse(a)}catch{t=null}}return t}},ke=(a,e)=>!Ve(a,e),_e={attribute:!0,type:String,converter:J,reflect:!1,useDefault:!1,hasChanged:ke};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var j=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_e){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),o=this.getPropertyDescriptor(e,i,t);o!==void 0&&qe(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){let{get:o,set:s}=Ye(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:o,set(r){let d=o?.call(this);s?.call(this,r),this.requestUpdate(e,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_e}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let e=Qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let t=this.properties,i=[...Je(t),...Xe(t)];for(let o of i)this.createProperty(o,t[o])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,o]of t)this.elementProperties.set(i,o)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let o=this._$Eu(t,i);o!==void 0&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let o of i)t.unshift(Y(o))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ze(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:J).toAttribute(t,i.type);this._$Em=e,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){let i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){let s=i.getPropertyOptions(o),r=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:J;this._$Em=o;let d=r.fromAttribute(t,s.type);this[o]=d??this._$Ej?.get(o)??d,this._$Em=null}}requestUpdate(e,t,i,o=!1,s){if(e!==void 0){let r=this.constructor;if(o===!1&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??ke)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),s!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),o===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[o,s]of i){let{wrapped:r}=s,d=this[o];r!==!0||this._$AL.has(o)||d===void 0||this.C(o,void 0,s,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};j.elementStyles=[],j.shadowRootOptions={mode:"open"},j[D("elementProperties")]=new Map,j[D("finalized")]=new Map,tt?.({ReactiveElement:j}),(F.reactiveElementVersions??=[]).push("2.1.2");var se=globalThis,xe=a=>a,Z=se.trustedTypes,je=Z?Z.createPolicy("lit-html",{createHTML:a=>a}):void 0,Pe="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,He="?"+A,it=`<${He}>`,C=document,L=()=>C.createComment(""),I=a=>a===null||typeof a!="object"&&typeof a!="function",ae=Array.isArray,ot=a=>ae(a)||typeof a?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ae=/-->/g,Se=/>/g,S=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ee=/'/g,Ce=/"/g,Re=/^(?:script|style|textarea|title)$/i,re=a=>(e,...t)=>({_$litType$:a,strings:e,values:t}),n=re(1),R=re(2),vt=re(3),T=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Te=new WeakMap,E=C.createTreeWalker(C,129);function Me(a,e){if(!ae(a)||!a.hasOwnProperty("raw"))throw Error("invalid template strings array");return je!==void 0?je.createHTML(e):e}var st=(a,e)=>{let t=a.length-1,i=[],o,s=e===2?"<svg>":e===3?"<math>":"",r=N;for(let d=0;d<t;d++){let l=a[d],h,p,c=-1,u=0;for(;u<l.length&&(r.lastIndex=u,p=r.exec(l),p!==null);)u=r.lastIndex,r===N?p[1]==="!--"?r=Ae:p[1]!==void 0?r=Se:p[2]!==void 0?(Re.test(p[2])&&(o=RegExp("</"+p[2],"g")),r=S):p[3]!==void 0&&(r=S):r===S?p[0]===">"?(r=o??N,c=-1):p[1]===void 0?c=-2:(c=r.lastIndex-p[2].length,h=p[1],r=p[3]===void 0?S:p[3]==='"'?Ce:Ee):r===Ce||r===Ee?r=S:r===Ae||r===Se?r=N:(r=S,o=void 0);let f=r===S&&a[d+1].startsWith("/>")?" ":"";s+=r===N?l+it:c>=0?(i.push(h),l.slice(0,c)+Pe+l.slice(c)+A+f):l+A+(c===-2?d:f)}return[Me(a,s+(a[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},O=class a{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let s=0,r=0,d=e.length-1,l=this.parts,[h,p]=st(e,t);if(this.el=a.createElement(h,i),E.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(o=E.nextNode())!==null&&l.length<d;){if(o.nodeType===1){if(o.hasAttributes())for(let c of o.getAttributeNames())if(c.endsWith(Pe)){let u=p[r++],f=o.getAttribute(c).split(A),v=/([.?@])?(.*)/.exec(u);l.push({type:1,index:s,name:v[2],strings:f,ctor:v[1]==="."?ee:v[1]==="?"?te:v[1]==="@"?ie:H}),o.removeAttribute(c)}else c.startsWith(A)&&(l.push({type:6,index:s}),o.removeAttribute(c));if(Re.test(o.tagName)){let c=o.textContent.split(A),u=c.length-1;if(u>0){o.textContent=Z?Z.emptyScript:"";for(let f=0;f<u;f++)o.append(c[f],L()),E.nextNode(),l.push({type:2,index:++s});o.append(c[u],L())}}}else if(o.nodeType===8)if(o.data===He)l.push({type:2,index:s});else{let c=-1;for(;(c=o.data.indexOf(A,c+1))!==-1;)l.push({type:7,index:s}),c+=A.length-1}s++}}static createElement(e,t){let i=C.createElement("template");return i.innerHTML=e,i}};function P(a,e,t=a,i){if(e===T)return e;let o=i!==void 0?t._$Co?.[i]:t._$Cl,s=I(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(a),o._$AT(a,t,i)),i!==void 0?(t._$Co??=[])[i]=o:t._$Cl=o),o!==void 0&&(e=P(a,o._$AS(a,e.values),o,i)),e}var Q=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??C).importNode(t,!0);E.currentNode=o;let s=E.nextNode(),r=0,d=0,l=i[0];for(;l!==void 0;){if(r===l.index){let h;l.type===2?h=new W(s,s.nextSibling,this,e):l.type===1?h=new l.ctor(s,l.name,l.strings,this,e):l.type===6&&(h=new oe(s,this,e)),this._$AV.push(h),l=i[++d]}r!==l?.index&&(s=E.nextNode(),r++)}return E.currentNode=C,o}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},W=class a{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),I(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==T&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):ot(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=O.createElement(Me(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{let s=new Q(o,this),r=s.u(this.options);s.p(t),this.T(r),this._$AH=s}}_$AC(e){let t=Te.get(e.strings);return t===void 0&&Te.set(e.strings,t=new O(e)),t}k(e){ae(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,o=0;for(let s of e)o===t.length?t.push(i=new a(this.O(L()),this.O(L()),this,this.options)):i=t[o],i._$AI(s),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=xe(e).nextSibling;xe(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,s){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=m}_$AI(e,t=this,i,o){let s=this.strings,r=!1;if(s===void 0)e=P(this,e,t,0),r=!I(e)||e!==this._$AH&&e!==T,r&&(this._$AH=e);else{let d=e,l,h;for(e=s[0],l=0;l<s.length-1;l++)h=P(this,d[i+l],t,l),h===T&&(h=this._$AH[l]),r||=!I(h)||h!==this._$AH[l],h===m?e=m:e!==m&&(e+=(h??"")+s[l+1]),this._$AH[l]=h}r&&!o&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ee=class extends H{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},te=class extends H{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},ie=class extends H{constructor(e,t,i,o,s){super(e,t,i,o,s),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??m)===T)return;let i=this._$AH,o=e===m&&i!==m||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==m&&(i===m||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},oe=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var at=se.litHtmlPolyfillSupport;at?.(O,W),(se.litHtmlVersions??=[]).push("3.3.3");var De=(a,e,t)=>{let i=t?.renderBefore??e,o=i._$litPart$;if(o===void 0){let s=t?.renderBefore??null;i._$litPart$=o=new W(e.insertBefore(L(),s),s,void 0,t??{})}return o._$AI(a),o};var ne=globalThis,y=class extends j{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=De(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};y._$litElement$=!0,y.finalized=!0,ne.litElementHydrateSupport?.({LitElement:y});var rt=ne.litElementPolyfillSupport;rt?.({LitElement:y});(ne.litElementVersions??=[]).push("4.2.2");function Ne(a){return a.callWS({type:"heatcast/entries"})}function Le(a,e,t){return a.callWS({type:"heatcast/set_options",entry_id:e,individual_rooms:t})}async function Ie(a,e,t,i){return a.callWS({type:"history/history_during_period",start_time:t.toISOString(),end_time:i.toISOString(),entity_ids:e,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}var Oe={"history.raw":"Every change as recorded","history.daily":"Daily averages","stats.average":"average {h} h/day","s.setpoint":"Setpoint","s.measured":"Measured","s.curve":"Curve","s.outdoor":"Sensor","s.damped":"Damped","s.effective":"Effective","s.house":"House","s.house_target":"House setpoint","s.correction":"Total","s.forecast":"Forecast","s.solar":"Sun","s.wind":"Wind","s.demand":"Demand","s.control":"Boiler control","s.flame":"Burner","s.dhw":"Hot water","tab.history":"History","tab.guide":"Guide","tab.home":"Home","tab.settings":"Settings",loading:"Loading\u2026",no_entry:"HeatCast is not set up yet. Add it under Settings \u2192 Devices & services.",house:"House",inside:"Inside",target:"Target",heating:"Heating",heating_off:"Off",control_on:"HeatCast controls the boiler",control_off:"Shadow mode \u2013 nothing is sent to the boiler",demand:"Heating demand",no_demand:"No heating demand",flame:"Burner on",dhw:"Hot water",sync:"Sync",sync_hint:"All rooms follow the house",individual_hint:"Each room keeps its own temperature",boiler:"Boiler",flow_setpoint:"Flow setpoint",flow_measured:"Measured",why_flow:"Where the flow temperature comes from",outdoor_damped:"Damped outdoor",forecast_effect:"Forecast",solar:"Sun",wind:"Wind",outdoor_effective:"Effective outdoor",curve_at:"Curve at {t}",p_term:"Room correction (P)",integral:"Integral (I)",limited_min:"Raised to minimum",limited_max:"Lowered to maximum",result:"Flow setpoint",summer:"Above the summer threshold \u2013 no heating",weather:"Weather",outdoor_now:"Outdoor now",forecast:"Forecast",forecast_stale:"Forecast out of date",next_hours:"next {h} h",cloud:"Clouds",forecast_change:"Temperature change",daylight:"Daylight",rooms:"Rooms",filtered:"Filtered",weight:"Weight",too_cold:"{d} K below target",too_warm:"{d} K above target",on_target:"On target",sensor_missing:"No reading",range:"Range","chart.flow":"Flow temperature","chart.outdoor":"Outdoor temperature","chart.rooms":"Rooms","chart.correction":"Room correction","chart.weather":"Weather effects","chart.states":"States","stats.burner":"Burner hours per day","stats.demand":"Hours with heating demand","stats.no_flame":"Burner hours need a burner sensor in the boiler settings.","stats.days":"Last {n} days","stats.total":"Total {h} h","settings.temperatures":"Temperatures","settings.curve":"Heating curve","settings.curve_hint":"Flow temperature over outdoor temperature at the current house setpoint. The dot is where the controller is now.","settings.controller":"Room controller","settings.weather":"Weather and forecast","settings.filter":"Room sensor filter","settings.rooms":"Room weights","settings.features":"Features","settings.individual":"Individual room temperatures","settings.individual_hint":"Adds a thermostat to every room and the sync switch. With one heating circuit and no radiator valves the rooms share one compromise.","settings.boiler":"Boiler","settings.control":"Boiler control","settings.control_hint":"While off, HeatCast only calculates. Turn off any other automation writing the boiler first.","settings.control_confirm":"Send the flow setpoint to the boiler from now on?","settings.confirm":"Turn on","settings.cancel":"Cancel","settings.test_mode":"Boiler test mode","settings.test_mode_hint":"Sends the test flow temperature for up to an hour, regardless of the model.","settings.entities":"Entities and devices","settings.admin_only":"Only administrators can change settings."},nt={"history.raw":"Ka\u017Cda zmiana, jak zapisano","history.daily":"\u015Arednie dobowe","stats.average":"\u015Brednio {h} h/dob\u0119","s.setpoint":"Zadana","s.measured":"Zmierzona","s.curve":"Z krzywej","s.outdoor":"Czujnik","s.damped":"T\u0142umiona","s.effective":"Efektywna","s.house":"Dom","s.house_target":"Nastawa domu","s.correction":"Razem","s.forecast":"Prognoza","s.solar":"S\u0142o\u0144ce","s.wind":"Wiatr","s.demand":"Zapotrzebowanie","s.control":"Sterowanie kot\u0142em","s.flame":"Palnik","s.dhw":"C.w.u.","tab.history":"Historia","tab.guide":"Instrukcja","tab.home":"Dom","tab.settings":"Ustawienia",loading:"Wczytywanie\u2026",no_entry:"HeatCast nie jest jeszcze skonfigurowany. Dodaj go w Ustawienia \u2192 Urz\u0105dzenia i us\u0142ugi.",house:"Dom",inside:"W domu",target:"Nastawa",heating:"Grzanie",heating_off:"Wy\u0142\u0105czone",control_on:"HeatCast steruje kot\u0142em",control_off:"Tryb cienia \u2013 nic nie jest wysy\u0142ane do kot\u0142a",demand:"Zapotrzebowanie na grzanie",no_demand:"Brak zapotrzebowania",flame:"Palnik pracuje",dhw:"C.w.u.",sync:"Sync",sync_hint:"Wszystkie pokoje jak dom",individual_hint:"Ka\u017Cdy pok\xF3j ma w\u0142asn\u0105 temperatur\u0119",boiler:"Kocio\u0142",flow_setpoint:"Zadana zasilania",flow_measured:"Zmierzona",why_flow:"Sk\u0105d si\u0119 bierze temperatura zasilania",outdoor_damped:"Zewn\u0119trzna t\u0142umiona",forecast_effect:"Prognoza",solar:"S\u0142o\u0144ce",wind:"Wiatr",outdoor_effective:"Efektywna zewn\u0119trzna",curve_at:"Krzywa przy {t}",p_term:"Korekta pokoi (P)",integral:"Ca\u0142ka (I)",limited_min:"Podniesione do minimum",limited_max:"Obni\u017Cone do maksimum",result:"Zadana zasilania",summer:"Powy\u017Cej progu lato/zima \u2013 bez grzania",weather:"Pogoda",outdoor_now:"Na zewn\u0105trz teraz",forecast:"Prognoza",forecast_stale:"Prognoza nieaktualna",next_hours:"najbli\u017Csze {h} h",cloud:"Zachmurzenie",forecast_change:"Zmiana temperatury",daylight:"Dzie\u0144",rooms:"Pokoje",filtered:"Po filtrze",weight:"Waga",too_cold:"{d} K poni\u017Cej nastawy",too_warm:"{d} K powy\u017Cej nastawy",on_target:"Na nastawie",sensor_missing:"Brak odczytu",range:"Zakres","chart.flow":"Temperatura zasilania","chart.outdoor":"Temperatura zewn\u0119trzna","chart.rooms":"Pokoje","chart.correction":"Korekta pokojowa","chart.weather":"Wp\u0142yw pogody","chart.states":"Stany","stats.burner":"Godziny pracy palnika na dob\u0119","stats.demand":"Godziny z zapotrzebowaniem","stats.no_flame":"Godziny pracy palnika wymagaj\u0105 czujnika palnika w ustawieniach kot\u0142a.","stats.days":"Ostatnie {n} dni","stats.total":"Razem {h} h","settings.temperatures":"Temperatury","settings.curve":"Krzywa grzewcza","settings.curve_hint":"Temperatura zasilania w funkcji temperatury zewn\u0119trznej przy bie\u017C\u0105cej nastawie domu. Kropka pokazuje, gdzie regulator jest teraz.","settings.controller":"Regulator pokojowy","settings.weather":"Pogoda i prognoza","settings.filter":"Filtr czujnik\xF3w pokojowych","settings.rooms":"Wagi pokoi","settings.features":"Funkcje","settings.individual":"Indywidualne temperatury pokoi","settings.individual_hint":"Dodaje termostat ka\u017Cdemu pokojowi i prze\u0142\u0105cznik Sync. Przy jednym obiegu bez g\u0142owic na grzejnikach pokoje dziel\u0105 jeden kompromis.","settings.boiler":"Kocio\u0142","settings.control":"Sterowanie kot\u0142em","settings.control_hint":"Wy\u0142\u0105czone: HeatCast tylko liczy. Najpierw wy\u0142\u0105cz inne automatyzacje zapisuj\u0105ce do kot\u0142a.","settings.control_confirm":"Od teraz wysy\u0142a\u0107 zadan\u0105 zasilania do kot\u0142a?","settings.confirm":"W\u0142\u0105cz","settings.cancel":"Anuluj","settings.test_mode":"Tryb testowy kot\u0142a","settings.test_mode_hint":"Wysy\u0142a testow\u0105 temperatur\u0119 zasilania przez maks. godzin\u0119, niezale\u017Cnie od modelu.","settings.entities":"Encje i urz\u0105dzenia","settings.admin_only":"Ustawienia mo\u017Ce zmienia\u0107 tylko administrator."};function le(a){let e=a.startsWith("pl")?{...Oe,...nt}:Oe;return(t,i)=>{let o=e[t]??t;for(let[s,r]of Object.entries(i??{}))o=o.replace(`{${s}}`,String(r));return o}}function $(a,e,t=1){return e===void 0?"\u2013":e.toLocaleString(a,{minimumFractionDigits:t,maximumFractionDigits:t})}function de(a,e,t=1){let i=$(a,Math.abs(e),t);return Math.abs(e)<.5*10**-t?i:e>0?`+${i}`:`\u2212${i}`}var _=b`
  :host {
    --hc-heat: var(--state-climate-heat-color, #ff8100);
    --hc-cold: var(--state-climate-cool-color, #2b9af9);
    --hc-ok: var(--success-color, #43a047);
    --hc-muted: var(--secondary-text-color);
    --hc-radius: var(--ha-card-border-radius, 12px);
    --hc-gap: 16px;
  }

  .card {
    background: var(--ha-card-background, var(--card-background-color, #fff));
    border-radius: var(--hc-radius);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
    box-shadow: var(--ha-card-box-shadow, none);
    padding: 16px;
    box-sizing: border-box;
    min-width: 0;
  }

  .card h2 {
    margin: 0 0 12px;
    font-size: 1rem;
    font-weight: 500;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .muted {
    color: var(--hc-muted);
  }

  .small {
    font-size: 0.85rem;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 0.8rem;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.12));
    color: var(--primary-text-color);
    white-space: nowrap;
  }

  .chip.heat {
    background: color-mix(in srgb, var(--hc-heat) 18%, transparent);
    color: var(--hc-heat);
  }

  .chip.ok {
    background: color-mix(in srgb, var(--hc-ok) 18%, transparent);
    color: var(--hc-ok);
  }

  .chip.cold {
    background: color-mix(in srgb, var(--hc-cold) 18%, transparent);
    color: var(--hc-cold);
  }

  button.round {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--divider-color, #e0e0e0);
    background: transparent;
    color: var(--primary-text-color);
    font-size: 1.4rem;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button.round:hover {
    background: var(--secondary-background-color);
  }

  button.round:disabled {
    opacity: 0.4;
    cursor: default;
  }

  ha-icon {
    --mdc-icon-size: 20px;
  }
`;var lt=["Czujnik zewn\u0119trzny","T\u0142umienie","Prognoza, s\u0142o\u0144ce, wiatr","Krzywa","Korekta pokoi","Granice","Kocio\u0142"],dt=["Outdoor sensor","Damping","Forecast, sun, wind","Curve","Room correction","Limits","Boiler"],We=a=>n`<div class="pipeline">${a.map(e=>n`<span class="chip">${e}</span>`)}</div>`,ct=[{icon:"mdi:information-outline",title:"Jak dzia\u0142a HeatCast",body:n`
      <p>
        HeatCast wylicza temperaturę wody zasilającej grzejniki i podłogówkę i co 30 sekund wysyła ją do kotła. Nie
        włącza i nie wyłącza palnika: o tym decyduje kocioł, utrzymując zadaną temperaturę zasilania.
      </p>
      ${We(lt)}
      <ol>
        <li><b>Temperatura zewnętrzna</b> jest tłumiona, bo dom stygnie i nagrzewa się z opóźnieniem.</li>
        <li>
          <b>Prognoza</b> przesuwa ją w stronę temperatury z najbliższych godzin. Słońce ją podnosi, wiatr obniża. Wynik
          to <b>temperatura efektywna</b>.
        </li>
        <li><b>Krzywa grzewcza</b> zamienia temperaturę efektywną na temperaturę zasilania.</li>
        <li>
          <b>Korekta pokoi</b> (regulator PI) dodaje lub odejmuje do kilku kelwinów zależnie od tego, czy w pokojach jest
          za zimno, czy za ciepło.
        </li>
        <li>Wynik jest ograniczany do zakresu minimum–maksimum i zaokrąglany do pełnego stopnia.</li>
      </ol>
      <p>Każdy z tych kroków widać na zakładce <b>Dom</b> w karcie kotła.</p>
    `},{icon:"mdi:rocket-launch-outline",title:"Pierwsze uruchomienie i przej\u015Bcie na sterowanie",body:n`
      <p>
        Po instalacji HeatCast działa w <b>trybie cienia</b>: liczy wszystko, ale nic nie wysyła do kotła. Zostaw go tak
        na kilka dni i porównaj jego zadaną z tym, co robi obecne sterowanie. Na zakładce <b>Historia</b> widać oba
        przebiegi.
      </p>
      <p>Przejście na sterowanie:</p>
      <ol>
        <li>
          Ustaw w kotle zachowanie awaryjne: własną krzywę grzewczą albo stałą temperaturę i ochronę przed zamarzaniem.
          Kocioł wróci do niego, gdy HeatCast przestanie wysyłać zadaną.
        </li>
        <li>
          <b>Wyłącz wszystkie inne automatyzacje i termostaty, które zapisują zadaną do kotła.</b> Dwóch piszących
          naraz kocioł nie rozróżni.
        </li>
        <li>Włącz <b>Sterowanie kotłem</b> w ustawieniach i obserwuj zadaną i zmierzone zasilanie przez pierwsze godziny.</li>
      </ol>
      <p>Wyłączenie sterowania zdejmuje blokadę grzania, więc kocioł od razu może grzać według własnych ustawień.</p>
    `},{icon:"mdi:shield-check-outline",title:"Bezpiecze\u0144stwo i awarie",body:n`
      <ul>
        <li>
          <b>Home Assistant nie działa:</b> zadana przestaje być odświeżana. Kocioł po kilku minutach wraca do własnego
          sterowania (z EMS-ESP i kotłami Bosch po ok. 4 minutach).
        </li>
        <li>
          <b>Brak odczytów z pokoi:</b> gdy działa mniej niż połowa wagi czujników, korekta pokoi wynosi 0, a całka stoi.
          Grzanie idzie według samej krzywej.
        </li>
        <li>
          <b>Krótki zanik czujnika</b> (Bluetooth potrafi zniknąć na kilka minut): przez czas ustawiony w
          <i>Zanik czujnika: podtrzymanie</i> liczy się ostatnia wartość.
        </li>
        <li><b>Prognoza starsza niż 3 godziny</b> jest pomijana, liczy się sama temperatura tłumiona.</li>
        <li>
          <b>Tryb wyłączony</b> na termostacie domu oznacza brak zapotrzebowania. Przy włączonym sterowaniu kocioł dostaje
          blokadę grzania c.o. Przed zamarzaniem chroni wtedy tylko funkcja kotła.
        </li>
        <li>Stan regulatora jest zapisywany i przetrwa restart Home Assistanta.</li>
      </ul>
    `},{icon:"mdi:chart-bell-curve-cumulative",title:"Dob\xF3r krzywej grzewczej",body:n`
      <p>Krzywą najlepiej poprawiać rzadko i małymi krokami, po kilku dniach obserwacji przy różnej pogodzie.</p>
      <table>
        <tr><th>Objaw</th><th>Zmiana</th></tr>
        <tr><td>Za zimno przy każdej pogodzie</td><td>Przesunięcie w górę o 1 K</td></tr>
        <tr><td>Za zimno tylko przy mrozie</td><td>Zasilanie projektowe w górę o 2–3 °C</td></tr>
        <tr><td>Za ciepło tylko przy łagodnej pogodzie</td><td>Przesunięcie w dół i zasilanie projektowe w górę o tyle samo</td></tr>
        <tr><td>Grzanie startuje za wcześnie lub za późno jesienią</td><td>Próg „Grzanie wyłączone powyżej”</td></tr>
      </table>
      <p>
        <b>Najlepsza wskazówka to całka.</b> Regulator pokojowy przez całkę poprawia stały błąd krzywej. Jeśli całka
        długo stoi na <b>+3 K</b>, krzywa jest za nisko. Jeśli na <b>−3 K</b>, krzywa jest za wysoko albo minimalna
        temperatura zasilania nie pozwala zejść niżej.
      </p>
      <p>Wygięcie: podłogówka ok. 1,1, grzejniki ok. 1,3. Wykres krzywej w ustawieniach zmienia się na żywo.</p>
    `},{icon:"mdi:tune-vertical",title:"Regulator pokojowy",body:n`
      <ul>
        <li>
          <b>Odchyłka pokoi</b> to średnia ważona różnic między nastawą a temperaturą w pokojach. Dodatnia: za zimno.
        </li>
        <li><b>Wzmocnienie P</b>: o ile kelwinów rośnie zasilanie na każdy brakujący stopień w pokoju (ograniczone do ±3 K).</li>
        <li>
          <b>Czas całkowania</b>: im dłuższy, tym wolniej całka nadrabia stały błąd (całka ograniczona do ±3 K). Przy
          podłogówce kilka godzin jest rozsądne.
        </li>
        <li>
          Całka stoi, gdy nie ma zapotrzebowania, brakuje odczytów pokoi albo zasilanie jest już na granicy, a błąd pcha
          dalej w tę samą stronę.
        </li>
        <li>
          <b>Filtr pokoi</b> przepuszcza zmiany temperatury tylko do zadanej prędkości. Otwarte okno albo kilka osób w
          małym pokoju nie przestawia regulatora.
        </li>
      </ul>
    `},{icon:"mdi:weather-partly-snowy-rainy",title:"Pogoda, prognoza, s\u0142o\u0144ce i wiatr",body:n`
      <ul>
        <li><b>Bezwładność budynku</b> (τ): jak wolno dom reaguje na zmianę pogody. Lekki dom 2–3 h, masywny 6–10 h.</li>
        <li><b>Horyzont prognozy</b>: ile godzin naprzód brać pod uwagę. Dobrze odpowiada opóźnieniu ogrzewania.</li>
        <li><b>Waga prognozy</b>: 0 bez prognozy, 1 tylko prognoza. 0,5 to bezpieczny początek.</li>
        <li>
          <b>Zysk od słońca</b>: o ile kelwinów podnieść temperaturę efektywną przy pełnym słońcu. Zacznij od 0 i zwiększaj,
          gdy dom przegrzewa się w słoneczne dni.
        </li>
        <li>
          <b>Strata od wiatru</b>: obniżenie temperatury efektywnej na każdy km/h powyżej progu. Dla nieszczelnych lub
          wystawionych na wiatr domów.
        </li>
      </ul>
    `},{icon:"mdi:floor-plan",title:"Pokoje, wagi i indywidualne temperatury",body:n`
      <ul>
        <li>
          <b>Waga</b> mówi, jak mocno pokój liczy się w regulacji. Pokoje, w których komfort jest ważny, mają wyższą wagę.
          Waga 0 pokazuje pokój bez wpływu na regulację.
        </li>
        <li>
          <b>Indywidualne temperatury pokoi</b> włączasz w ustawieniach. Każdy pokój dostaje wtedy termostat, a przy
          termostacie domu pojawia się przycisk <b>SYNC</b>. Gdy jest włączony, wszystkie pokoje mają nastawę domu. Zmiana
          temperatury jednego pokoju wyłącza SYNC, jak w klimatyzacji samochodowej.
        </li>
        <li>
          Przy jednym obiegu grzewczym bez głowic na grzejnikach kocioł nie utrzyma różnych temperatur w pokojach.
          Regulator znajdzie kompromis według wag, a karta pokoju pokaże, ile brakuje do nastawy.
        </li>
        <li>
          <b>Głowice termostatyczne</b> przypisane do pokoju dostają jego nastawę co 5 minut, gdy sterowanie jest włączone.
          Jeśli głowica ma wejście temperatury zewnętrznej, HeatCast wpisuje do niego odczyt czujnika pokoju.
        </li>
      </ul>
    `},{icon:"mdi:calendar-clock",title:"Harmonogram i obni\u017Cenie eko",body:n`
      <p>
        W godzinach harmonogramu komfortu obowiązuje temperatura domu. Poza nimi wszystkie nastawy, także pokoi, są
        obniżane o <b>obniżenie eko</b>. Przy podłogówce obniżenie większe niż 1 K rzadko się opłaca, bo wylewka reaguje
        z wielogodzinnym opóźnieniem.
      </p>
    `},{icon:"mdi:test-tube",title:"Tryb testowy kot\u0142a",body:n`
      <p>
        Wysyła stałą testową temperaturę zasilania niezależnie od modelu, także w trybie cienia. Służy do sprawdzenia, czy
        kocioł przyjmuje zadaną. Wyłącza się sam po godzinie. Po wyłączeniu kocioł po kilku minutach wraca do własnego
        sterowania, co pozwala sprawdzić też zachowanie awaryjne.
      </p>
    `}],ht=[{icon:"mdi:information-outline",title:"How HeatCast works",body:n`
      <p>
        HeatCast calculates the temperature of the water flowing to radiators and underfloor heating and sends it to the
        boiler every 30 seconds. It does not switch the burner: the boiler does that while holding the requested flow
        temperature.
      </p>
      ${We(dt)}
      <ol>
        <li><b>The outdoor temperature</b> is damped, because the house cools and warms with a delay.</li>
        <li>
          <b>The forecast</b> shifts it towards the coming hours. Sun raises it, wind lowers it. The result is the
          <b>effective temperature</b>.
        </li>
        <li><b>The heating curve</b> turns the effective temperature into a flow temperature.</li>
        <li>
          <b>The room correction</b> (a PI controller) adds or removes a few kelvin depending on whether the rooms are too
          cold or too warm.
        </li>
        <li>The result is kept between minimum and maximum and rounded to a whole degree.</li>
      </ol>
      <p>Every step is shown on the <b>Home</b> tab in the boiler card.</p>
    `},{icon:"mdi:rocket-launch-outline",title:"First start and taking over the boiler",body:n`
      <p>
        After installation HeatCast runs in <b>shadow mode</b>: it calculates everything but sends nothing to the boiler.
        Leave it like that for a few days and compare its setpoint with your current control on the <b>History</b> tab.
      </p>
      <p>Taking over:</p>
      <ol>
        <li>
          Set the boiler's fallback: its own heating curve or a fixed temperature, plus frost protection. The boiler returns
          to it when HeatCast stops sending.
        </li>
        <li><b>Turn off every other automation or thermostat writing the boiler setpoint.</b> The boiler cannot tell two writers apart.</li>
        <li>Turn on <b>Boiler control</b> in the settings and watch the setpoint and the measured flow for the first hours.</li>
      </ol>
      <p>Turning control off lifts the heating block, so the boiler can heat on its own settings straight away.</p>
    `},{icon:"mdi:shield-check-outline",title:"Safety and failures",body:n`
      <ul>
        <li>
          <b>Home Assistant is down:</b> the setpoint is no longer refreshed and the boiler returns to its own control after
          a few minutes (about 4 minutes with EMS-ESP and Bosch boilers).
        </li>
        <li>
          <b>No room readings:</b> with less than half of the sensor weight available, the room correction is 0 and the
          integral holds. Heating follows the curve alone.
        </li>
        <li>
          <b>A short sensor dropout</b> (Bluetooth sensors vanish for minutes) keeps the last value for the time set in
          <i>Sensor dropout hold</i>.
        </li>
        <li><b>A forecast older than 3 hours</b> is ignored and the damped temperature is used alone.</li>
        <li>
          <b>Off</b> on the house thermostat means no heating demand. With control on, the boiler's space heating is
          blocked and only the boiler's own frost protection remains.
        </li>
        <li>The controller state is stored and survives a Home Assistant restart.</li>
      </ul>
    `},{icon:"mdi:chart-bell-curve-cumulative",title:"Tuning the heating curve",body:n`
      <p>Change the curve rarely and in small steps, after a few days of different weather.</p>
      <table>
        <tr><th>Symptom</th><th>Change</th></tr>
        <tr><td>Too cold in any weather</td><td>Shift up by 1 K</td></tr>
        <tr><td>Too cold only in frost</td><td>Design flow temperature up by 2–3 °C</td></tr>
        <tr><td>Too warm only in mild weather</td><td>Shift down and design flow temperature up by the same amount</td></tr>
        <tr><td>Heating starts too early or too late in autumn</td><td>“Heating off above” threshold</td></tr>
      </table>
      <p>
        <b>The integral is the best hint.</b> It corrects a steady curve error. If it sits at <b>+3 K</b> for long, the curve
        is too low. At <b>−3 K</b> the curve is too high, or the minimum flow temperature does not let it go lower.
      </p>
      <p>Curvature: underfloor about 1.1, radiators about 1.3. The curve chart in the settings updates live.</p>
    `},{icon:"mdi:tune-vertical",title:"Room controller",body:n`
      <ul>
        <li><b>Room deviation</b> is the weighted difference between targets and room temperatures. Positive means too cold.</li>
        <li><b>Proportional gain</b>: kelvin of flow per missing degree in the rooms (limited to ±3 K).</li>
        <li>
          <b>Integral time</b>: the longer, the slower the integral removes a steady error (limited to ±3 K). A few hours
          suit underfloor heating.
        </li>
        <li>
          The integral holds without heating demand, without room readings, or when the flow is at a limit and the error
          pushes further into it.
        </li>
        <li>
          <b>The room filter</b> passes temperature changes only up to a set speed, so an open window or a few people in a
          small room do not move the controller.
        </li>
      </ul>
    `},{icon:"mdi:weather-partly-snowy-rainy",title:"Weather, forecast, sun and wind",body:n`
      <ul>
        <li><b>Building time constant</b> (τ): how slowly the house follows the weather. Light houses 2–3 h, heavy ones 6–10 h.</li>
        <li><b>Forecast horizon</b>: how many hours ahead to look. Matching the heating delay works well.</li>
        <li><b>Forecast weight</b>: 0 ignores the forecast, 1 uses only the forecast. 0.5 is a safe start.</li>
        <li><b>Sun gain</b>: kelvin added to the effective temperature in full sun. Start at 0 and raise it if the house overheats on sunny days.</li>
        <li><b>Wind loss</b>: kelvin removed per km/h above the threshold, for draughty or exposed houses.</li>
      </ul>
    `},{icon:"mdi:floor-plan",title:"Rooms, weights and individual temperatures",body:n`
      <ul>
        <li><b>Weight</b> sets how much a room counts. Give rooms where comfort matters a higher weight; 0 only shows the room.</li>
        <li>
          <b>Individual room temperatures</b> are enabled in the settings. Every room gets a thermostat and the house
          thermostat gets a <b>SYNC</b> button. With SYNC on, all rooms use the house setpoint. Changing one room turns
          SYNC off, like in a car's climate control.
        </li>
        <li>
          With one heating circuit and no radiator valves the boiler cannot hold different temperatures in different rooms.
          The controller finds a weighted compromise and each room card shows how far it is from its target.
        </li>
        <li>
          <b>Radiator valves</b> assigned to a room get its target every 5 minutes while control is on. If a valve accepts
          an external temperature, HeatCast writes the room sensor value to it.
        </li>
      </ul>
    `},{icon:"mdi:calendar-clock",title:"Schedule and eco setback",body:n`
      <p>
        During the comfort schedule the house temperature applies. Outside it every target, rooms included, is lowered by
        the <b>eco setback</b>. With underfloor heating a setback above 1 K rarely pays off, since the screed reacts hours
        later.
      </p>
    `},{icon:"mdi:test-tube",title:"Boiler test mode",body:n`
      <p>
        Sends a fixed test flow temperature regardless of the model, even in shadow mode, to check that the boiler accepts
        the setpoint. It turns itself off after an hour; the boiler then returns to its own control after a few minutes,
        which tests the fallback as well.
      </p>
    `}],ce=class extends y{constructor(){super(...arguments);this.language="en"}static{this.properties={language:{}}}render(){let t=this.language.startsWith("pl")?ct:ht;return n`
      <div class="guide">
        ${t.map((i,o)=>n`
            <details class="card" ?open=${o===0}>
              <summary><ha-icon icon=${i.icon}></ha-icon><span>${i.title}</span></summary>
              <div class="body">${i.body}</div>
            </details>
          `)}
      </div>
    `}static{this.styles=[_,b`
      .guide {
        max-width: 860px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      details.card {
        padding: 0;
      }
      summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        cursor: pointer;
        font-weight: 500;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: "";
        margin-left: auto;
        width: 8px;
        height: 8px;
        border-right: 2px solid var(--hc-muted);
        border-bottom: 2px solid var(--hc-muted);
        transform: rotate(45deg);
        transition: transform 0.2s;
      }
      details[open] summary::after {
        transform: rotate(-135deg);
      }
      summary ha-icon {
        color: var(--primary-color);
      }
      .body {
        padding: 0 16px 16px 48px;
        line-height: 1.55;
      }
      .body p,
      .body ul,
      .body ol {
        margin: 0 0 10px;
      }
      .body li {
        margin-bottom: 6px;
      }
      .pipeline {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 8px 0 12px;
      }
      .pipeline .chip:not(:last-child)::after {
        content: "→";
        margin-left: 6px;
        color: var(--hc-muted);
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 4px 0 12px;
        font-size: 0.9rem;
      }
      th,
      td {
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      th {
        color: var(--hc-muted);
        font-weight: 500;
      }
      @media (max-width: 600px) {
        .body {
          padding-left: 16px;
        }
      }
    `]}};customElements.get("heatcast-guide")??customElements.define("heatcast-guide",ce);var Ue;async function he(a){if(window.loadCardHelpers)return Ue??=window.loadCardHelpers(),(await Ue).createCardElement(a)}function k(a,e){if(!e)return;let t=Number.parseFloat(a.states[e]?.state??"");return Number.isFinite(t)?t:void 0}function w(a,e){return!!e&&a.states[e]?.state==="on"}function Ke(a,e,t){a.dispatchEvent(new CustomEvent(e,{detail:t,bubbles:!0,composed:!0}))}var Be=[{hours:24,days:7,label:"24 h"},{hours:168,days:14,label:"7 d"},{hours:720,days:30,label:"30 d"}],Fe=720;function Ze(a,e,t){let i=[];for(let o=new Date(e);o<t;o.setDate(o.getDate()+1))i.push({day:new Date(o),hours:0});for(let o=0;o<a.length;o++){if(a[o].s!=="on")continue;let s=Math.max(a[o].lu*1e3,e.getTime()),r=Math.min(o+1<a.length?a[o+1].lu*1e3:Date.now(),t.getTime());for(let d of i){let l=d.day.getTime(),h=new Date(d.day).setDate(d.day.getDate()+1),p=Math.min(r,h)-Math.max(s,l);p>0&&(d.hours+=p/36e5)}}return i}function pt(a,e){let t=a.entities,i=a.sources;return[{title:"chart.flow",series:[{entity:t.flow_setpoint,name:e("s.setpoint")},{entity:i.flow_sensor,name:e("s.measured")},{entity:t.curve_flow,name:e("s.curve")}]},{title:"chart.outdoor",series:[{entity:i.outdoor_sensor,name:e("s.outdoor")},{entity:t.outdoor_damped,name:e("s.damped")},{entity:t.outdoor_effective,name:e("s.effective")}]},{title:"chart.rooms",series:[{entity:t.room_temperature,name:e("s.house")},{entity:t.setpoint,name:e("s.house_target")},...a.rooms.map(o=>({entity:o.entities.filtered,name:o.name}))]},{title:"chart.correction",series:[{entity:t.room_correction,name:e("s.correction")},{entity:t.proportional,name:"P"},{entity:t.integral,name:"I"}]},{title:"chart.weather",series:[{entity:t.forecast_effect,name:e("s.forecast")},{entity:t.solar_correction,name:e("s.solar")},{entity:t.wind_correction,name:e("s.wind")}]},{title:"chart.states",timeline:!0,series:[{entity:t.demand,name:e("s.demand")},{entity:t.control,name:e("s.control")},{entity:i.flame_sensor,name:e("s.flame")},{entity:i.dhw_sensor,name:e("s.dhw")}]}]}var pe=class extends y{constructor(){super(...arguments);this.range=Be[0];this.cards=[]}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},range:{state:!0},burner:{state:!0},demand:{state:!0}}}willUpdate(t){(t.has("range")||t.has("entry"))&&(this.buildCards(),this.loadHours())}updated(t){if(t.has("hass"))for(let i of this.cards)i.hass=this.hass}async buildCards(){let t=this.range.hours>=Fe,i=pt(this.entry,this.localize).filter(s=>!(t&&s.timeline)),o=await Promise.all(i.map(s=>{let r=s.series.filter(d=>!!d.entity);return t?he({type:"statistics-graph",title:this.localize(s.title),entities:r.map(d=>({entity:d.entity,name:d.name})),period:"day",stat_types:["mean"],days_to_show:this.range.days,chart_type:"line"}):he({type:"history-graph",title:this.localize(s.title),hours_to_show:this.range.hours,entities:r.map(d=>({entity:d.entity,name:d.name}))})}));this.cards=o.filter(s=>!!s);for(let s of this.cards)s.hass=this.hass;this.requestUpdate()}async loadHours(){let t=new Date,i=new Date(t);i.setHours(0,0,0,0),i.setDate(i.getDate()-(this.range.days-1));let o=this.entry.sources.flame_sensor,s=this.entry.entities.demand,r=[s,o].filter(l=>!!l),d=await Ie(this.hass,r,i,t);this.demand=Ze(d[s]??[],i,t),this.burner=o?Ze(d[o]??[],i,t):void 0}renderBars(t,i,o){if(!i)return m;let s=this.hass.language,r=Math.max(6,...i.map(c=>c.hours)),d=100/i.length,l=i.reduce((c,u)=>c+u.hours,0),h=l/i.length,p=Math.ceil(i.length/10);return n`
      <section class="card">
        <h2>${t}</h2>
        <div class="muted small">
          ${this.localize("stats.days",{n:i.length})} · ${this.localize("stats.total",{h:$(s,l,0)})}
          · ${this.localize("stats.average",{h:$(s,h)})}
        </div>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="bars" role="img" aria-label=${t}>
          ${i.map((c,u)=>{let f=c.hours/r*46;return R`<rect x=${u*d+d*.15} y=${48-f} width=${d*.7} height=${f} rx="0.6" fill=${o}>
              <title>${c.day.toLocaleDateString(s,{weekday:"short",day:"numeric",month:"short"})}: ${$(s,c.hours)} h</title>
            </rect>`})}
        </svg>
        <div class="labels">
          ${i.map((c,u)=>n`<span>${(i.length-1-u)%p===0?c.day.toLocaleDateString(s,{day:"numeric"}):""}</span>`)}
        </div>
      </section>
    `}render(){let t=this.range.hours>=Fe;return n`
      <div class="toolbar">
        ${Be.map(i=>n`<button class="range ${i===this.range?"active":""}" @click=${()=>this.range=i}>
              ${i.label}
            </button>`)}
        <span class="muted small">${t?this.localize("history.daily"):this.localize("history.raw")}</span>
      </div>
      <div class="grid">
        ${this.entry.sources.flame_sensor?this.renderBars(this.localize("stats.burner"),this.burner,"var(--hc-heat)"):n`<section class="card muted small">${this.localize("stats.no_flame")}</section>`}
        ${this.renderBars(this.localize("stats.demand"),this.demand,"var(--primary-color)")} ${this.cards}
      </div>
    `}static{this.styles=[_,b`
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-bottom: var(--hc-gap);
      }
      .range {
        border: 1px solid var(--divider-color);
        border-radius: 999px;
        padding: 4px 14px;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        font: inherit;
      }
      .range.active {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(420px, 100%), 1fr));
        gap: var(--hc-gap);
      }
      .bars {
        width: 100%;
        height: 140px;
        margin-top: 12px;
      }
      .labels {
        display: flex;
        font-size: 0.7rem;
        color: var(--hc-muted);
      }
      .labels span {
        flex: 1;
        text-align: center;
      }
    `]}};customElements.get("heatcast-history")??customElements.define("heatcast-history",pe);var G=.5,me=class extends y{static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1}}}num(e){return k(this.hass,this.entry.entities[e])}fmt(e,t=1){return $(this.hass.language,e,t)}render(){return n`
      <div class="top">${this.renderHouse()} ${this.renderBoiler()} ${this.renderWeather()}</div>
      <section class="card rooms">
          <h2><ha-icon icon="mdi:floor-plan"></ha-icon>${this.localize("rooms")}</h2>
        <div class="room-grid">${this.entry.rooms.map(e=>this.renderRoom(e))}</div>
      </section>
    `}renderHouse(){let e=this.localize,t=this.entry.entities.thermostat,i=this.hass.states[t],o=i?.attributes.current_temperature,s=i?.attributes.temperature,r=i?.state==="heat",d=w(this.hass,this.entry.entities.control),l=w(this.hass,this.entry.entities.demand),h=w(this.hass,this.entry.sources.flame_sensor),p=w(this.hass,this.entry.sources.dhw_sensor),c=this.entry.entities.room_sync;return n`
      <section class="card house">
        <div class="house-head">
          <h2><ha-icon icon="mdi:home-thermometer"></ha-icon>${e("house")}</h2>
          <button
            class="power ${r?"on":""}"
            title=${e(r?"heating":"heating_off")}
            @click=${()=>this.setHvacMode(t,r?"off":"heat")}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>
        <div class="dial">
          <div class="current">
            <span class="big">${this.fmt(o)}</span><span class="unit">°C</span>
            <div class="muted small">${e("inside")}</div>
          </div>
          <div class="setpoint">
            <button class="round" ?disabled=${!r} @click=${()=>this.setTarget(t,s,-G)}>−</button>
            <div>
              <div class="target ${r?"":"muted"}">${this.fmt(s)} °C</div>
              <div class="muted small">${e(r?"target":"heating_off")}</div>
            </div>
            <button class="round" ?disabled=${!r} @click=${()=>this.setTarget(t,s,G)}>+</button>
          </div>
        </div>
        <div class="chips">
          <span class="chip ${d?"ok":""}">
            <ha-icon icon=${d?"mdi:water-boiler":"mdi:water-boiler-off"}></ha-icon>${e(d?"control_on":"control_off")}
          </span>
          <span class="chip ${l?"heat":""}">${e(l?"demand":"no_demand")}</span>
          ${h?n`<span class="chip heat"><ha-icon class="flame" icon="mdi:fire"></ha-icon>${e("flame")}</span>`:m}
          ${p?n`<span class="chip cold"><ha-icon icon="mdi:water-pump"></ha-icon>${e("dhw")}</span>`:m}
        </div>
        ${c?this.renderSync(c):m}
      </section>
    `}renderSync(e){let t=w(this.hass,e);return n`
      <div class="sync">
        <button class="sync-button ${t?"on":""}" @click=${()=>this.toggle(e,t)}>SYNC</button>
        <span class="muted small">${t?this.localize("sync_hint"):this.localize("individual_hint")}</span>
      </div>
    `}renderBoiler(){let e=this.localize,t=this.num("flow_setpoint"),i=k(this.hass,this.entry.sources.flow_sensor??void 0);return n`
      <section class="card boiler">
        <h2><ha-icon icon="mdi:water-boiler"></ha-icon>${e("boiler")}</h2>
        <div class="flow">
          <div>
            <span class="big">${this.fmt(t,0)}</span><span class="unit">°C</span>
            <div class="muted small">${e("flow_setpoint")}</div>
          </div>
          ${i!==void 0?n`<div class="measured">
                <span class="mid">${this.fmt(i)} °C</span>
                <div class="muted small">${e("flow_measured")}</div>
              </div>`:m}
        </div>
        <h3 class="muted small">${e("why_flow")}</h3>
        ${this.renderBreakdown()}
      </section>
    `}renderBreakdown(){let e=this.localize,t=this.hass.language,i=w(this.hass,this.entry.entities.demand),o=this.num("outdoor_damped"),s=this.num("outdoor_effective"),r=this.num("curve_flow"),d=this.num("proportional"),l=this.num("integral"),h=this.num("flow_min"),p=this.num("flow_max"),c=this.num("flow_setpoint"),u=(U,z)=>z===void 0?m:n`<div class="row">
            <span>${U}</span>
            <span class="bar"><span class=${z>=0?"pos":"neg"} style="width:${Math.min(Math.abs(z)*16,100)}%"></span></span>
            <span class="value">${de(t,z)} K</span>
          </div>`,f=r!==void 0?r+(d??0)+(l??0):void 0,v=m;return f!==void 0&&h!==void 0&&f<h&&(v=n`<div class="row note"><span>${e("limited_min")}</span><span></span><span class="value">${this.fmt(h,0)} °C</span></div>`),f!==void 0&&p!==void 0&&f>p&&(v=n`<div class="row note"><span>${e("limited_max")}</span><span></span><span class="value">${this.fmt(p,0)} °C</span></div>`),n`
      <div class="breakdown">
        <div class="row"><span>${e("outdoor_damped")}</span><span></span><span class="value">${this.fmt(o)} °C</span></div>
        ${u(e("forecast_effect"),this.num("forecast_effect"))} ${u(e("solar"),this.num("solar_correction"))}
        ${u(e("wind"),(this.num("wind_correction")??0)===0?void 0:-(this.num("wind_correction")??0))}
        <div class="row total"><span>${e("outdoor_effective")}</span><span></span><span class="value">${this.fmt(s)} °C</span></div>
        <div class="row">
          <span>${e("curve_at",{t:`${this.fmt(s)} \xB0C`})}</span><span></span><span class="value">${this.fmt(r)} °C</span>
        </div>
        ${u(e("p_term"),d)} ${u(e("integral"),l)} ${v}
        <div class="row total result">
          <span>${e("result")}</span><span></span><span class="value">${i?`${this.fmt(c,0)} \xB0C`:"\u2013"}</span>
        </div>
        ${i?m:n`<div class="muted small">${e("summer")}</div>`}
      </div>
    `}renderWeather(){let e=this.localize,t=k(this.hass,this.entry.sources.outdoor_sensor??void 0),i=w(this.hass,this.entry.entities.forecast_valid),o=this.num("forecast_horizon_h"),s=this.num("forecast_delta");return n`
      <section class="card weather">
        <h2><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${e("weather")}</h2>
        <div class="tiles">
          <div><span class="mid">${this.fmt(t)} °C</span><div class="muted small">${e("outdoor_now")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_damped"))} °C</span><div class="muted small">${e("outdoor_damped")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_effective"))} °C</span><div class="muted small">${e("outdoor_effective")}</div></div>
        </div>
        ${this.entry.sources.weather?n`<div class="forecast">
              <span class="chip ${i?"":"heat"}">${i?`${e("forecast")} \xB7 ${e("next_hours",{h:o??4})}`:e("forecast_stale")}</span>
            </div>
            <div class="forecast-grid">
              <div><ha-icon icon="mdi:thermometer"></ha-icon><span>${e("forecast_change")}</span><b>${s===void 0?"\u2013":de(this.hass.language,s)} K</b></div>
              <div><ha-icon icon="mdi:cloud-outline"></ha-icon><span>${e("cloud")}</span><b>${this.fmt(this.num("forecast_cloud"),0)} %</b></div>
              <div><ha-icon icon="mdi:weather-windy"></ha-icon><span>${e("wind")}</span><b>${this.fmt(this.num("forecast_wind"),0)} km/h</b></div>
              <div><ha-icon icon="mdi:white-balance-sunny"></ha-icon><span>${e("daylight")}</span><b>${this.fmt(this.num("forecast_daylight"),0)} %</b></div>
            </div>`:m}
      </section>
    `}renderRoom(e){let t=this.localize,i=k(this.hass,e.sensor),o=k(this.hass,e.entities.filtered),s=k(this.hass,e.entities.target),r=k(this.hass,e.entities.weight),d=e.entities.thermostat,l=s!==void 0&&o!==void 0?o-s:void 0,h=l!==void 0&&Math.abs(l)<.3,p=t("sensor_missing"),c="";if(l!==void 0&&(p=t("on_target"),c="ok"),l!==void 0&&!h){let f=this.fmt(Math.abs(l));p=l<0?t("too_cold",{d:f}):t("too_warm",{d:f}),c=l<0?"cold":"heat"}let u=l===void 0?50:50+Math.max(Math.min(l,2),-2)*25;return n`
      <div class="room ${r===0?"ignored":""}">
        <div class="room-head">
          <span class="room-name">${e.name}</span>
          <span class="chip small" title=${t("weight")}>${this.fmt(r,2)}</span>
        </div>
        <div class="room-temp"><span class="mid">${this.fmt(i)}</span> °C</div>
        <div class="scale"><span class="marker ${c}" style="left:${u}%"></span></div>
        <div class="room-foot">
          <span class="small ${c?`tone-${c}`:"muted"}">${p}</span>
          ${d?n`<span class="room-target">
                <button class="round mini" @click=${()=>this.setTarget(d,s,-G)}>−</button>
                <span>${this.fmt(s)}</span>
                <button class="round mini" @click=${()=>this.setTarget(d,s,G)}>+</button>
              </span>`:n`<span class="small muted">${t("target")} ${this.fmt(s)} °C</span>`}
        </div>
      </div>
    `}setTarget(e,t,i){t!==void 0&&this.hass.callService("climate","set_temperature",{entity_id:e,temperature:t+i})}setHvacMode(e,t){this.hass.callService("climate","set_hvac_mode",{entity_id:e,hvac_mode:t})}toggle(e,t){this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:e})}static{this.styles=[_,b`
      .top {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--hc-gap);
        margin-bottom: var(--hc-gap);
      }
      @media (max-width: 1100px) {
        .top {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .top .weather {
          grid-column: 1 / -1;
        }
      }
      @media (max-width: 700px) {
        .top {
          grid-template-columns: 1fr;
        }
      }
      .house {
        display: flex;
        flex-direction: column;
      }
      .house .dial {
        flex: 1;
      }
      .forecast-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px 16px;
        margin-top: 12px;
        font-size: 0.9rem;
      }
      .forecast-grid div {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .forecast-grid span {
        flex: 1;
        color: var(--hc-muted);
      }
      .big {
        font-size: 3rem;
        font-weight: 300;
        line-height: 1;
      }
      .mid {
        font-size: 1.4rem;
        font-weight: 400;
      }
      .unit {
        font-size: 1.2rem;
        margin-left: 2px;
        color: var(--hc-muted);
      }
      .house-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .power {
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        background: var(--secondary-background-color);
        color: var(--hc-muted);
      }
      .power.on {
        background: color-mix(in srgb, var(--hc-heat) 20%, transparent);
        color: var(--hc-heat);
      }
      .dial {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin: 8px 0 16px;
      }
      .setpoint {
        display: flex;
        align-items: center;
        gap: 12px;
        text-align: center;
      }
      .target {
        font-size: 1.6rem;
        color: var(--hc-heat);
      }
      .chips,
      .forecast {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .flame {
        animation: flicker 1.6s ease-in-out infinite;
      }
      @keyframes flicker {
        50% {
          opacity: 0.55;
        }
      }
      .sync {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
      }
      .sync-button {
        font-weight: 600;
        letter-spacing: 0.08em;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        background: transparent;
        color: var(--hc-muted);
        cursor: pointer;
      }
      .sync-button.on {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 15%, transparent);
        color: var(--primary-color);
      }
      .flow {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 12px;
      }
      .measured {
        text-align: right;
      }
      h3 {
        margin: 12px 0 6px;
        font-weight: 500;
      }
      .breakdown .row {
        display: grid;
        grid-template-columns: 1fr 80px 72px;
        align-items: center;
        gap: 8px;
        padding: 3px 0;
        font-size: 0.9rem;
      }
      .breakdown .value {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .breakdown .total {
        border-top: 1px solid var(--divider-color);
        margin-top: 2px;
        padding-top: 6px;
        font-weight: 500;
      }
      .breakdown .result .value {
        color: var(--hc-heat);
      }
      .breakdown .note {
        color: var(--hc-muted);
        font-style: italic;
      }
      .bar {
        height: 6px;
        border-radius: 3px;
        background: var(--secondary-background-color);
        overflow: hidden;
      }
      .bar span {
        display: block;
        height: 100%;
      }
      .bar .pos {
        background: var(--hc-heat);
      }
      .bar .neg {
        background: var(--hc-cold);
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 12px;
      }
      .room-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
        gap: 12px;
      }
      .room {
        border: 1px solid var(--divider-color);
        border-radius: calc(var(--hc-radius) - 4px);
        padding: 12px;
      }
      .room.ignored {
        opacity: 0.6;
      }
      .room-head,
      .room-foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .room-name {
        font-weight: 500;
      }
      .room-foot > span {
        white-space: nowrap;
      }
      .room-temp {
        margin: 8px 0;
      }
      .scale {
        position: relative;
        height: 6px;
        border-radius: 3px;
        margin: 4px 0 10px;
        background: linear-gradient(90deg, var(--hc-cold), var(--hc-ok) 40%, var(--hc-ok) 60%, var(--hc-heat));
        opacity: 0.85;
      }
      .marker {
        position: absolute;
        top: -4px;
        width: 4px;
        height: 14px;
        margin-left: -2px;
        border-radius: 2px;
        background: var(--primary-text-color);
      }
      .tone-cold {
        color: var(--hc-cold);
      }
      .tone-heat {
        color: var(--hc-heat);
      }
      .tone-ok {
        color: var(--hc-ok);
      }
      .room-target {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .round.mini {
        width: 28px;
        height: 28px;
        font-size: 1rem;
      }
    `]}};customElements.get("heatcast-home")??customElements.define("heatcast-home",me);function V(a,e){let t=a.setpoint-a.outdoorMin;if(t<=0)return a.setpoint;let i=Math.max(a.setpoint-e,0)/t;return a.setpoint+(a.designTemp-a.setpoint)*i**(1/a.exponent)+a.offset}var ue=320,ge=180,x={left:30,right:10,top:10,bottom:22},fe=class extends y{constructor(){super(...arguments);this.language="en"}static{this.properties={params:{attribute:!1},outdoor:{attribute:!1},language:{}}}render(){let t=this.params;if(!t)return n``;let i=20,o=Math.min(t.outdoorMin,-20),s=Math.floor(Math.min(t.flowMin,t.setpoint)/5)*5,r=Math.ceil(Math.max(t.flowMax,t.designTemp+t.offset)/5)*5,d=ue-x.left-x.right,l=ge-x.top-x.bottom,h=g=>x.left+(i-g)/(i-o)*d,p=g=>x.top+(r-g)/(r-s)*l,c=g=>Math.max(Math.min(g,t.flowMax),t.flowMin),u=[],f=[];for(let g=i;g>=o;g-=.5)u.push(`${h(g).toFixed(1)},${p(V(t,g)).toFixed(1)}`),g<t.summerTemp&&f.push(`${h(g).toFixed(1)},${p(c(V(t,g))).toFixed(1)}`);let v=[20,10,0,-10,-20].filter(g=>g>=o),U=[];for(let g=s;g<=r;g+=5)U.push(g);let z=this.outdoor;return n`
      <svg viewBox="0 0 ${ue} ${ge}" role="img">
        ${U.map(g=>R`<line class="grid" x1=${x.left} x2=${ue-x.right} y1=${p(g)} y2=${p(g)}></line>
            <text class="tick" x=${x.left-4} y=${p(g)+3} text-anchor="end">${g}</text>`)}
        ${v.map(g=>R`<text class="tick" x=${h(g)} y=${ge-6} text-anchor="middle">${g}</text>`)}
        <rect class="summer" x=${h(i)} y=${x.top} width=${Math.max(h(t.summerTemp)-h(i),0)} height=${l}></rect>
        <polyline class="raw" points=${u.join(" ")}></polyline>
        <polyline class="curve" points=${f.join(" ")}></polyline>
        ${z===void 0?"":R`<circle class="now" cx=${h(Math.max(Math.min(z,i),o))} cy=${p(c(V(t,z)))} r="5">
              <title>${$(this.language,z)} °C → ${$(this.language,c(V(t,z)))} °C</title>
            </circle>`}
      </svg>
    `}static{this.styles=b`
    svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .grid {
      stroke: var(--divider-color, #e0e0e0);
      stroke-width: 0.5;
    }
    .tick {
      font-size: 9px;
      fill: var(--secondary-text-color);
    }
    .summer {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    }
    .raw {
      fill: none;
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.6;
    }
    .curve {
      fill: none;
      stroke: var(--state-climate-heat-color, #ff8100);
      stroke-width: 2.5;
      stroke-linejoin: round;
    }
    .now {
      fill: var(--primary-color);
      stroke: var(--card-background-color, #fff);
      stroke-width: 2;
    }
  `}};customElements.get("heatcast-curve-chart")??customElements.define("heatcast-curve-chart",fe);var mt=[["settings.temperatures",["comfort_temp","eco_offset"]],["settings.controller",["kp","ti_min","integral"]],["settings.weather",["damping_tau_h","outdoor_damped","forecast_horizon_h","forecast_weight","k_solar","k_wind","wind_ref"]],["settings.filter",["room_rate_max","sensor_hold_min"]]],Ge=["design_temp","outdoor_min","curve_exponent","curve_offset","flow_min","flow_max","summer_temp"],ye=class extends y{constructor(){super(...arguments);this.confirming=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},confirming:{state:!0}}}num(t){return k(this.hass,this.entry.entities[t])}render(){return this.hass.user?.is_admin?n`
      <div class="grid">
        ${this.renderBoiler()} ${this.renderCurve()}
        ${mt.map(([t,i])=>this.renderGroup(t,i.map(o=>this.entry.entities[o])))}
        ${this.renderGroup("settings.rooms",this.entry.rooms.map(t=>t.entities.weight),this.entry.rooms.map(t=>t.name))}
        ${this.renderFeatures()}
      </div>
      <p class="small">
        <a href="/config/integrations/integration/heatcast">${this.localize("settings.entities")}</a>
      </p>
    `:n`<section class="card muted">${this.localize("settings.admin_only")}</section>`}renderGroup(t,i,o){return n`
      <section class="card">
        <h2>${this.localize(t)}</h2>
        ${i.map((s,r)=>s?this.renderNumber(s,o?.[r]):m)}
      </section>
    `}renderNumber(t,i){let o=this.hass.states[t];if(!o)return n``;let s=Number.parseFloat(o.state),r=Number(o.attributes.step??1),d=Number(o.attributes.min??-1/0),l=Number(o.attributes.max??1/0),h=r<.01?3:r<.1?2:r<1?1:0,p=o.attributes.unit_of_measurement??"",c=u=>{let f=Math.round(Math.max(Math.min(u,l),d)/r)*r;this.hass.callService("number","set_value",{entity_id:t,value:Number(f.toFixed(4))})};return n`
      <div class="number">
        <span class="label">${i??this.shortName(o.attributes.friendly_name??t)}</span>
        <span class="stepper">
          <button class="round mini" ?disabled=${s<=d} @click=${()=>c(s-r)}>−</button>
          <input
            type="number"
            .value=${Number.isFinite(s)?s.toFixed(h):""}
            step=${r}
            min=${d}
            max=${l}
            @change=${u=>c(Number.parseFloat(u.target.value))}
          />
          <button class="round mini" ?disabled=${s>=l} @click=${()=>c(s+r)}>+</button>
          <span class="unit">${p}</span>
        </span>
      </div>
    `}shortName(t){let i=`${this.entry.title} `,o=t.startsWith(i)?t.slice(i.length):t;return o.charAt(0).toUpperCase()+o.slice(1)}renderCurve(){let t=Ge.map(s=>this.num(s)),i=this.num("setpoint"),o;if(t.every(s=>s!==void 0)&&i!==void 0){let[s,r,d,l,h,p,c]=t;o={setpoint:i,designTemp:s,outdoorMin:r,exponent:d,offset:l,flowMin:h,flowMax:p,summerTemp:c}}return n`
      <section class="card curve">
        <h2>${this.localize("settings.curve")}</h2>
        <heatcast-curve-chart
          .params=${o}
          .outdoor=${this.num("outdoor_effective")}
          language=${this.hass.language}
        ></heatcast-curve-chart>
        <p class="muted small">${this.localize("settings.curve_hint")}</p>
        ${Ge.map(s=>this.renderNumber(this.entry.entities[s]))}
      </section>
    `}renderToggle(t,i,o,s){return n`
      <div class="toggle-row">
        <div>
          <div>${this.localize(t)}</div>
          <div class="muted small">${this.localize(i)}</div>
        </div>
        <button class="toggle ${o?"on":""}" role="switch" aria-checked=${o} @click=${()=>s(!o)}>
          <span></span>
        </button>
      </div>
    `}renderBoiler(){let t=w(this.hass,this.entry.entities.control),i=w(this.hass,this.entry.entities.test_mode),o=(s,r)=>this.hass.callService("switch",r?"turn_on":"turn_off",{entity_id:s});return n`
      <section class="card">
        <h2>${this.localize("settings.boiler")}</h2>
        ${this.renderToggle("settings.control","settings.control_hint",t,s=>{if(s){this.confirming=!0;return}o(this.entry.entities.control,!1)})}
        ${this.confirming?n`<div class="confirm">
              <span>${this.localize("settings.control_confirm")}</span>
              <button class="text" @click=${()=>this.confirming=!1}>${this.localize("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${()=>{this.confirming=!1,o(this.entry.entities.control,!0)}}
              >
                ${this.localize("settings.confirm")}
              </button>
            </div>`:m}
        ${this.renderToggle("settings.test_mode","settings.test_mode_hint",i,s=>o(this.entry.entities.test_mode,s))}
        ${this.renderNumber(this.entry.entities.test_flow)}
      </section>
    `}renderFeatures(){return n`
      <section class="card">
        <h2>${this.localize("settings.features")}</h2>
        ${this.renderToggle("settings.individual","settings.individual_hint",this.entry.individual_rooms,async t=>{await Le(this.hass,this.entry.entry_id,t),Ke(this,"heatcast-entries-changed")})}
      </section>
    `}static{this.styles=[_,b`
      /* Columns instead of a grid: cards of different height leave no holes. */
      .grid {
        columns: 3 340px;
        column-gap: var(--hc-gap);
      }
      .grid > section {
        break-inside: avoid;
        margin-bottom: var(--hc-gap);
      }
      .number,
      .toggle-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 6px 0;
      }
      .label {
        flex: 1;
        min-width: 0;
      }
      .stepper {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .stepper input {
        width: 64px;
        padding: 4px 6px;
        text-align: right;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: transparent;
        color: var(--primary-text-color);
        font: inherit;
        -moz-appearance: textfield;
      }
      .stepper input::-webkit-outer-spin-button,
      .stepper input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      .unit {
        width: 56px;
        font-size: 0.8rem;
        color: var(--hc-muted);
      }
      .round.mini {
        width: 28px;
        height: 28px;
        font-size: 1rem;
      }
      .toggle {
        flex: none;
        width: 44px;
        height: 24px;
        border-radius: 12px;
        border: none;
        padding: 2px;
        cursor: pointer;
        background: var(--disabled-color, #bdbdbd);
        transition: background 0.2s;
      }
      .toggle span {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
      }
      .toggle.on {
        background: var(--primary-color);
      }
      .toggle.on span {
        transform: translateX(20px);
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 4px 0 8px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 15%, transparent);
      }
      .confirm span {
        flex: 1;
      }
      button.text {
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font: inherit;
      }
      button.text.primary {
        color: var(--primary-color);
        font-weight: 500;
      }
      a {
        color: var(--primary-color);
      }
    `]}};customElements.get("heatcast-settings")??customElements.define("heatcast-settings",ye);var ut=[{id:"home",label:"tab.home",icon:"mdi:home-thermometer-outline"},{id:"history",label:"tab.history",icon:"mdi:chart-line"},{id:"settings",label:"tab.settings",icon:"mdi:tune-variant"},{id:"guide",label:"tab.guide",icon:"mdi:book-open-variant"}],gt=1500,be=class extends y{constructor(){super(...arguments);this.narrow=!1;this.tab="home";this.loading=!1;this.localize=le("en");this.language="";this.entriesChanged=()=>{window.setTimeout(()=>this.load(),gt)}}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},entries:{state:!0},entryId:{state:!0},tab:{state:!0},error:{state:!0}}}willUpdate(t){t.has("hass")&&this.hass&&this.hass.language!==this.language&&(this.language=this.hass.language,this.localize=le(this.language)),t.has("hass")&&this.hass&&!this.entries&&!this.loading&&this.load()}async load(){this.loading=!0;try{this.entries=await Ne(this.hass),this.entries.some(i=>i.entry_id===this.entryId)||(this.entryId=this.entries[0]?.entry_id),this.error=void 0}catch(t){this.error=String(t?.message??t)}finally{this.loading=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("heatcast-entries-changed",this.entriesChanged),this.hass&&this.load()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("heatcast-entries-changed",this.entriesChanged)}render(){let t=this.entries?.find(i=>i.entry_id===this.entryId);return n`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="title">${t?.title??"HeatCast"}</div>
          ${(this.entries?.length??0)>1?n`<select @change=${i=>this.entryId=i.target.value}>
                ${this.entries.map(i=>n`<option value=${i.entry_id} ?selected=${i.entry_id===this.entryId}>${i.title}</option>`)}
              </select>`:m}
        </div>
        <nav>
          ${ut.map(i=>n`
              <button class="tab ${i.id===this.tab?"active":""}" @click=${()=>this.tab=i.id}>
                <ha-icon icon=${i.icon}></ha-icon><span>${this.localize(i.label)}</span>
              </button>
            `)}
        </nav>
      </div>
      <main>${this.renderContent(t)}</main>
    `}renderContent(t){if(this.error)return n`<div class="card">${this.error}</div>`;if(!this.entries)return n`<div class="muted">${this.localize("loading")}</div>`;if(!t)return n`<div class="card">${this.localize("no_entry")}</div>`;let i={hass:this.hass,entry:t,localize:this.localize};switch(this.tab){case"history":return n`<heatcast-history .hass=${i.hass} .entry=${t} .localize=${i.localize}></heatcast-history>`;case"guide":return n`<heatcast-guide language=${this.hass.language}></heatcast-guide>`;case"settings":return n`<heatcast-settings .hass=${i.hass} .entry=${t} .localize=${i.localize}></heatcast-settings>`;default:return n`<heatcast-home .hass=${i.hass} .entry=${t} .localize=${i.localize}></heatcast-home>`}}static{this.styles=[_,b`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        font-family: var(--paper-font-body1_-_font-family, inherit);
      }
      .header {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--app-header-background-color, var(--primary-background-color));
        color: var(--app-header-text-color, var(--primary-text-color));
        border-bottom: var(--app-header-border-bottom, 1px solid var(--divider-color));
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 56px;
        padding: 0 12px;
      }
      .title {
        flex: 1;
        font-size: 1.25rem;
      }
      select {
        background: transparent;
        color: inherit;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        padding: 4px 8px;
      }
      nav {
        display: flex;
        gap: 4px;
        padding: 0 12px;
        overflow-x: auto;
      }
      .tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: inherit;
        opacity: 0.75;
        cursor: pointer;
        font: inherit;
        white-space: nowrap;
      }
      .tab.active {
        opacity: 1;
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
      }
      main {
        padding: var(--hc-gap);
        max-width: 1400px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      @media (max-width: 600px) {
        .tab span {
          display: none;
        }
        main {
          padding: 8px;
        }
      }
    `]}};customElements.get("heatcast-panel")??customElements.define("heatcast-panel",be);
