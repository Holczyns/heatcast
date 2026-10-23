var B=globalThis,F=B.ShadowRoot&&(B.ShadyCSS===void 0||B.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),bt=new WeakMap,j=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(F&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=bt.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&bt.set(e,t))}return t}toString(){return this.cssText}},$t=r=>new j(typeof r=="string"?r:r+"",void 0,Y),y=(r,...t)=>{let e=r.length===1?r[0]:t.reduce((s,i,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[o+1],r[0]);return new j(e,r,Y)},_t=(r,t)=>{if(F)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=B.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},J=F?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return $t(e)})(r):r;var{is:Kt,defineProperty:Gt,getOwnPropertyDescriptor:Vt,getOwnPropertyNames:qt,getOwnPropertySymbols:Zt,getPrototypeOf:Yt}=Object,K=globalThis,wt=K.trustedTypes,Jt=wt?wt.emptyScript:"",Xt=K.reactiveElementPolyfillSupport,D=(r,t)=>r,X={toAttribute(r,t){switch(t){case Boolean:r=r?Jt:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},kt=(r,t)=>!Kt(r,t),xt={attribute:!0,type:String,converter:X,reflect:!1,useDefault:!1,hasChanged:kt};Symbol.metadata??=Symbol("metadata"),K.litPropertyMetadata??=new WeakMap;var z=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=xt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Gt(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:o}=Vt(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let h=i?.call(this);o?.call(this,n),this.requestUpdate(t,h,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??xt}static _$Ei(){if(this.hasOwnProperty(D("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(D("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(D("properties"))){let e=this.properties,s=[...qt(e),...Zt(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(J(i))}else t!==void 0&&e.push(J(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _t(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let o=(s.converter?.toAttribute!==void 0?s.converter:X).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let o=s.getPropertyOptions(i),n=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:X;this._$Em=i;let h=n.fromAttribute(e,o.type);this[i]=h??this._$Ej?.get(i)??h,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(t!==void 0){let n=this.constructor;if(i===!1&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??kt)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,o]of s){let{wrapped:n}=o,h=this[i];n!==!0||this._$AL.has(i)||h===void 0||this.C(i,void 0,o,h)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};z.elementStyles=[],z.shadowRootOptions={mode:"open"},z[D("elementProperties")]=new Map,z[D("finalized")]=new Map,Xt?.({ReactiveElement:z}),(K.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,zt=r=>r,G=ot.trustedTypes,At=G?G.createPolicy("lit-html",{createHTML:r=>r}):void 0,Mt="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,Pt="?"+E,Qt=`<${Pt}>`,T=document,N=()=>T.createComment(""),O=r=>r===null||typeof r!="object"&&typeof r!="function",nt=Array.isArray,te=r=>nt(r)||typeof r?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Et=/-->/g,St=/>/g,S=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ct=/'/g,Tt=/"/g,Rt=/^(?:script|style|textarea|title)$/i,at=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),d=at(1),R=at(2),ge=at(3),H=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),Ht=new WeakMap,C=T.createTreeWalker(T,129);function jt(r,t){if(!nt(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return At!==void 0?At.createHTML(t):t}var ee=(r,t)=>{let e=r.length-1,s=[],i,o=t===2?"<svg>":t===3?"<math>":"",n=L;for(let h=0;h<e;h++){let a=r[h],c,p,l=-1,f=0;for(;f<a.length&&(n.lastIndex=f,p=n.exec(a),p!==null);)f=n.lastIndex,n===L?p[1]==="!--"?n=Et:p[1]!==void 0?n=St:p[2]!==void 0?(Rt.test(p[2])&&(i=RegExp("</"+p[2],"g")),n=S):p[3]!==void 0&&(n=S):n===S?p[0]===">"?(n=i??L,l=-1):p[1]===void 0?l=-2:(l=n.lastIndex-p[2].length,c=p[1],n=p[3]===void 0?S:p[3]==='"'?Tt:Ct):n===Tt||n===Ct?n=S:n===Et||n===St?n=L:(n=S,i=void 0);let g=n===S&&r[h+1].startsWith("/>")?" ":"";o+=n===L?a+Qt:l>=0?(s.push(c),a.slice(0,l)+Mt+a.slice(l)+E+g):a+E+(l===-2?h:g)}return[jt(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},U=class r{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0,h=t.length-1,a=this.parts,[c,p]=ee(t,e);if(this.el=r.createElement(c,s),C.currentNode=this.el.content,e===2||e===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=C.nextNode())!==null&&a.length<h;){if(i.nodeType===1){if(i.hasAttributes())for(let l of i.getAttributeNames())if(l.endsWith(Mt)){let f=p[n++],g=i.getAttribute(l).split(E),$=/([.?@])?(.*)/.exec(f);a.push({type:1,index:o,name:$[2],strings:g,ctor:$[1]==="."?et:$[1]==="?"?st:$[1]==="@"?it:P}),i.removeAttribute(l)}else l.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(l));if(Rt.test(i.tagName)){let l=i.textContent.split(E),f=l.length-1;if(f>0){i.textContent=G?G.emptyScript:"";for(let g=0;g<f;g++)i.append(l[g],N()),C.nextNode(),a.push({type:2,index:++o});i.append(l[f],N())}}}else if(i.nodeType===8)if(i.data===Pt)a.push({type:2,index:o});else{let l=-1;for(;(l=i.data.indexOf(E,l+1))!==-1;)a.push({type:7,index:o}),l+=E.length-1}o++}}static createElement(t,e){let s=T.createElement("template");return s.innerHTML=t,s}};function M(r,t,e=r,s){if(t===H)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,o=O(t)?void 0:t._$litDirective$;return i?.constructor!==o&&(i?._$AO?.(!1),o===void 0?i=void 0:(i=new o(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=M(r,i._$AS(r,t.values),i,s)),t}var tt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??T).importNode(e,!0);C.currentNode=i;let o=C.nextNode(),n=0,h=0,a=s[0];for(;a!==void 0;){if(n===a.index){let c;a.type===2?c=new I(o,o.nextSibling,this,t):a.type===1?c=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(c=new rt(o,this,t)),this._$AV.push(c),a=s[++h]}n!==a?.index&&(o=C.nextNode(),n++)}return C.currentNode=T,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},I=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=M(this,t,e),O(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==H&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):te(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==m&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=U.createElement(jt(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let o=new tt(i,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=Ht.get(t.strings);return e===void 0&&Ht.set(t.strings,e=new U(t)),e}k(t){nt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let o of t)i===e.length?e.push(s=new r(this.O(N()),this.O(N()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=zt(t).nextSibling;zt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},P=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=m}_$AI(t,e=this,s,i){let o=this.strings,n=!1;if(o===void 0)t=M(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==H,n&&(this._$AH=t);else{let h=t,a,c;for(t=o[0],a=0;a<o.length-1;a++)c=M(this,h[s+a],e,a),c===H&&(c=this._$AH[a]),n||=!O(c)||c!==this._$AH[a],c===m?t=m:t!==m&&(t+=(c??"")+o[a+1]),this._$AH[a]=c}n&&!i&&this.j(t)}j(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},et=class extends P{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===m?void 0:t}},st=class extends P{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},it=class extends P{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=M(this,t,e,0)??m)===H)return;let s=this._$AH,i=t===m&&s!==m||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==m&&(s===m||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t)}};var se=ot.litHtmlPolyfillSupport;se?.(U,I),(ot.litHtmlVersions??=[]).push("3.3.3");var Dt=(r,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let o=e?.renderBefore??null;s._$litPart$=i=new I(t.insertBefore(N(),o),o,void 0,e??{})}return i._$AI(r),i};var lt=globalThis,v=class extends z{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Dt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};v._$litElement$=!0,v.finalized=!0,lt.litElementHydrateSupport?.({LitElement:v});var ie=lt.litElementPolyfillSupport;ie?.({LitElement:v});(lt.litElementVersions??=[]).push("4.2.2");function Lt(r){return r.callWS({type:"heatcast/entries"})}function Nt(r,t,e){return r.callWS({type:"heatcast/set_options",entry_id:t,individual_rooms:e})}async function Ot(r,t,e,s){return r.callWS({type:"history/history_during_period",start_time:e.toISOString(),end_time:s.toISOString(),entity_ids:t,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}var Ut={"tab.home":"Home","tab.charts":"Charts","tab.stats":"Statistics","tab.settings":"Settings",loading:"Loading\u2026",no_entry:"HeatCast is not set up yet. Add it under Settings \u2192 Devices & services.",house:"House",inside:"Inside",target:"Target",heating:"Heating",heating_off:"Off",control_on:"HeatCast controls the boiler",control_off:"Shadow mode \u2013 nothing is sent to the boiler",demand:"Heating demand",no_demand:"No heating demand",flame:"Burner on",dhw:"Hot water",sync:"Sync",sync_hint:"All rooms follow the house",individual_hint:"Each room keeps its own temperature",boiler:"Boiler",flow_setpoint:"Flow setpoint",flow_measured:"Measured",why_flow:"Where the flow temperature comes from",outdoor_damped:"Damped outdoor",forecast_effect:"Forecast",solar:"Sun",wind:"Wind",outdoor_effective:"Effective outdoor",curve_at:"Curve at {t}",p_term:"Room correction (P)",integral:"Integral (I)",limited_min:"Raised to minimum",limited_max:"Lowered to maximum",result:"Flow setpoint",summer:"Above the summer threshold \u2013 no heating",weather:"Weather",outdoor_now:"Outdoor now",forecast:"Forecast",forecast_stale:"Forecast out of date",next_hours:"next {h} h",cloud:"Clouds",daylight:"Daylight",rooms:"Rooms",filtered:"Filtered",weight:"Weight",too_cold:"{d} K below target",too_warm:"{d} K above target",on_target:"On target",sensor_missing:"No reading",range:"Range","chart.flow":"Flow temperature","chart.outdoor":"Outdoor temperature","chart.rooms":"Rooms","chart.correction":"Room correction","chart.weather":"Weather effects","chart.states":"States","stats.burner":"Burner hours per day","stats.demand":"Hours with heating demand","stats.flow":"Flow setpoint, daily","stats.outdoor":"Effective outdoor temperature, daily","stats.house":"House temperature, daily","stats.no_flame":"Burner hours need a burner sensor in the boiler settings.","stats.days":"Last {n} days","stats.total":"Total {h} h","settings.temperatures":"Temperatures","settings.curve":"Heating curve","settings.curve_hint":"Flow temperature over outdoor temperature at the current house setpoint. The dot is where the controller is now.","settings.controller":"Room controller","settings.weather":"Weather and forecast","settings.filter":"Room sensor filter","settings.rooms":"Room weights","settings.features":"Features","settings.individual":"Individual room temperatures","settings.individual_hint":"Adds a thermostat to every room and the sync switch. With one heating circuit and no radiator valves the rooms share one compromise.","settings.boiler":"Boiler","settings.control":"Boiler control","settings.control_hint":"While off, HeatCast only calculates. Turn off any other automation writing the boiler first.","settings.control_confirm":"Send the flow setpoint to the boiler from now on?","settings.confirm":"Turn on","settings.cancel":"Cancel","settings.test_mode":"Boiler test mode","settings.test_mode_hint":"Sends the test flow temperature for up to an hour, regardless of the model.","settings.entities":"Entities and devices","settings.admin_only":"Only administrators can change settings."},re={"tab.home":"Dom","tab.charts":"Wykresy","tab.stats":"Statystyki","tab.settings":"Ustawienia",loading:"Wczytywanie\u2026",no_entry:"HeatCast nie jest jeszcze skonfigurowany. Dodaj go w Ustawienia \u2192 Urz\u0105dzenia i us\u0142ugi.",house:"Dom",inside:"W domu",target:"Nastawa",heating:"Grzanie",heating_off:"Wy\u0142\u0105czone",control_on:"HeatCast steruje kot\u0142em",control_off:"Tryb cienia \u2013 nic nie jest wysy\u0142ane do kot\u0142a",demand:"Zapotrzebowanie na grzanie",no_demand:"Brak zapotrzebowania",flame:"Palnik pracuje",dhw:"C.w.u.",sync:"Sync",sync_hint:"Wszystkie pokoje jak dom",individual_hint:"Ka\u017Cdy pok\xF3j ma w\u0142asn\u0105 temperatur\u0119",boiler:"Kocio\u0142",flow_setpoint:"Zadana zasilania",flow_measured:"Zmierzona",why_flow:"Sk\u0105d si\u0119 bierze temperatura zasilania",outdoor_damped:"Zewn\u0119trzna t\u0142umiona",forecast_effect:"Prognoza",solar:"S\u0142o\u0144ce",wind:"Wiatr",outdoor_effective:"Efektywna zewn\u0119trzna",curve_at:"Krzywa przy {t}",p_term:"Korekta pokoi (P)",integral:"Ca\u0142ka (I)",limited_min:"Podniesione do minimum",limited_max:"Obni\u017Cone do maksimum",result:"Zadana zasilania",summer:"Powy\u017Cej progu lato/zima \u2013 bez grzania",weather:"Pogoda",outdoor_now:"Na zewn\u0105trz teraz",forecast:"Prognoza",forecast_stale:"Prognoza nieaktualna",next_hours:"najbli\u017Csze {h} h",cloud:"Zachmurzenie",daylight:"Dzie\u0144",rooms:"Pokoje",filtered:"Po filtrze",weight:"Waga",too_cold:"{d} K poni\u017Cej nastawy",too_warm:"{d} K powy\u017Cej nastawy",on_target:"Na nastawie",sensor_missing:"Brak odczytu",range:"Zakres","chart.flow":"Temperatura zasilania","chart.outdoor":"Temperatura zewn\u0119trzna","chart.rooms":"Pokoje","chart.correction":"Korekta pokojowa","chart.weather":"Wp\u0142yw pogody","chart.states":"Stany","stats.burner":"Godziny pracy palnika na dob\u0119","stats.demand":"Godziny z zapotrzebowaniem","stats.flow":"Zadana zasilania, dobowo","stats.outdoor":"Efektywna temperatura zewn\u0119trzna, dobowo","stats.house":"Temperatura domu, dobowo","stats.no_flame":"Godziny pracy palnika wymagaj\u0105 czujnika palnika w ustawieniach kot\u0142a.","stats.days":"Ostatnie {n} dni","stats.total":"Razem {h} h","settings.temperatures":"Temperatury","settings.curve":"Krzywa grzewcza","settings.curve_hint":"Temperatura zasilania w funkcji temperatury zewn\u0119trznej przy bie\u017C\u0105cej nastawie domu. Kropka pokazuje, gdzie regulator jest teraz.","settings.controller":"Regulator pokojowy","settings.weather":"Pogoda i prognoza","settings.filter":"Filtr czujnik\xF3w pokojowych","settings.rooms":"Wagi pokoi","settings.features":"Funkcje","settings.individual":"Indywidualne temperatury pokoi","settings.individual_hint":"Dodaje termostat ka\u017Cdemu pokojowi i prze\u0142\u0105cznik Sync. Przy jednym obiegu bez g\u0142owic na grzejnikach pokoje dziel\u0105 jeden kompromis.","settings.boiler":"Kocio\u0142","settings.control":"Sterowanie kot\u0142em","settings.control_hint":"Wy\u0142\u0105czone: HeatCast tylko liczy. Najpierw wy\u0142\u0105cz inne automatyzacje zapisuj\u0105ce do kot\u0142a.","settings.control_confirm":"Od teraz wysy\u0142a\u0107 zadan\u0105 zasilania do kot\u0142a?","settings.confirm":"W\u0142\u0105cz","settings.cancel":"Anuluj","settings.test_mode":"Tryb testowy kot\u0142a","settings.test_mode_hint":"Wysy\u0142a testow\u0105 temperatur\u0119 zasilania przez maks. godzin\u0119, niezale\u017Cnie od modelu.","settings.entities":"Encje i urz\u0105dzenia","settings.admin_only":"Ustawienia mo\u017Ce zmienia\u0107 tylko administrator."};function ct(r){let t=r.startsWith("pl")?{...Ut,...re}:Ut;return(e,s)=>{let i=t[e]??e;for(let[o,n]of Object.entries(s??{}))i=i.replace(`{${o}}`,String(n));return i}}function A(r,t,e=1){return t===void 0?"\u2013":t.toLocaleString(r,{minimumFractionDigits:e,maximumFractionDigits:e})}function dt(r,t,e=1){let s=A(r,Math.abs(t),e);return Math.abs(t)<.5*10**-e?s:t>0?`+${s}`:`\u2212${s}`}var w=y`
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
`;var It;async function V(r){if(window.loadCardHelpers)return It??=window.loadCardHelpers(),(await It).createCardElement(r)}function x(r,t){if(!t)return;let e=Number.parseFloat(r.states[t]?.state??"");return Number.isFinite(e)?e:void 0}function b(r,t){return!!t&&r.states[t]?.state==="on"}function Wt(r,t,e){r.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}var oe=[24,168,720];function ne(r){let t=r.entities;return[{title:"chart.flow",entities:[t.flow_setpoint,r.sources.flow_sensor,t.curve_flow]},{title:"chart.outdoor",entities:[r.sources.outdoor_sensor,t.outdoor_damped,t.outdoor_effective]},{title:"chart.rooms",entities:[t.room_temperature,t.setpoint,...r.rooms.map(e=>e.entities.filtered)]},{title:"chart.correction",entities:[t.room_correction,t.proportional,t.integral]},{title:"chart.weather",entities:[t.forecast_effect,t.solar_correction,t.wind_correction]},{title:"chart.states",entities:[t.demand,t.control,r.sources.flame_sensor,r.sources.dhw_sensor]}]}var ht=class extends v{constructor(){super(...arguments);this.hours=24;this.cards=[]}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},hours:{state:!0}}}willUpdate(e){(e.has("hours")||e.has("entry"))&&this.buildCards()}updated(e){if(e.has("hass"))for(let s of this.cards)s.hass=this.hass}async buildCards(){let e=await Promise.all(ne(this.entry).map(s=>V({type:"history-graph",title:this.localize(s.title),hours_to_show:this.hours,entities:s.entities.filter(i=>!!i)})));this.cards=e.filter(s=>!!s);for(let s of this.cards)s.hass=this.hass;this.requestUpdate()}render(){return d`
      <div class="toolbar">
        <span class="muted small">${this.localize("range")}</span>
        ${oe.map(e=>d`<button class="range ${e===this.hours?"active":""}" @click=${()=>this.hours=e}>
              ${e<48?`${e} h`:`${e/24} d`}
            </button>`)}
      </div>
      <div class="grid">${this.cards}</div>
    `}static{this.styles=[w,y`
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: var(--hc-gap);
      }
      .range {
        border: 1px solid var(--divider-color);
        border-radius: 999px;
        padding: 4px 12px;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .range.active {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
        gap: var(--hc-gap);
      }
      @media (max-width: 600px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `]}};customElements.get("heatcast-charts")??customElements.define("heatcast-charts",ht);var q=.5,pt=class extends v{static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1}}}num(t){return x(this.hass,this.entry.entities[t])}fmt(t,e=1){return A(this.hass.language,t,e)}render(){return d`
      <div class="grid">
        ${this.renderHouse()} ${this.renderBoiler()} ${this.renderWeather()}
        <section class="card rooms">
          <h2><ha-icon icon="mdi:floor-plan"></ha-icon>${this.localize("rooms")}</h2>
          <div class="room-grid">${this.entry.rooms.map(t=>this.renderRoom(t))}</div>
        </section>
      </div>
    `}renderHouse(){let t=this.localize,e=this.entry.entities.thermostat,s=this.hass.states[e],i=s?.attributes.current_temperature,o=s?.attributes.temperature,n=s?.state==="heat",h=b(this.hass,this.entry.entities.control),a=b(this.hass,this.entry.entities.demand),c=b(this.hass,this.entry.sources.flame_sensor),p=b(this.hass,this.entry.sources.dhw_sensor),l=this.entry.entities.room_sync;return d`
      <section class="card house">
        <div class="house-head">
          <h2><ha-icon icon="mdi:home-thermometer"></ha-icon>${t("house")}</h2>
          <button
            class="power ${n?"on":""}"
            title=${t(n?"heating":"heating_off")}
            @click=${()=>this.setHvacMode(e,n?"off":"heat")}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>
        <div class="dial">
          <div class="current">
            <span class="big">${this.fmt(i)}</span><span class="unit">°C</span>
            <div class="muted small">${t("inside")}</div>
          </div>
          <div class="setpoint">
            <button class="round" ?disabled=${!n} @click=${()=>this.setTarget(e,o,-q)}>−</button>
            <div>
              <div class="target ${n?"":"muted"}">${this.fmt(o)} °C</div>
              <div class="muted small">${t(n?"target":"heating_off")}</div>
            </div>
            <button class="round" ?disabled=${!n} @click=${()=>this.setTarget(e,o,q)}>+</button>
          </div>
        </div>
        <div class="chips">
          <span class="chip ${h?"ok":""}">
            <ha-icon icon=${h?"mdi:water-boiler":"mdi:water-boiler-off"}></ha-icon>${t(h?"control_on":"control_off")}
          </span>
          <span class="chip ${a?"heat":""}">${t(a?"demand":"no_demand")}</span>
          ${c?d`<span class="chip heat"><ha-icon class="flame" icon="mdi:fire"></ha-icon>${t("flame")}</span>`:m}
          ${p?d`<span class="chip cold"><ha-icon icon="mdi:water-pump"></ha-icon>${t("dhw")}</span>`:m}
        </div>
        ${l?this.renderSync(l):m}
      </section>
    `}renderSync(t){let e=b(this.hass,t);return d`
      <div class="sync">
        <button class="sync-button ${e?"on":""}" @click=${()=>this.toggle(t,e)}>SYNC</button>
        <span class="muted small">${e?this.localize("sync_hint"):this.localize("individual_hint")}</span>
      </div>
    `}renderBoiler(){let t=this.localize,e=this.num("flow_setpoint"),s=x(this.hass,this.entry.sources.flow_sensor??void 0);return d`
      <section class="card boiler">
        <h2><ha-icon icon="mdi:water-boiler"></ha-icon>${t("boiler")}</h2>
        <div class="flow">
          <div>
            <span class="big">${this.fmt(e,0)}</span><span class="unit">°C</span>
            <div class="muted small">${t("flow_setpoint")}</div>
          </div>
          ${s!==void 0?d`<div class="measured">
                <span class="mid">${this.fmt(s)} °C</span>
                <div class="muted small">${t("flow_measured")}</div>
              </div>`:m}
        </div>
        <h3 class="muted small">${t("why_flow")}</h3>
        ${this.renderBreakdown()}
      </section>
    `}renderBreakdown(){let t=this.localize,e=this.hass.language,s=b(this.hass,this.entry.entities.demand),i=this.num("outdoor_damped"),o=this.num("outdoor_effective"),n=this.num("curve_flow"),h=this.num("proportional"),a=this.num("integral"),c=this.num("flow_min"),p=this.num("flow_max"),l=this.num("flow_setpoint"),f=(W,_)=>_===void 0?m:d`<div class="row">
            <span>${W}</span>
            <span class="bar"><span class=${_>=0?"pos":"neg"} style="width:${Math.min(Math.abs(_)*16,100)}%"></span></span>
            <span class="value">${dt(e,_)} K</span>
          </div>`,g=n!==void 0?n+(h??0)+(a??0):void 0,$=m;return g!==void 0&&c!==void 0&&g<c&&($=d`<div class="row note"><span>${t("limited_min")}</span><span></span><span class="value">${this.fmt(c,0)} °C</span></div>`),g!==void 0&&p!==void 0&&g>p&&($=d`<div class="row note"><span>${t("limited_max")}</span><span></span><span class="value">${this.fmt(p,0)} °C</span></div>`),d`
      <div class="breakdown">
        <div class="row"><span>${t("outdoor_damped")}</span><span></span><span class="value">${this.fmt(i)} °C</span></div>
        ${f(t("forecast_effect"),this.num("forecast_effect"))} ${f(t("solar"),this.num("solar_correction"))}
        ${f(t("wind"),(this.num("wind_correction")??0)===0?void 0:-(this.num("wind_correction")??0))}
        <div class="row total"><span>${t("outdoor_effective")}</span><span></span><span class="value">${this.fmt(o)} °C</span></div>
        <div class="row">
          <span>${t("curve_at",{t:`${this.fmt(o)} \xB0C`})}</span><span></span><span class="value">${this.fmt(n)} °C</span>
        </div>
        ${f(t("p_term"),h)} ${f(t("integral"),a)} ${$}
        <div class="row total result">
          <span>${t("result")}</span><span></span><span class="value">${s?`${this.fmt(l,0)} \xB0C`:"\u2013"}</span>
        </div>
        ${s?m:d`<div class="muted small">${t("summer")}</div>`}
      </div>
    `}renderWeather(){let t=this.localize,e=x(this.hass,this.entry.sources.outdoor_sensor??void 0),s=b(this.hass,this.entry.entities.forecast_valid),i=this.num("forecast_horizon_h"),o=this.num("forecast_delta");return d`
      <section class="card weather">
        <h2><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${t("weather")}</h2>
        <div class="tiles">
          <div><span class="mid">${this.fmt(e)} °C</span><div class="muted small">${t("outdoor_now")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_damped"))} °C</span><div class="muted small">${t("outdoor_damped")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_effective"))} °C</span><div class="muted small">${t("outdoor_effective")}</div></div>
        </div>
        ${this.entry.sources.weather?d`<div class="forecast">
              <span class="chip ${s?"":"heat"}">${s?`${t("forecast")} \xB7 ${t("next_hours",{h:i??4})}`:t("forecast_stale")}</span>
              <span class="chip"><ha-icon icon="mdi:thermometer"></ha-icon>${o===void 0?"\u2013":dt(this.hass.language,o)} K</span>
              <span class="chip"><ha-icon icon="mdi:cloud"></ha-icon>${this.fmt(this.num("forecast_cloud"),0)} %</span>
              <span class="chip"><ha-icon icon="mdi:weather-windy"></ha-icon>${this.fmt(this.num("forecast_wind"),0)} km/h</span>
              <span class="chip"><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${this.fmt(this.num("forecast_daylight"),0)} %</span>
            </div>`:m}
      </section>
    `}renderRoom(t){let e=this.localize,s=x(this.hass,t.sensor),i=x(this.hass,t.entities.filtered),o=x(this.hass,t.entities.target),n=x(this.hass,t.entities.weight),h=t.entities.thermostat,a=o!==void 0&&i!==void 0?i-o:void 0,c=a!==void 0&&Math.abs(a)<.3,p=e("sensor_missing"),l="";if(a!==void 0&&(p=e("on_target"),l="ok"),a!==void 0&&!c){let g=this.fmt(Math.abs(a));p=a<0?e("too_cold",{d:g}):e("too_warm",{d:g}),l=a<0?"cold":"heat"}let f=a===void 0?50:50+Math.max(Math.min(a,2),-2)*25;return d`
      <div class="room ${n===0?"ignored":""}">
        <div class="room-head">
          <span class="room-name">${t.name}</span>
          <span class="chip small" title=${e("weight")}>${this.fmt(n,2)}</span>
        </div>
        <div class="room-temp"><span class="mid">${this.fmt(s)}</span> °C</div>
        <div class="scale"><span class="marker ${l}" style="left:${f}%"></span></div>
        <div class="room-foot">
          <span class="small ${l?`tone-${l}`:"muted"}">${p}</span>
          ${h?d`<span class="room-target">
                <button class="round mini" @click=${()=>this.setTarget(h,o,-q)}>−</button>
                <span>${this.fmt(o)}</span>
                <button class="round mini" @click=${()=>this.setTarget(h,o,q)}>+</button>
              </span>`:d`<span class="small muted">${e("target")} ${this.fmt(o)} °C</span>`}
        </div>
      </div>
    `}setTarget(t,e,s){e!==void 0&&this.hass.callService("climate","set_temperature",{entity_id:t,temperature:e+s})}setHvacMode(t,e){this.hass.callService("climate","set_hvac_mode",{entity_id:t,hvac_mode:e})}toggle(t,e){this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}static{this.styles=[w,y`
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--hc-gap);
      }
      .rooms {
        grid-column: 1 / -1;
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
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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
    `]}};customElements.get("heatcast-home")??customElements.define("heatcast-home",pt);function Z(r,t){let e=r.setpoint-r.outdoorMin;if(e<=0)return r.setpoint;let s=Math.max(r.setpoint-t,0)/e;return r.setpoint+(r.designTemp-r.setpoint)*s**(1/r.exponent)+r.offset}var mt=320,ut=180,k={left:30,right:10,top:10,bottom:22},ft=class extends v{constructor(){super(...arguments);this.language="en"}static{this.properties={params:{attribute:!1},outdoor:{attribute:!1},language:{}}}render(){let e=this.params;if(!e)return d``;let s=20,i=Math.min(e.outdoorMin,-20),o=Math.floor(Math.min(e.flowMin,e.setpoint)/5)*5,n=Math.ceil(Math.max(e.flowMax,e.designTemp+e.offset)/5)*5,h=mt-k.left-k.right,a=ut-k.top-k.bottom,c=u=>k.left+(s-u)/(s-i)*h,p=u=>k.top+(n-u)/(n-o)*a,l=u=>Math.max(Math.min(u,e.flowMax),e.flowMin),f=[],g=[];for(let u=s;u>=i;u-=.5)f.push(`${c(u).toFixed(1)},${p(Z(e,u)).toFixed(1)}`),u<e.summerTemp&&g.push(`${c(u).toFixed(1)},${p(l(Z(e,u))).toFixed(1)}`);let $=[20,10,0,-10,-20].filter(u=>u>=i),W=[];for(let u=o;u<=n;u+=5)W.push(u);let _=this.outdoor;return d`
      <svg viewBox="0 0 ${mt} ${ut}" role="img">
        ${W.map(u=>R`<line class="grid" x1=${k.left} x2=${mt-k.right} y1=${p(u)} y2=${p(u)}></line>
            <text class="tick" x=${k.left-4} y=${p(u)+3} text-anchor="end">${u}</text>`)}
        ${$.map(u=>R`<text class="tick" x=${c(u)} y=${ut-6} text-anchor="middle">${u}</text>`)}
        <rect class="summer" x=${c(s)} y=${k.top} width=${Math.max(c(e.summerTemp)-c(s),0)} height=${a}></rect>
        <polyline class="raw" points=${f.join(" ")}></polyline>
        <polyline class="curve" points=${g.join(" ")}></polyline>
        ${_===void 0?"":R`<circle class="now" cx=${c(Math.max(Math.min(_,s),i))} cy=${p(l(Z(e,_)))} r="5">
              <title>${A(this.language,_)} °C → ${A(this.language,l(Z(e,_)))} °C</title>
            </circle>`}
      </svg>
    `}static{this.styles=y`
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
  `}};customElements.get("heatcast-curve-chart")??customElements.define("heatcast-curve-chart",ft);var ae=[["settings.temperatures",["comfort_temp","eco_offset"]],["settings.controller",["kp","ti_min","integral"]],["settings.weather",["damping_tau_h","outdoor_damped","forecast_horizon_h","forecast_weight","k_solar","k_wind","wind_ref"]],["settings.filter",["room_rate_max","sensor_hold_min"]]],Bt=["design_temp","outdoor_min","curve_exponent","curve_offset","flow_min","flow_max","summer_temp"],gt=class extends v{constructor(){super(...arguments);this.confirming=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},confirming:{state:!0}}}num(e){return x(this.hass,this.entry.entities[e])}render(){return this.hass.user?.is_admin?d`
      <div class="grid">
        ${this.renderBoiler()} ${this.renderCurve()}
        ${ae.map(([e,s])=>this.renderGroup(e,s.map(i=>this.entry.entities[i])))}
        ${this.renderGroup("settings.rooms",this.entry.rooms.map(e=>e.entities.weight),this.entry.rooms.map(e=>e.name))}
        ${this.renderFeatures()}
      </div>
      <p class="small">
        <a href="/config/integrations/integration/heatcast">${this.localize("settings.entities")}</a>
      </p>
    `:d`<section class="card muted">${this.localize("settings.admin_only")}</section>`}renderGroup(e,s,i){return d`
      <section class="card">
        <h2>${this.localize(e)}</h2>
        ${s.map((o,n)=>o?this.renderNumber(o,i?.[n]):m)}
      </section>
    `}renderNumber(e,s){let i=this.hass.states[e];if(!i)return d``;let o=Number.parseFloat(i.state),n=Number(i.attributes.step??1),h=Number(i.attributes.min??-1/0),a=Number(i.attributes.max??1/0),c=n<.01?3:n<.1?2:n<1?1:0,p=i.attributes.unit_of_measurement??"",l=f=>{let g=Math.round(Math.max(Math.min(f,a),h)/n)*n;this.hass.callService("number","set_value",{entity_id:e,value:Number(g.toFixed(4))})};return d`
      <div class="number">
        <span class="label">${s??i.attributes.friendly_name}</span>
        <span class="stepper">
          <button class="round mini" ?disabled=${o<=h} @click=${()=>l(o-n)}>−</button>
          <input
            type="number"
            .value=${Number.isFinite(o)?o.toFixed(c):""}
            step=${n}
            min=${h}
            max=${a}
            @change=${f=>l(Number.parseFloat(f.target.value))}
          />
          <button class="round mini" ?disabled=${o>=a} @click=${()=>l(o+n)}>+</button>
          <span class="unit">${p}</span>
        </span>
      </div>
    `}renderCurve(){let e=Bt.map(o=>this.num(o)),s=this.num("setpoint"),i;if(e.every(o=>o!==void 0)&&s!==void 0){let[o,n,h,a,c,p,l]=e;i={setpoint:s,designTemp:o,outdoorMin:n,exponent:h,offset:a,flowMin:c,flowMax:p,summerTemp:l}}return d`
      <section class="card curve">
        <h2>${this.localize("settings.curve")}</h2>
        <heatcast-curve-chart
          .params=${i}
          .outdoor=${this.num("outdoor_effective")}
          language=${this.hass.language}
        ></heatcast-curve-chart>
        <p class="muted small">${this.localize("settings.curve_hint")}</p>
        ${Bt.map(o=>this.renderNumber(this.entry.entities[o]))}
      </section>
    `}renderToggle(e,s,i,o){return d`
      <div class="toggle-row">
        <div>
          <div>${this.localize(e)}</div>
          <div class="muted small">${this.localize(s)}</div>
        </div>
        <button class="toggle ${i?"on":""}" role="switch" aria-checked=${i} @click=${()=>o(!i)}>
          <span></span>
        </button>
      </div>
    `}renderBoiler(){let e=b(this.hass,this.entry.entities.control),s=b(this.hass,this.entry.entities.test_mode),i=(o,n)=>this.hass.callService("switch",n?"turn_on":"turn_off",{entity_id:o});return d`
      <section class="card">
        <h2>${this.localize("settings.boiler")}</h2>
        ${this.renderToggle("settings.control","settings.control_hint",e,o=>{if(o){this.confirming=!0;return}i(this.entry.entities.control,!1)})}
        ${this.confirming?d`<div class="confirm">
              <span>${this.localize("settings.control_confirm")}</span>
              <button class="text" @click=${()=>this.confirming=!1}>${this.localize("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${()=>{this.confirming=!1,i(this.entry.entities.control,!0)}}
              >
                ${this.localize("settings.confirm")}
              </button>
            </div>`:m}
        ${this.renderToggle("settings.test_mode","settings.test_mode_hint",s,o=>i(this.entry.entities.test_mode,o))}
        ${this.renderNumber(this.entry.entities.test_flow)}
      </section>
    `}renderFeatures(){return d`
      <section class="card">
        <h2>${this.localize("settings.features")}</h2>
        ${this.renderToggle("settings.individual","settings.individual_hint",this.entry.individual_rooms,async e=>{await Nt(this.hass,this.entry.entry_id,e),Wt(this,"heatcast-entries-changed")})}
      </section>
    `}static{this.styles=[w,y`
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: var(--hc-gap);
        align-items: start;
      }
      .curve {
        grid-row: span 2;
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
    `]}};customElements.get("heatcast-settings")??customElements.define("heatcast-settings",gt);var le=14,ce=30;function Ft(r,t,e){let s=[];for(let i=new Date(t);i<e;i.setDate(i.getDate()+1))s.push({day:new Date(i),hours:0});for(let i=0;i<r.length;i++){if(r[i].s!=="on")continue;let o=Math.max(r[i].lu*1e3,t.getTime()),n=Math.min(i+1<r.length?r[i+1].lu*1e3:Date.now(),e.getTime());for(let h of s){let a=h.day.getTime(),c=new Date(h.day).setDate(h.day.getDate()+1),p=Math.min(n,c)-Math.max(o,a);p>0&&(h.hours+=p/36e5)}}return s}var vt=class extends v{constructor(){super(...arguments);this.cards=[]}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},burner:{state:!0},demand:{state:!0}}}connectedCallback(){super.connectedCallback(),this.load()}updated(e){if(e.has("hass"))for(let s of this.cards)s.hass=this.hass}async load(){let e=new Date,s=new Date(e);s.setHours(0,0,0,0),s.setDate(s.getDate()-(le-1));let i=this.entry.sources.flame_sensor,o=this.entry.entities.demand,n=[o,i].filter(l=>!!l),h=await Ot(this.hass,n,s,e);this.demand=Ft(h[o]??[],s,e),this.burner=i?Ft(h[i]??[],s,e):void 0;let a=this.entry.entities,c=[[this.localize("stats.flow"),a.flow_setpoint],[this.localize("stats.outdoor"),a.outdoor_effective],[this.localize("stats.house"),a.room_temperature]],p=await Promise.all(c.filter(([,l])=>!!l).map(([l,f])=>V({type:"statistics-graph",title:l,entities:[f],period:"day",stat_types:["mean","min","max"],days_to_show:ce,chart_type:"line"})));this.cards=p.filter(l=>!!l);for(let l of this.cards)l.hass=this.hass;this.requestUpdate()}renderBars(e,s,i){if(!s)return m;let o=this.hass.language,n=Math.max(24/4,...s.map(c=>c.hours)),h=100/s.length,a=s.reduce((c,p)=>c+p.hours,0);return d`
      <section class="card">
        <h2>${e}</h2>
        <div class="muted small">
          ${this.localize("stats.days",{n:s.length})} · ${this.localize("stats.total",{h:A(o,a,0)})}
        </div>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="bars" role="img" aria-label=${e}>
          ${s.map((c,p)=>{let l=c.hours/n*46;return R`<rect x=${p*h+h*.15} y=${48-l} width=${h*.7} height=${l} rx="0.6" fill=${i}>
              <title>${c.day.toLocaleDateString(o,{weekday:"short",day:"numeric",month:"short"})}: ${A(o,c.hours)} h</title>
            </rect>`})}
        </svg>
        <div class="labels">
          ${s.map((c,p)=>d`<span>${p%2===s.length%2?c.day.toLocaleDateString(o,{day:"numeric"}):""}</span>`)}
        </div>
      </section>
    `}render(){return d`
      <div class="grid">
        ${this.entry.sources.flame_sensor?this.renderBars(this.localize("stats.burner"),this.burner,"var(--hc-heat)"):d`<section class="card muted small">${this.localize("stats.no_flame")}</section>`}
        ${this.renderBars(this.localize("stats.demand"),this.demand,"var(--primary-color)")} ${this.cards}
      </div>
    `}static{this.styles=[w,y`
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
        gap: var(--hc-gap);
      }
      @media (max-width: 600px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
      .bars {
        width: 100%;
        height: 160px;
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
    `]}};customElements.get("heatcast-stats")??customElements.define("heatcast-stats",vt);var de=[{id:"home",label:"tab.home",icon:"mdi:home-thermometer-outline"},{id:"charts",label:"tab.charts",icon:"mdi:chart-line"},{id:"stats",label:"tab.stats",icon:"mdi:chart-bar"},{id:"settings",label:"tab.settings",icon:"mdi:tune-variant"}],he=1500,yt=class extends v{constructor(){super(...arguments);this.narrow=!1;this.tab="home";this.loading=!1;this.localize=ct("en");this.language="";this.entriesChanged=()=>{window.setTimeout(()=>this.load(),he)}}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},entries:{state:!0},entryId:{state:!0},tab:{state:!0},error:{state:!0}}}willUpdate(e){e.has("hass")&&this.hass&&this.hass.language!==this.language&&(this.language=this.hass.language,this.localize=ct(this.language)),e.has("hass")&&this.hass&&!this.entries&&!this.loading&&this.load()}async load(){this.loading=!0;try{this.entries=await Lt(this.hass),this.entries.some(s=>s.entry_id===this.entryId)||(this.entryId=this.entries[0]?.entry_id),this.error=void 0}catch(e){this.error=String(e?.message??e)}finally{this.loading=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("heatcast-entries-changed",this.entriesChanged),this.hass&&this.load()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("heatcast-entries-changed",this.entriesChanged)}render(){let e=this.entries?.find(s=>s.entry_id===this.entryId);return d`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="title">${e?.title??"HeatCast"}</div>
          ${(this.entries?.length??0)>1?d`<select @change=${s=>this.entryId=s.target.value}>
                ${this.entries.map(s=>d`<option value=${s.entry_id} ?selected=${s.entry_id===this.entryId}>${s.title}</option>`)}
              </select>`:m}
        </div>
        <nav>
          ${de.map(s=>d`
              <button class="tab ${s.id===this.tab?"active":""}" @click=${()=>this.tab=s.id}>
                <ha-icon icon=${s.icon}></ha-icon><span>${this.localize(s.label)}</span>
              </button>
            `)}
        </nav>
      </div>
      <main>${this.renderContent(e)}</main>
    `}renderContent(e){if(this.error)return d`<div class="card">${this.error}</div>`;if(!this.entries)return d`<div class="muted">${this.localize("loading")}</div>`;if(!e)return d`<div class="card">${this.localize("no_entry")}</div>`;let s={hass:this.hass,entry:e,localize:this.localize};switch(this.tab){case"charts":return d`<heatcast-charts .hass=${s.hass} .entry=${e} .localize=${s.localize}></heatcast-charts>`;case"stats":return d`<heatcast-stats .hass=${s.hass} .entry=${e} .localize=${s.localize}></heatcast-stats>`;case"settings":return d`<heatcast-settings .hass=${s.hass} .entry=${e} .localize=${s.localize}></heatcast-settings>`;default:return d`<heatcast-home .hass=${s.hass} .entry=${e} .localize=${s.localize}></heatcast-home>`}}static{this.styles=[w,y`
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
    `]}};customElements.get("heatcast-panel")??customElements.define("heatcast-panel",yt);
