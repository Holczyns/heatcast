var G=globalThis,V=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Q=Symbol(),Et=new WeakMap,D=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==Q)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(V&&t===void 0){let s=e!==void 0&&e.length===1;s&&(t=Et.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Et.set(e,t))}return t}toString(){return this.cssText}},At=o=>new D(typeof o=="string"?o:o+"",void 0,Q),b=(o,...t)=>{let e=o.length===1?o[0]:t.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new D(e,o,Q)},St=(o,t)=>{if(V)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let s=document.createElement("style"),i=G.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},tt=V?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(let s of t.cssRules)e+=s.cssText;return At(e)})(o):o;var{is:oe,defineProperty:ne,getOwnPropertyDescriptor:ae,getOwnPropertyNames:le,getOwnPropertySymbols:de,getPrototypeOf:ce}=Object,q=globalThis,Ct=q.trustedTypes,he=Ct?Ct.emptyScript:"",me=q.reactiveElementPolyfillSupport,N=(o,t)=>o,et={toAttribute(o,t){switch(t){case Boolean:o=o?he:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},Rt=(o,t)=>!oe(o,t),Tt={attribute:!0,type:String,converter:et,reflect:!1,useDefault:!1,hasChanged:Rt};Symbol.metadata??=Symbol("metadata"),q.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Tt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ne(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){let{get:i,set:r}=ae(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:i,set(n){let d=i?.call(this);r?.call(this,n),this.requestUpdate(t,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Tt}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let t=ce(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let e=this.properties,s=[...le(e),...de(e)];for(let i of s)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(let[e,s]of this.elementProperties){let i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let s=new Set(t.flat(1/0).reverse());for(let i of s)e.unshift(tt(i))}else t!==void 0&&e.push(tt(t));return e}static _$Eu(t,e){let s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return St(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){let s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){let r=(s.converter?.toAttribute!==void 0?s.converter:et).toAttribute(e,s.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){let s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){let r=s.getPropertyOptions(i),n=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:et;this._$Em=i;let d=n.fromAttribute(e,r.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(t!==void 0){let n=this.constructor;if(i===!1&&(r=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??Rt)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),r!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}let s=this.constructor.elementProperties;if(s.size>0)for(let[i,r]of s){let{wrapped:n}=r,d=this[i];n!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,r,d)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(s=>s.hostUpdate?.()),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[N("elementProperties")]=new Map,A[N("finalized")]=new Map,me?.({ReactiveElement:A}),(q.reactiveElementVersions??=[]).push("2.1.2");var lt=globalThis,zt=o=>o,Y=lt.trustedTypes,Ht=Y?Y.createPolicy("lit-html",{createHTML:o=>o}):void 0,Nt="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,Ot="?"+S,pe=`<${Ot}>`,z=document,F=()=>z.createComment(""),U=o=>o===null||typeof o!="object"&&typeof o!="function",dt=Array.isArray,ue=o=>dt(o)||typeof o?.[Symbol.iterator]=="function",st=`[ 	
\f\r]`,O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Mt=/-->/g,Pt=/>/g,T=RegExp(`>|${st}(?:([^\\s"'>=/]+)(${st}*=${st}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Lt=/'/g,It=/"/g,Ft=/^(?:script|style|textarea|title)$/i,ct=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),a=ct(1),I=ct(2),ze=ct(3),H=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Dt=new WeakMap,R=z.createTreeWalker(z,129);function Ut(o,t){if(!dt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ht!==void 0?Ht.createHTML(t):t}var fe=(o,t)=>{let e=o.length-1,s=[],i,r=t===2?"<svg>":t===3?"<math>":"",n=O;for(let d=0;d<e;d++){let l=o[d],m,h,c=-1,u=0;for(;u<l.length&&(n.lastIndex=u,h=n.exec(l),h!==null);)u=n.lastIndex,n===O?h[1]==="!--"?n=Mt:h[1]!==void 0?n=Pt:h[2]!==void 0?(Ft.test(h[2])&&(i=RegExp("</"+h[2],"g")),n=T):h[3]!==void 0&&(n=T):n===T?h[0]===">"?(n=i??O,c=-1):h[1]===void 0?c=-2:(c=n.lastIndex-h[2].length,m=h[1],n=h[3]===void 0?T:h[3]==='"'?It:Lt):n===It||n===Lt?n=T:n===Mt||n===Pt?n=O:(n=T,i=void 0);let v=n===T&&o[d+1].startsWith("/>")?" ":"";r+=n===O?l+pe:c>=0?(s.push(m),l.slice(0,c)+Nt+l.slice(c)+S+v):l+S+(c===-2?d:v)}return[Ut(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]},B=class o{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0,d=t.length-1,l=this.parts,[m,h]=fe(t,e);if(this.el=o.createElement(m,s),R.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(i=R.nextNode())!==null&&l.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let c of i.getAttributeNames())if(c.endsWith(Nt)){let u=h[n++],v=i.getAttribute(c).split(S),x=/([.?@])?(.*)/.exec(u);l.push({type:1,index:r,name:x[2],strings:v,ctor:x[1]==="."?rt:x[1]==="?"?ot:x[1]==="@"?nt:L}),i.removeAttribute(c)}else c.startsWith(S)&&(l.push({type:6,index:r}),i.removeAttribute(c));if(Ft.test(i.tagName)){let c=i.textContent.split(S),u=c.length-1;if(u>0){i.textContent=Y?Y.emptyScript:"";for(let v=0;v<u;v++)i.append(c[v],F()),R.nextNode(),l.push({type:2,index:++r});i.append(c[u],F())}}}else if(i.nodeType===8)if(i.data===Ot)l.push({type:2,index:r});else{let c=-1;for(;(c=i.data.indexOf(S,c+1))!==-1;)l.push({type:7,index:r}),c+=S.length-1}r++}}static createElement(t,e){let s=z.createElement("template");return s.innerHTML=t,s}};function P(o,t,e=o,s){if(t===H)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl,r=U(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=P(o,i._$AS(o,t.values),i,s)),t}var it=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??z).importNode(e,!0);R.currentNode=i;let r=R.nextNode(),n=0,d=0,l=s[0];for(;l!==void 0;){if(n===l.index){let m;l.type===2?m=new W(r,r.nextSibling,this,t):l.type===1?m=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(m=new at(r,this,t)),this._$AV.push(m),l=s[++d]}n!==l?.index&&(r=R.nextNode(),n++)}return R.currentNode=z,i}p(t){let e=0;for(let s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},W=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),U(t)?t===p||t==null||t===""?(this._$AH!==p&&this._$AR(),this._$AH=p):t!==this._$AH&&t!==H&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):ue(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==p&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=B.createElement(Ut(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{let r=new it(i,this),n=r.u(this.options);r.p(e),this.T(n),this._$AH=r}}_$AC(t){let e=Dt.get(t.strings);return e===void 0&&Dt.set(t.strings,e=new B(t)),e}k(t){dt(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,s,i=0;for(let r of t)i===e.length?e.push(s=new o(this.O(F()),this.O(F()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let s=zt(t).nextSibling;zt(t).remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},L=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=p,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=p}_$AI(t,e=this,s,i){let r=this.strings,n=!1;if(r===void 0)t=P(this,t,e,0),n=!U(t)||t!==this._$AH&&t!==H,n&&(this._$AH=t);else{let d=t,l,m;for(t=r[0],l=0;l<r.length-1;l++)m=P(this,d[s+l],e,l),m===H&&(m=this._$AH[l]),n||=!U(m)||m!==this._$AH[l],m===p?t=p:t!==p&&(t+=(m??"")+r[l+1]),this._$AH[l]=m}n&&!i&&this.j(t)}j(t){t===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},rt=class extends L{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===p?void 0:t}},ot=class extends L{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==p)}},nt=class extends L{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??p)===H)return;let s=this._$AH,i=t===p&&s!==p||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==p&&(s===p||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},at=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}};var ge=lt.litHtmlPolyfillSupport;ge?.(B,W),(lt.litHtmlVersions??=[]).push("3.3.3");var Bt=(o,t,e)=>{let s=e?.renderBefore??t,i=s._$litPart$;if(i===void 0){let r=e?.renderBefore??null;s._$litPart$=i=new W(t.insertBefore(F(),r),r,void 0,e??{})}return i._$AI(o),i};var ht=globalThis,g=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Bt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return H}};g._$litElement$=!0,g.finalized=!0,ht.litElementHydrateSupport?.({LitElement:g});var ve=ht.litElementPolyfillSupport;ve?.({LitElement:g});(ht.litElementVersions??=[]).push("4.2.2");function Wt(o){return o.callWS({type:"heatcast/entries"})}function Kt(o,t,e){return o.callWS({type:"heatcast/set_options",entry_id:t,individual_rooms:e})}function jt(o,t,e,s){return o.callWS({type:"heatcast/update_sources",entry_id:t,...e,idle_flow:s})}function Gt(o,t,e){return o.callWS({type:"heatcast/add_room",entry_id:t,...e})}function Vt(o,t,e,s){return o.callWS({type:"heatcast/update_room",entry_id:t,room_id:e,...s})}function qt(o,t,e){return o.callWS({type:"heatcast/remove_room",entry_id:t,room_id:e})}async function Yt(o,t,e,s){return o.callWS({type:"history/history_during_period",start_time:e.toISOString(),end_time:s.toISOString(),entity_ids:t,minimal_response:!0,no_attributes:!0,significant_changes_only:!1})}var be={"settings.sources":"Boiler and sources","settings.reload_hint":"Saving reloads HeatCast; the controller state is kept.","src.flow_entity":"Flow temperature setpoint","src.block_entity":"Heating off switch","src.flow_sensor":"Measured flow temperature","src.flame_sensor":"Burner on","src.dhw_sensor":"Hot water heating","src.outdoor_sensor":"Outdoor temperature","src.weather":"Weather forecast","src.schedule":"Comfort schedule","src.idle_flow":"Flow temperature without heating demand","room.name":"Name","room.sensor":"Temperature sensor","room.valve":"Radiator valve","room.valve_temperature":"Valve temperature input","room.remove_confirm":"Remove {name}? Its entities are removed; recorded history stays.","action.edit":"Edit","action.save":"Save","action.remove":"Remove","action.add_room":"Add room","p.comfort_temp":"House temperature","p.eco_offset":"Eco setback","p.kp":"Proportional gain","p.ti_min":"Integral time","p.integral":"Integral","p.damping_tau_h":"Building time constant","p.outdoor_damped":"Damped outdoor temperature","p.forecast_horizon_h":"Forecast horizon","p.forecast_weight":"Forecast weight","p.k_solar":"Sun gain","p.k_wind":"Wind loss","p.wind_ref":"Wind threshold","p.room_rate_max":"Maximum rate of change","p.sensor_hold_min":"Sensor dropout hold","p.design_temp":"Design flow temperature","p.outdoor_min":"Design outdoor temperature","p.curve_exponent":"Curvature","p.curve_offset":"Shift","p.flow_min":"Minimum flow temperature","p.flow_max":"Maximum flow temperature","p.summer_temp":"Heating off above","p.test_flow":"Test flow temperature","history.raw":"Every change as recorded","history.daily":"Daily averages","stats.average":"average {h} h/day","s.setpoint":"Setpoint","s.measured":"Measured","s.curve":"Curve","s.outdoor":"Sensor","s.damped":"Damped","s.effective":"Effective","s.house":"House","s.house_target":"House setpoint","s.correction":"Total","s.forecast":"Forecast","s.solar":"Sun","s.wind":"Wind","s.demand":"Demand","s.control":"Boiler control","s.flame":"Burner","s.dhw":"Hot water","tab.history":"History","tab.guide":"Guide","tab.home":"Home","tab.settings":"Settings",loading:"Loading\u2026",no_entry:"HeatCast is not set up yet. Add it under Settings \u2192 Devices & services.",house:"House",inside:"Inside",target:"Target",heating:"Heating",heating_off:"Off",control_on:"HeatCast controls the boiler",control_off:"Shadow mode \u2013 nothing is sent to the boiler",demand:"Heating demand",no_demand:"No heating demand",flame:"Burner on",dhw:"Hot water",sync:"Sync",sync_hint:"All rooms follow the house",individual_hint:"Each room keeps its own temperature",boiler:"Boiler",flow_setpoint:"Flow setpoint",flow_measured:"Measured",why_flow:"Where the flow temperature comes from",outdoor_damped:"Damped outdoor",forecast_effect:"Forecast",solar:"Sun",wind:"Wind",outdoor_effective:"Effective outdoor",curve_at:"Curve at {t}",p_term:"Room correction (P)",integral:"Integral (I)",limited_min:"Raised to minimum",limited_max:"Lowered to maximum",result:"Flow setpoint",summer:"Above the summer threshold \u2013 no heating",weather:"Weather",outdoor_now:"Outdoor now",forecast:"Forecast",forecast_stale:"Forecast out of date",next_hours:"next {h} h",cloud:"Clouds",forecast_change:"Temperature change",daylight:"Daylight",rooms:"Rooms",filtered:"Filtered",weight:"Weight",too_cold:"{d} K below target",too_warm:"{d} K above target",on_target:"On target",sensor_missing:"No reading",range:"Range","chart.flow":"Flow temperature","chart.outdoor":"Outdoor temperature","chart.rooms":"Rooms","chart.correction":"Room correction","chart.weather":"Weather effects","chart.states":"States","stats.burner":"Burner hours per day","stats.demand":"Hours with heating demand","stats.no_flame":"Burner hours need a burner sensor in the boiler settings.","stats.days":"Last {n} days","stats.total":"Total {h} h","settings.temperatures":"Temperatures","settings.curve":"Heating curve","settings.curve_hint":"Flow temperature over outdoor temperature at the current house setpoint. The dot is where the controller is now.","settings.controller":"Room controller","settings.weather":"Weather and forecast","settings.filter":"Room sensor filter","settings.rooms":"Rooms","settings.features":"Features","settings.individual":"Individual room temperatures","settings.individual_hint":"Adds a thermostat to every room and the sync switch. With one heating circuit and no radiator valves the rooms share one compromise.","settings.boiler":"Boiler","settings.control":"Boiler control","settings.control_hint":"While off, HeatCast only calculates. Turn off any other automation writing the boiler first.","settings.control_confirm":"Send the flow setpoint to the boiler from now on?","settings.confirm":"Turn on","settings.cancel":"Cancel","settings.test_mode":"Boiler test mode","settings.test_mode_hint":"Sends the test flow temperature for up to an hour, regardless of the model.","settings.entities":"Entities and devices","settings.admin_only":"Only administrators can change settings."},C="en";function Jt(){return(o,t)=>{let e=be[o]??o;for(let[s,i]of Object.entries(t??{}))e=e.replace(`{${s}}`,String(i));return e}}function w(o,t,e=1){return t===void 0?"\u2013":t.toLocaleString(o,{minimumFractionDigits:e,maximumFractionDigits:e})}function mt(o,t,e=1){let s=w(o,Math.abs(t),e);return Math.abs(t)<.5*10**-e?s:t>0?`+${s}`:`\u2212${s}`}var y=b`
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
`;var ye=["Outdoor sensor","Damping","Forecast, sun, wind","Curve","Room correction","Limits","Boiler"],$e=o=>a`<div class="pipeline">${o.map(t=>a`<span class="chip">${t}</span>`)}</div>`,xe=[{icon:"mdi:information-outline",title:"How HeatCast works",body:a`
      <p>
        HeatCast calculates the temperature of the water flowing to radiators and underfloor heating and sends it to the
        boiler every 30 seconds. It does not switch the burner: the boiler does that while holding the requested flow
        temperature.
      </p>
      ${$e(ye)}
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
    `},{icon:"mdi:rocket-launch-outline",title:"First start and taking over the boiler",body:a`
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
    `},{icon:"mdi:shield-check-outline",title:"Safety and failures",body:a`
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
    `},{icon:"mdi:chart-bell-curve-cumulative",title:"Tuning the heating curve",body:a`
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
    `},{icon:"mdi:tune-vertical",title:"Room controller",body:a`
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
    `},{icon:"mdi:weather-partly-snowy-rainy",title:"Weather, forecast, sun and wind",body:a`
      <ul>
        <li><b>Building time constant</b> (τ): how slowly the house follows the weather. Light houses 2–3 h, heavy ones 6–10 h.</li>
        <li><b>Forecast horizon</b>: how many hours ahead to look. Matching the heating delay works well.</li>
        <li><b>Forecast weight</b>: 0 ignores the forecast, 1 uses only the forecast. 0.5 is a safe start.</li>
        <li><b>Sun gain</b>: kelvin added to the effective temperature in full sun. Start at 0 and raise it if the house overheats on sunny days.</li>
        <li><b>Wind loss</b>: kelvin removed per km/h above the threshold, for draughty or exposed houses.</li>
      </ul>
    `},{icon:"mdi:floor-plan",title:"Rooms, weights and individual temperatures",body:a`
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
    `},{icon:"mdi:calendar-clock",title:"Schedule and eco setback",body:a`
      <p>
        During the comfort schedule the house temperature applies. Outside it every target, rooms included, is lowered by
        the <b>eco setback</b>. With underfloor heating a setback above 1 K rarely pays off, since the screed reacts hours
        later.
      </p>
    `},{icon:"mdi:test-tube",title:"Boiler test mode",body:a`
      <p>
        Sends a fixed test flow temperature regardless of the model, even in shadow mode, to check that the boiler accepts
        the setpoint. It turns itself off after an hour; the boiler then returns to its own control after a few minutes,
        which tests the fallback as well.
      </p>
    `}],pt=class extends g{render(){return a`
      <div class="guide">
        ${xe.map((e,s)=>a`
            <details class="card" ?open=${s===0}>
              <summary><ha-icon icon=${e.icon}></ha-icon><span>${e.title}</span></summary>
              <div class="body">${e.body}</div>
            </details>
          `)}
      </div>
    `}static{this.styles=[y,b`
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
    `]}};customElements.get("heatcast-guide")??customElements.define("heatcast-guide",pt);var Xt;async function ut(o){if(window.loadCardHelpers)return Xt??=window.loadCardHelpers(),(await Xt).createCardElement(o)}function k(o,t){if(!t)return;let e=Number.parseFloat(o.states[t]?.state??"");return Number.isFinite(e)?e:void 0}function $(o,t){return!!t&&o.states[t]?.state==="on"}function M(o,t,e){o.dispatchEvent(new CustomEvent(t,{detail:e,bubbles:!0,composed:!0}))}var Zt=[{hours:24,days:7,label:"24 h"},{hours:168,days:14,label:"7 d"},{hours:720,days:30,label:"30 d"}],Qt=720;function te(o,t,e){let s=[];for(let i=new Date(t);i<e;i.setDate(i.getDate()+1))s.push({day:new Date(i),hours:0});for(let i=0;i<o.length;i++){if(o[i].s!=="on")continue;let r=Math.max(o[i].lu*1e3,t.getTime()),n=Math.min(i+1<o.length?o[i+1].lu*1e3:Date.now(),e.getTime());for(let d of s){let l=d.day.getTime(),m=new Date(d.day).setDate(d.day.getDate()+1),h=Math.min(n,m)-Math.max(r,l);h>0&&(d.hours+=h/36e5)}}return s}function _e(o,t){let e=o.entities,s=o.sources;return[{title:"chart.flow",series:[{entity:e.flow_setpoint,name:t("s.setpoint")},{entity:s.flow_sensor,name:t("s.measured")},{entity:e.curve_flow,name:t("s.curve")}]},{title:"chart.outdoor",series:[{entity:s.outdoor_sensor,name:t("s.outdoor")},{entity:e.outdoor_damped,name:t("s.damped")},{entity:e.outdoor_effective,name:t("s.effective")}]},{title:"chart.rooms",series:[{entity:e.room_temperature,name:t("s.house")},{entity:e.setpoint,name:t("s.house_target")},...o.rooms.map(i=>({entity:i.entities.filtered,name:i.name}))]},{title:"chart.correction",series:[{entity:e.room_correction,name:t("s.correction")},{entity:e.proportional,name:"P"},{entity:e.integral,name:"I"}]},{title:"chart.weather",series:[{entity:e.forecast_effect,name:t("s.forecast")},{entity:e.solar_correction,name:t("s.solar")},{entity:e.wind_correction,name:t("s.wind")}]},{title:"chart.states",timeline:!0,series:[{entity:e.demand,name:t("s.demand")},{entity:e.control,name:t("s.control")},{entity:s.flame_sensor,name:t("s.flame")},{entity:s.dhw_sensor,name:t("s.dhw")}]}]}var ft=class extends g{constructor(){super(...arguments);this.range=Zt[0];this.cards=[]}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},range:{state:!0},burner:{state:!0},demand:{state:!0}}}willUpdate(e){(e.has("range")||e.has("entry"))&&(this.buildCards(),this.loadHours())}updated(e){if(e.has("hass"))for(let s of this.cards)s.hass=this.hass}async buildCards(){let e=this.range.hours>=Qt,s=_e(this.entry,this.localize).filter(r=>!(e&&r.timeline)),i=await Promise.all(s.map(r=>{let n=r.series.filter(d=>!!d.entity);return e?ut({type:"statistics-graph",title:this.localize(r.title),entities:n.map(d=>({entity:d.entity,name:d.name})),period:"day",stat_types:["mean"],days_to_show:this.range.days,chart_type:"line"}):ut({type:"history-graph",title:this.localize(r.title),hours_to_show:this.range.hours,entities:n.map(d=>({entity:d.entity,name:d.name}))})}));this.cards=i.filter(r=>!!r);for(let r of this.cards)r.hass=this.hass;this.requestUpdate()}async loadHours(){let e=new Date,s=new Date(e);s.setHours(0,0,0,0),s.setDate(s.getDate()-(this.range.days-1));let i=this.entry.sources.flame_sensor,r=this.entry.entities.demand,n=[r,i].filter(l=>!!l),d=await Yt(this.hass,n,s,e);this.demand=te(d[r]??[],s,e),this.burner=i?te(d[i]??[],s,e):void 0}renderBars(e,s,i){if(!s)return p;let r=C,n=Math.max(6,...s.map(c=>c.hours)),d=100/s.length,l=s.reduce((c,u)=>c+u.hours,0),m=l/s.length,h=Math.ceil(s.length/10);return a`
      <section class="card">
        <h2>${e}</h2>
        <div class="muted small">
          ${this.localize("stats.days",{n:s.length})} · ${this.localize("stats.total",{h:w(r,l,0)})}
          · ${this.localize("stats.average",{h:w(r,m)})}
        </div>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="bars" role="img" aria-label=${e}>
          ${s.map((c,u)=>{let v=c.hours/n*46;return I`<rect x=${u*d+d*.15} y=${48-v} width=${d*.7} height=${v} rx="0.6" fill=${i}>
              <title>${c.day.toLocaleDateString(r,{weekday:"short",day:"numeric",month:"short"})}: ${w(r,c.hours)} h</title>
            </rect>`})}
        </svg>
        <div class="labels">
          ${s.map((c,u)=>a`<span>${(s.length-1-u)%h===0?c.day.toLocaleDateString(r,{day:"numeric"}):""}</span>`)}
        </div>
      </section>
    `}render(){let e=this.range.hours>=Qt;return a`
      <div class="toolbar">
        ${Zt.map(s=>a`<button class="range ${s===this.range?"active":""}" @click=${()=>this.range=s}>
              ${s.label}
            </button>`)}
        <span class="muted small">${e?this.localize("history.daily"):this.localize("history.raw")}</span>
      </div>
      <div class="grid">
        ${this.entry.sources.flame_sensor?this.renderBars(this.localize("stats.burner"),this.burner,"var(--hc-heat)"):a`<section class="card muted small">${this.localize("stats.no_flame")}</section>`}
        ${this.renderBars(this.localize("stats.demand"),this.demand,"var(--primary-color)")} ${this.cards}
      </div>
    `}static{this.styles=[y,b`
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
    `]}};customElements.get("heatcast-history")??customElements.define("heatcast-history",ft);var J=.5,gt=class extends g{static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1}}}num(t){return k(this.hass,this.entry.entities[t])}fmt(t,e=1){return w(C,t,e)}render(){return a`
      <div class="top">${this.renderHouse()} ${this.renderBoiler()} ${this.renderWeather()}</div>
      <section class="card rooms">
          <h2><ha-icon icon="mdi:floor-plan"></ha-icon>${this.localize("rooms")}</h2>
        <div class="room-grid">${this.entry.rooms.map(t=>this.renderRoom(t))}</div>
      </section>
    `}renderHouse(){let t=this.localize,e=this.entry.entities.thermostat,s=this.hass.states[e],i=s?.attributes.current_temperature,r=s?.attributes.temperature,n=s?.state==="heat",d=$(this.hass,this.entry.entities.control),l=$(this.hass,this.entry.entities.demand),m=$(this.hass,this.entry.sources.flame_sensor),h=$(this.hass,this.entry.sources.dhw_sensor),c=this.entry.entities.room_sync;return a`
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
            <button class="round" ?disabled=${!n} @click=${()=>this.setTarget(e,r,-J)}>−</button>
            <div>
              <div class="target ${n?"":"muted"}">${this.fmt(r)} °C</div>
              <div class="muted small">${t(n?"target":"heating_off")}</div>
            </div>
            <button class="round" ?disabled=${!n} @click=${()=>this.setTarget(e,r,J)}>+</button>
          </div>
        </div>
        <div class="chips">
          <span class="chip ${d?"ok":""}">
            <ha-icon icon=${d?"mdi:water-boiler":"mdi:water-boiler-off"}></ha-icon>${t(d?"control_on":"control_off")}
          </span>
          <span class="chip ${l?"heat":""}">${t(l?"demand":"no_demand")}</span>
          ${m?a`<span class="chip heat"><ha-icon class="flame" icon="mdi:fire"></ha-icon>${t("flame")}</span>`:p}
          ${h?a`<span class="chip cold"><ha-icon icon="mdi:water-pump"></ha-icon>${t("dhw")}</span>`:p}
        </div>
        ${c?this.renderSync(c):p}
      </section>
    `}renderSync(t){let e=$(this.hass,t);return a`
      <div class="sync">
        <button class="sync-button ${e?"on":""}" @click=${()=>this.toggle(t,e)}>SYNC</button>
        <span class="muted small">${e?this.localize("sync_hint"):this.localize("individual_hint")}</span>
      </div>
    `}renderBoiler(){let t=this.localize,e=this.num("flow_setpoint"),s=k(this.hass,this.entry.sources.flow_sensor??void 0);return a`
      <section class="card boiler">
        <h2><ha-icon icon="mdi:water-boiler"></ha-icon>${t("boiler")}</h2>
        <div class="flow">
          <div>
            <span class="big">${this.fmt(e,0)}</span><span class="unit">°C</span>
            <div class="muted small">${t("flow_setpoint")}</div>
          </div>
          ${s!==void 0?a`<div class="measured">
                <span class="mid">${this.fmt(s)} °C</span>
                <div class="muted small">${t("flow_measured")}</div>
              </div>`:p}
        </div>
        <h3 class="muted small">${t("why_flow")}</h3>
        ${this.renderBreakdown()}
      </section>
    `}renderBreakdown(){let t=this.localize,e=C,s=$(this.hass,this.entry.entities.demand),i=this.num("outdoor_damped"),r=this.num("outdoor_effective"),n=this.num("curve_flow"),d=this.num("proportional"),l=this.num("integral"),m=this.num("flow_min"),h=this.num("flow_max"),c=this.num("flow_setpoint"),u=(j,_)=>_===void 0?p:a`<div class="row">
            <span>${j}</span>
            <span class="bar"><span class=${_>=0?"pos":"neg"} style="width:${Math.min(Math.abs(_)*16,100)}%"></span></span>
            <span class="value">${mt(e,_)} K</span>
          </div>`,v=n!==void 0?n+(d??0)+(l??0):void 0,x=p;return v!==void 0&&m!==void 0&&v<m&&(x=a`<div class="row note"><span>${t("limited_min")}</span><span></span><span class="value">${this.fmt(m,0)} °C</span></div>`),v!==void 0&&h!==void 0&&v>h&&(x=a`<div class="row note"><span>${t("limited_max")}</span><span></span><span class="value">${this.fmt(h,0)} °C</span></div>`),a`
      <div class="breakdown">
        <div class="row"><span>${t("outdoor_damped")}</span><span></span><span class="value">${this.fmt(i)} °C</span></div>
        ${u(t("forecast_effect"),this.num("forecast_effect"))} ${u(t("solar"),this.num("solar_correction"))}
        ${u(t("wind"),(this.num("wind_correction")??0)===0?void 0:-(this.num("wind_correction")??0))}
        <div class="row total"><span>${t("outdoor_effective")}</span><span></span><span class="value">${this.fmt(r)} °C</span></div>
        <div class="row">
          <span>${t("curve_at",{t:`${this.fmt(r)} \xB0C`})}</span><span></span><span class="value">${this.fmt(n)} °C</span>
        </div>
        ${u(t("p_term"),d)} ${u(t("integral"),l)} ${x}
        <div class="row total result">
          <span>${t("result")}</span><span></span><span class="value">${s?`${this.fmt(c,0)} \xB0C`:"\u2013"}</span>
        </div>
        ${s?p:a`<div class="muted small">${t("summer")}</div>`}
      </div>
    `}renderWeather(){let t=this.localize,e=k(this.hass,this.entry.sources.outdoor_sensor??void 0),s=$(this.hass,this.entry.entities.forecast_valid),i=this.num("forecast_horizon_h"),r=this.num("forecast_delta");return a`
      <section class="card weather">
        <h2><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${t("weather")}</h2>
        <div class="tiles">
          <div><span class="mid">${this.fmt(e)} °C</span><div class="muted small">${t("outdoor_now")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_damped"))} °C</span><div class="muted small">${t("outdoor_damped")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_effective"))} °C</span><div class="muted small">${t("outdoor_effective")}</div></div>
        </div>
        ${this.entry.sources.weather?a`<div class="forecast">
              <span class="chip ${s?"":"heat"}">${s?`${t("forecast")} \xB7 ${t("next_hours",{h:i??4})}`:t("forecast_stale")}</span>
            </div>
            <div class="forecast-grid">
              <div><ha-icon icon="mdi:thermometer"></ha-icon><span>${t("forecast_change")}</span><b>${r===void 0?"\u2013":mt(C,r)} K</b></div>
              <div><ha-icon icon="mdi:cloud-outline"></ha-icon><span>${t("cloud")}</span><b>${this.fmt(this.num("forecast_cloud"),0)} %</b></div>
              <div><ha-icon icon="mdi:weather-windy"></ha-icon><span>${t("wind")}</span><b>${this.fmt(this.num("forecast_wind"),0)} km/h</b></div>
              <div><ha-icon icon="mdi:white-balance-sunny"></ha-icon><span>${t("daylight")}</span><b>${this.fmt(this.num("forecast_daylight"),0)} %</b></div>
            </div>`:p}
      </section>
    `}renderRoom(t){let e=this.localize,s=k(this.hass,t.sensor),i=k(this.hass,t.entities.filtered),r=k(this.hass,t.entities.target),n=k(this.hass,t.entities.weight),d=t.entities.thermostat,l=r!==void 0&&i!==void 0?i-r:void 0,m=l!==void 0&&Math.abs(l)<.3,h=e("sensor_missing"),c="";if(l!==void 0&&(h=e("on_target"),c="ok"),l!==void 0&&!m){let v=this.fmt(Math.abs(l));h=l<0?e("too_cold",{d:v}):e("too_warm",{d:v}),c=l<0?"cold":"heat"}let u=l===void 0?50:50+Math.max(Math.min(l,2),-2)*25;return a`
      <div class="room ${n===0?"ignored":""}">
        <div class="room-head">
          <span class="room-name">${t.name}</span>
          <span class="chip small" title=${e("weight")}>${this.fmt(n,2)}</span>
        </div>
        <div class="room-temp"><span class="mid">${this.fmt(s)}</span> °C</div>
        <div class="scale"><span class="marker ${c}" style="left:${u}%"></span></div>
        <div class="room-foot">
          <span class="small ${c?`tone-${c}`:"muted"}">${h}</span>
          ${d?a`<span class="room-target">
                <button class="round mini" @click=${()=>this.setTarget(d,r,-J)}>−</button>
                <span>${this.fmt(r)}</span>
                <button class="round mini" @click=${()=>this.setTarget(d,r,J)}>+</button>
              </span>`:a`<span class="small muted">${e("target")} ${this.fmt(r)} °C</span>`}
        </div>
      </div>
    `}setTarget(t,e,s){e!==void 0&&this.hass.callService("climate","set_temperature",{entity_id:t,temperature:e+s})}setHvacMode(t,e){this.hass.callService("climate","set_hvac_mode",{entity_id:t,hvac_mode:e})}toggle(t,e){this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}static{this.styles=[y,b`
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
    `]}};customElements.get("heatcast-home")??customElements.define("heatcast-home",gt);function X(o,t){let e=o.setpoint-o.outdoorMin;if(e<=0)return o.setpoint;let s=Math.max(o.setpoint-t,0)/e;return o.setpoint+(o.designTemp-o.setpoint)*s**(1/o.exponent)+o.offset}var vt=320,bt=180,E={left:30,right:10,top:10,bottom:22},yt=class extends g{constructor(){super(...arguments);this.language="en"}static{this.properties={params:{attribute:!1},outdoor:{attribute:!1},language:{}}}render(){let e=this.params;if(!e)return a``;let s=20,i=Math.min(e.outdoorMin,-20),r=Math.floor(Math.min(e.flowMin,e.setpoint)/5)*5,n=Math.ceil(Math.max(e.flowMax,e.designTemp+e.offset)/5)*5,d=vt-E.left-E.right,l=bt-E.top-E.bottom,m=f=>E.left+(s-f)/(s-i)*d,h=f=>E.top+(n-f)/(n-r)*l,c=f=>Math.max(Math.min(f,e.flowMax),e.flowMin),u=[],v=[];for(let f=s;f>=i;f-=.5)u.push(`${m(f).toFixed(1)},${h(X(e,f)).toFixed(1)}`),f<e.summerTemp&&v.push(`${m(f).toFixed(1)},${h(c(X(e,f))).toFixed(1)}`);let x=[20,10,0,-10,-20].filter(f=>f>=i),j=[];for(let f=r;f<=n;f+=5)j.push(f);let _=this.outdoor;return a`
      <svg viewBox="0 0 ${vt} ${bt}" role="img">
        ${j.map(f=>I`<line class="grid" x1=${E.left} x2=${vt-E.right} y1=${h(f)} y2=${h(f)}></line>
            <text class="tick" x=${E.left-4} y=${h(f)+3} text-anchor="end">${f}</text>`)}
        ${x.map(f=>I`<text class="tick" x=${m(f)} y=${bt-6} text-anchor="middle">${f}</text>`)}
        <rect class="summer" x=${m(s)} y=${E.top} width=${Math.max(m(e.summerTemp)-m(s),0)} height=${l}></rect>
        <polyline class="raw" points=${u.join(" ")}></polyline>
        <polyline class="curve" points=${v.join(" ")}></polyline>
        ${_===void 0?"":I`<circle class="now" cx=${m(Math.max(Math.min(_,s),i))} cy=${h(c(X(e,_)))} r="5">
              <title>${w(this.language,_)} °C → ${w(this.language,c(X(e,_)))} °C</title>
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
  `}};customElements.get("heatcast-curve-chart")??customElements.define("heatcast-curve-chart",yt);function Z(o,t,e){let s=t?o.states[t]:void 0;if(!s)return a``;let i=Number.parseFloat(s.state),r=Number(s.attributes.step??1),n=Number(s.attributes.min??-1/0),d=Number(s.attributes.max??1/0),l=r<.01?3:r<.1?2:r<1?1:0,m=s.attributes.unit_of_measurement??"",h=c=>{if(!Number.isFinite(c))return;let u=Math.round(Math.max(Math.min(c,d),n)/r)*r;o.callService("number","set_value",{entity_id:t,value:Number(u.toFixed(4))})};return a`
    <div class="number">
      <span class="label">${e}</span>
      <span class="stepper">
        <button class="round mini" ?disabled=${i<=n} @click=${()=>h(i-r)}>−</button>
        <input
          type="number"
          .value=${Number.isFinite(i)?i.toFixed(l):""}
          step=${r}
          min=${n}
          max=${d}
          @change=${c=>h(Number.parseFloat(c.target.value))}
        />
        <button class="round mini" ?disabled=${i>=d} @click=${()=>h(i+r)}>+</button>
        <span class="unit">${m}</span>
      </span>
    </div>
  `}var K=b`
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
  .stepper input,
  input.text {
    padding: 4px 6px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
  }
  .stepper input {
    width: 64px;
    text-align: right;
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
  button.text {
    border: none;
    background: transparent;
    color: var(--primary-text-color);
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
  }
  button.text:hover {
    background: var(--secondary-background-color);
  }
  button.text.primary {
    color: var(--primary-color);
    font-weight: 500;
  }
  button.text.danger {
    color: var(--error-color, #db4437);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 8px;
  }
  .error {
    color: var(--error-color, #db4437);
    font-size: 0.85rem;
    margin-top: 6px;
  }
  .field {
    display: grid;
    gap: 4px;
    margin-bottom: 10px;
  }
  .field label {
    font-size: 0.85rem;
    color: var(--hc-muted);
  }
`;var $t=class extends g{constructor(){super(...arguments);this.domains=[];this.optional=!1}static{this.properties={hass:{attribute:!1},domains:{attribute:!1},deviceClass:{attribute:!1},value:{attribute:!1},optional:{type:Boolean}}}options(){return Object.values(this.hass.states).filter(s=>{let i=this.domains.includes(s.entity_id.split(".")[0]),r=!this.deviceClass||s.attributes.device_class===this.deviceClass;return i&&(r||s.entity_id===this.value)}).map(s=>({id:s.entity_id,name:String(s.attributes.friendly_name??s.entity_id)})).sort((s,i)=>s.name.localeCompare(i.name))}render(){let e=this.options(),s=!this.value||e.some(i=>i.id===this.value);return a`
      <select
        @change=${i=>{let r=i.target.value;M(this,"value-changed",r||null)}}
      >
        ${this.optional||!this.value?a`<option value="" ?selected=${!this.value}>–</option>`:""}
        ${s?"":a`<option value=${this.value} selected>${this.value}</option>`}
        ${e.map(i=>a`<option value=${i.id} ?selected=${i.id===this.value}>${i.name} · ${i.id}</option>`)}
      </select>
    `}static{this.styles=b`
    select {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
    }
  `}};customElements.get("heatcast-entity-picker")??customElements.define("heatcast-entity-picker",$t);var ee=[{key:"flow_entity",label:"src.flow_entity",domains:["number","input_number"],optional:!1},{key:"block_entity",label:"src.block_entity",domains:["switch","input_boolean"],optional:!0},{key:"flow_sensor",label:"src.flow_sensor",domains:["sensor"],deviceClass:"temperature",optional:!0},{key:"flame_sensor",label:"src.flame_sensor",domains:["binary_sensor"],optional:!0},{key:"dhw_sensor",label:"src.dhw_sensor",domains:["binary_sensor"],optional:!0},{key:"outdoor_sensor",label:"src.outdoor_sensor",domains:["sensor"],deviceClass:"temperature",optional:!1},{key:"weather",label:"src.weather",domains:["weather"],optional:!0},{key:"schedule",label:"src.schedule",domains:["schedule"],optional:!0}],we=[{key:"sensor",label:"room.sensor",domains:["sensor"],deviceClass:"temperature",optional:!1},{key:"valve",label:"room.valve",domains:["climate"],optional:!0},{key:"valve_temperature",label:"room.valve_temperature",domains:["number","input_number"],optional:!0}];function se(o){return String(o?.message??o)}function ie(o,t,e,s,i){return a`
    <div class="field">
      <label>${t(e.label)}${e.optional?"":" *"}</label>
      <heatcast-entity-picker
        .hass=${o}
        .domains=${e.domains}
        .deviceClass=${e.deviceClass}
        .value=${s}
        ?optional=${e.optional}
        @value-changed=${r=>i(r.detail)}
      ></heatcast-entity-picker>
    </div>
  `}var xt=class extends g{constructor(){super(...arguments);this.idleFlow=0;this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},draft:{state:!0},idleFlow:{state:!0},error:{state:!0},saving:{state:!0}}}edit(){this.draft={...this.entry.sources},this.idleFlow=this.entry.idle_flow,this.error=void 0}async save(){if(this.draft){this.saving=!0;try{await jt(this.hass,this.entry.entry_id,this.draft,this.idleFlow),this.draft=void 0,M(this,"heatcast-entries-changed")}catch(e){this.error=se(e)}finally{this.saving=!1}}}render(){let e=this.localize;return a`
      <section class="card">
        <h2>${e("settings.sources")}</h2>
        ${this.draft?this.renderForm():this.renderSummary()}
      </section>
    `}renderSummary(){let e=this.localize;return a`
      <dl>
        ${ee.map(s=>{let i=this.entry.sources[s.key],r=i?this.hass.states[i]?.attributes.friendly_name??i:"\u2013";return a`<dt>${e(s.label)}</dt>
            <dd title=${i??""}>${r}</dd>`})}
      </dl>
      <div class="actions"><button class="text primary" @click=${this.edit}>${e("action.edit")}</button></div>
    `}renderForm(){let e=this.localize,s=this.draft,i=!!s.block_entity;return a`
      ${ee.map(r=>ie(this.hass,e,r,s[r.key],n=>{this.draft={...s,[r.key]:n}}))}
      ${i?p:a`<div class="field">
            <label>${e("src.idle_flow")}</label>
            <input
              class="text"
              type="number"
              min="0"
              max="40"
              .value=${String(this.idleFlow)}
              @change=${r=>this.idleFlow=Number(r.target.value)}
            />
          </div>`}
      <p class="muted small">${e("settings.reload_hint")}</p>
      ${this.error?a`<div class="error">${this.error}</div>`:p}
      <div class="actions">
        <button class="text" @click=${()=>this.draft=void 0}>${e("settings.cancel")}</button>
        <button class="text primary" ?disabled=${this.saving} @click=${this.save}>${e("action.save")}</button>
      </div>
    `}static{this.styles=[y,K,b`
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 6px 16px;
        margin: 0;
        font-size: 0.9rem;
      }
      dt {
        color: var(--hc-muted);
      }
      dd {
        margin: 0;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `]}},_t=class extends g{constructor(){super(...arguments);this.confirmRemove=!1;this.saving=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},editing:{state:!0},draft:{state:!0},confirmRemove:{state:!0},error:{state:!0},saving:{state:!0}}}startEdit(e){this.editing=e?.id??"new",this.draft={name:e?.name??"",sensor:e?.sensor??"",valve:e?.valve??null,valve_temperature:e?.valve_temperature??null},this.confirmRemove=!1,this.error=void 0}stopEdit(){this.editing=void 0,this.draft=void 0}async run(e){this.saving=!0;try{await e(),this.stopEdit(),M(this,"heatcast-entries-changed")}catch(s){this.error=se(s)}finally{this.saving=!1}}render(){let e=this.localize;return a`
      <section class="card">
        <h2>${e("settings.rooms")}</h2>
        ${this.entry.rooms.map(s=>this.editing===s.id?this.renderForm(s):this.renderRoom(s))}
        ${this.editing==="new"?this.renderForm():a`<div class="actions">
              <button class="text primary" @click=${()=>this.startEdit()}>+ ${e("action.add_room")}</button>
            </div>`}
      </section>
    `}renderRoom(e){return a`
      <div class="room">
        ${Z(this.hass,e.entities.weight,e.name)}
        <button class="text icon" title=${this.localize("action.edit")} @click=${()=>this.startEdit(e)}>
          <ha-icon icon="mdi:pencil"></ha-icon>
        </button>
      </div>
    `}renderForm(e){let s=this.localize,i=this.draft,r=i.name.trim().length>0&&!!i.sensor,n=()=>this.run(()=>e?Vt(this.hass,this.entry.entry_id,e.id,i):Gt(this.hass,this.entry.entry_id,i));return a`
      <div class="form">
        <div class="field">
          <label>${s("room.name")} *</label>
          <input
            class="text"
            .value=${i.name}
            @input=${d=>this.draft={...i,name:d.target.value}}
          />
        </div>
        ${we.map(d=>ie(this.hass,s,d,i[d.key],l=>{this.draft={...i,[d.key]:l}}))}
        <p class="muted small">${s("settings.reload_hint")}</p>
        ${this.error?a`<div class="error">${this.error}</div>`:p}
        ${this.confirmRemove&&e?a`<div class="confirm">
              <span>${s("room.remove_confirm",{name:e.name})}</span>
              <button class="text" @click=${()=>this.confirmRemove=!1}>${s("settings.cancel")}</button>
              <button
                class="text danger"
                @click=${()=>this.run(()=>qt(this.hass,this.entry.entry_id,e.id))}
              >
                ${s("action.remove")}
              </button>
            </div>`:p}
        <div class="actions">
          ${e?a`<button class="text danger" @click=${()=>this.confirmRemove=!0}>${s("action.remove")}</button>`:p}
          <span class="spacer"></span>
          <button class="text" @click=${()=>this.stopEdit()}>${s("settings.cancel")}</button>
          <button class="text primary" ?disabled=${!r||this.saving} @click=${n}>
            ${s(e?"action.save":"action.add_room")}
          </button>
        </div>
      </div>
    `}static{this.styles=[y,K,b`
      .room {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .room > :first-child {
        flex: 1;
      }
      button.icon {
        padding: 4px;
        color: var(--hc-muted);
      }
      .form {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 12px;
        margin: 6px 0;
      }
      input.text {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
      }
      .spacer {
        flex: 1;
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 8px 0;
        border-radius: 8px;
        background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      }
      .confirm span {
        flex: 1;
      }
    `]}};customElements.get("heatcast-sources-card")??customElements.define("heatcast-sources-card",xt);customElements.get("heatcast-rooms-card")??customElements.define("heatcast-rooms-card",_t);var ke=[["settings.temperatures",["comfort_temp","eco_offset"]],["settings.controller",["kp","ti_min","integral"]],["settings.weather",["damping_tau_h","outdoor_damped","forecast_horizon_h","forecast_weight","k_solar","k_wind","wind_ref"]],["settings.filter",["room_rate_max","sensor_hold_min"]]],re=["design_temp","outdoor_min","curve_exponent","curve_offset","flow_min","flow_max","summer_temp"],wt=class extends g{constructor(){super(...arguments);this.confirming=!1}static{this.properties={hass:{attribute:!1},entry:{attribute:!1},localize:{attribute:!1},confirming:{state:!0}}}num(e){return k(this.hass,this.entry.entities[e])}render(){return this.hass.user?.is_admin?a`
      <div class="layout">
        <div class="column">
          ${this.renderBoiler()}
          <heatcast-sources-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></heatcast-sources-card>
          <heatcast-rooms-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></heatcast-rooms-card>
          ${this.renderFeatures()}
        </div>
        <div class="rest">
          <div class="column">${this.renderCurve()} ${this.renderParamGroup(0)}</div>
          <div class="column">${this.renderParamGroup(1)} ${this.renderParamGroup(2)} ${this.renderParamGroup(3)}</div>
        </div>
      </div>
      <p class="small">
        <a href="/config/integrations/integration/heatcast">${this.localize("settings.entities")}</a>
      </p>
    `:a`<section class="card muted">${this.localize("settings.admin_only")}</section>`}renderParamGroup(e){let[s,i]=ke[e];return this.renderGroup(s,i.map(r=>this.entry.entities[r]),i.map(r=>this.paramLabel(r)))}renderGroup(e,s,i){return a`
      <section class="card">
        <h2>${this.localize(e)}</h2>
        ${s.map((r,n)=>this.renderNumber(r,i?.[n]??""))}
      </section>
    `}renderNumber(e,s){return Z(this.hass,e,s)}paramLabel(e){return this.localize(`p.${e}`)}renderCurve(){let e=re.map(r=>this.num(r)),s=this.num("setpoint"),i;if(e.every(r=>r!==void 0)&&s!==void 0){let[r,n,d,l,m,h,c]=e;i={setpoint:s,designTemp:r,outdoorMin:n,exponent:d,offset:l,flowMin:m,flowMax:h,summerTemp:c}}return a`
      <section class="card curve">
        <h2>${this.localize("settings.curve")}</h2>
        <heatcast-curve-chart
          .params=${i}
          .outdoor=${this.num("outdoor_effective")}
          language=${C}
        ></heatcast-curve-chart>
        <p class="muted small">${this.localize("settings.curve_hint")}</p>
        ${re.map(r=>this.renderNumber(this.entry.entities[r],this.paramLabel(r)))}
      </section>
    `}renderToggle(e,s,i,r){return a`
      <div class="toggle-row">
        <div>
          <div>${this.localize(e)}</div>
          <div class="muted small">${this.localize(s)}</div>
        </div>
        <button class="toggle ${i?"on":""}" role="switch" aria-checked=${i} @click=${()=>r(!i)}>
          <span></span>
        </button>
      </div>
    `}renderBoiler(){let e=$(this.hass,this.entry.entities.control),s=$(this.hass,this.entry.entities.test_mode),i=(r,n)=>this.hass.callService("switch",n?"turn_on":"turn_off",{entity_id:r});return a`
      <section class="card">
        <h2>${this.localize("settings.boiler")}</h2>
        ${this.renderToggle("settings.control","settings.control_hint",e,r=>{if(r){this.confirming=!0;return}i(this.entry.entities.control,!1)})}
        ${this.confirming?a`<div class="confirm">
              <span>${this.localize("settings.control_confirm")}</span>
              <button class="text" @click=${()=>this.confirming=!1}>${this.localize("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${()=>{this.confirming=!1,i(this.entry.entities.control,!0)}}
              >
                ${this.localize("settings.confirm")}
              </button>
            </div>`:p}
        ${this.renderToggle("settings.test_mode","settings.test_mode_hint",s,r=>i(this.entry.entities.test_mode,r))}
        ${this.renderNumber(this.entry.entities.test_flow,this.paramLabel("test_flow"))}
      </section>
    `}renderFeatures(){return a`
      <section class="card">
        <h2>${this.localize("settings.features")}</h2>
        ${this.renderToggle("settings.individual","settings.individual_hint",this.entry.individual_rooms,async e=>{await Kt(this.hass,this.entry.entry_id,e),M(this,"heatcast-entries-changed")})}
      </section>
    `}static{this.styles=[y,K,b`
      /* Every card has a fixed column, so a card that grows never moves the others. */
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        gap: var(--hc-gap);
        align-items: start;
      }
      .rest {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--hc-gap);
        align-items: start;
      }
      .column {
        display: flex;
        flex-direction: column;
        gap: var(--hc-gap);
        min-width: 0;
      }
      @media (max-width: 1250px) {
        .layout {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .rest {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      @media (max-width: 760px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
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
      a {
        color: var(--primary-color);
      }
    `]}};customElements.get("heatcast-settings")??customElements.define("heatcast-settings",wt);var Ee=[{id:"home",label:"tab.home",icon:"mdi:home-thermometer-outline"},{id:"history",label:"tab.history",icon:"mdi:chart-line"},{id:"settings",label:"tab.settings",icon:"mdi:tune-variant"},{id:"guide",label:"tab.guide",icon:"mdi:book-open-variant"}],Ae=1500,kt=class extends g{constructor(){super(...arguments);this.narrow=!1;this.tab="home";this.loading=!1;this.localize=Jt();this.entriesChanged=()=>{window.setTimeout(()=>this.load(),Ae)}}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},entries:{state:!0},entryId:{state:!0},tab:{state:!0},error:{state:!0}}}willUpdate(e){e.has("hass")&&this.hass&&!this.entries&&!this.loading&&this.load()}async load(){this.loading=!0;try{this.entries=await Wt(this.hass),this.entries.some(s=>s.entry_id===this.entryId)||(this.entryId=this.entries[0]?.entry_id),this.error=void 0}catch(e){this.error=String(e?.message??e)}finally{this.loading=!1}}connectedCallback(){super.connectedCallback(),this.addEventListener("heatcast-entries-changed",this.entriesChanged),this.hass&&this.load()}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("heatcast-entries-changed",this.entriesChanged)}render(){let e=this.entries?.find(s=>s.entry_id===this.entryId);return a`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="title">${e?.title??"HeatCast"}</div>
          ${(this.entries?.length??0)>1?a`<select @change=${s=>this.entryId=s.target.value}>
                ${this.entries.map(s=>a`<option value=${s.entry_id} ?selected=${s.entry_id===this.entryId}>${s.title}</option>`)}
              </select>`:p}
        </div>
        <nav>
          ${Ee.map(s=>a`
              <button class="tab ${s.id===this.tab?"active":""}" @click=${()=>this.tab=s.id}>
                <ha-icon icon=${s.icon}></ha-icon><span>${this.localize(s.label)}</span>
              </button>
            `)}
        </nav>
      </div>
      <main>${this.renderContent(e)}</main>
    `}renderContent(e){if(this.error)return a`<div class="card">${this.error}</div>`;if(!this.entries)return a`<div class="muted">${this.localize("loading")}</div>`;if(!e)return a`<div class="card">${this.localize("no_entry")}</div>`;let s={hass:this.hass,entry:e,localize:this.localize};switch(this.tab){case"history":return a`<heatcast-history .hass=${s.hass} .entry=${e} .localize=${s.localize}></heatcast-history>`;case"guide":return a`<heatcast-guide></heatcast-guide>`;case"settings":return a`<heatcast-settings .hass=${s.hass} .entry=${e} .localize=${s.localize}></heatcast-settings>`;default:return a`<heatcast-home .hass=${s.hass} .entry=${e} .localize=${s.localize}></heatcast-home>`}}static{this.styles=[y,b`
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
    `]}};customElements.get("heatcast-panel")??customElements.define("heatcast-panel",kt);
