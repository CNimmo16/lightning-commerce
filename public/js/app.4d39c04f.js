(function(t){function e(e){for(var a,r,s=e[0],o=e[1],u=e[2],l=0,d=[];l<s.length;l++)r=s[l],i[r]&&d.push(i[r][0]),i[r]=0;for(a in o)Object.prototype.hasOwnProperty.call(o,a)&&(t[a]=o[a]);f&&f(e);while(d.length)d.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var t,e=0;e<c.length;e++){for(var n=c[e],a=!0,r=1;r<n.length;r++){var s=n[r];0!==i[s]&&(a=!1)}a&&(c.splice(e--,1),t=o(o.s=n[0]))}return t}var a={},r={app:0},i={app:0},c=[];function s(t){return o.p+"../../public/js/"+({}[t]||t)+"."+{"chunk-0a0ec6c3":"562529ab","chunk-98cff65e":"f0bffa29","chunk-2d0b59c2":"c94ad3b9","chunk-6141296a":"3b355bd7"}[t]+".js"}function o(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.e=function(t){var e=[],n={"chunk-0a0ec6c3":1,"chunk-98cff65e":1,"chunk-6141296a":1};r[t]?e.push(r[t]):0!==r[t]&&n[t]&&e.push(r[t]=new Promise(function(e,n){for(var a="../../public/css/"+({}[t]||t)+"."+{"chunk-0a0ec6c3":"b6fd9ee2","chunk-98cff65e":"be4fec02","chunk-2d0b59c2":"31d6cfe0","chunk-6141296a":"a81d4fe6"}[t]+".css",i=o.p+a,c=document.getElementsByTagName("link"),s=0;s<c.length;s++){var u=c[s],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===a||l===i))return e()}var d=document.getElementsByTagName("style");for(s=0;s<d.length;s++){u=d[s],l=u.getAttribute("data-href");if(l===a||l===i)return e()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=e,f.onerror=function(e){var a=e&&e.target&&e.target.src||i,c=new Error("Loading CSS chunk "+t+" failed.\n("+a+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=a,delete r[t],f.parentNode.removeChild(f),n(c)},f.href=i;var p=document.getElementsByTagName("head")[0];p.appendChild(f)}).then(function(){r[t]=0}));var a=i[t];if(0!==a)if(a)e.push(a[2]);else{var c=new Promise(function(e,n){a=i[t]=[e,n]});e.push(a[2]=c);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,o.nc&&l.setAttribute("nonce",o.nc),l.src=s(t),u=function(e){l.onerror=l.onload=null,clearTimeout(d);var n=i[t];if(0!==n){if(n){var a=e&&("load"===e.type?"missing":e.type),r=e&&e.target&&e.target.src,c=new Error("Loading chunk "+t+" failed.\n("+a+": "+r+")");c.type=a,c.request=r,n[1](c)}i[t]=void 0}};var d=setTimeout(function(){u({type:"timeout",target:l})},12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(e)},o.m=t,o.c=a,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)o.d(n,a,function(e){return t[e]}.bind(null,a));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="/",o.oe=function(t){throw console.error(t),t};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=e,u=u.slice();for(var d=0;d<u.length;d++)e(u[d]);var f=l;c.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"05fc":function(t,e,n){},"2a1d":function(t,e,n){"use strict";var a=n("2d6f"),r=n.n(a);r.a},"2d6f":function(t,e,n){},"4f06":function(t,e,n){t.exports=n.p+"../../public/img/headline.a3a71604.jpg"},"56d7":function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var a=n("2b0e"),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("Header",{on:{"toggle-nav":function(e){t.showMobileNav=!t.showMobileNav}}}),n("Navbar",{attrs:{show:t.showMobileNav}}),n("router-view")],1)},i=[],c=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"site-header"},[a("img",{attrs:{src:n("9d64")}}),a("div",{staticClass:"menu-icon",on:{click:function(e){return t.$emit("toggle-nav")}}},[a("div",{staticClass:"bar"}),a("div",{staticClass:"bar"}),a("div",{staticClass:"bar"})])])},s=[],o={name:"site-header"},u=o,l=(n("df4c"),n("2877")),d=Object(l["a"])(u,c,s,!1,null,null,null),f=d.exports,p=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"nav-container",class:{show:t.show}},[a("nav",[a("a",{staticClass:"item"},[t._v("Home")]),a("router-link",{staticClass:"item",attrs:{to:"/bags"}},[t._v("Bags")]),a("router-link",{staticClass:"item",attrs:{to:"/latest"}},[t._v("Latest")]),a("a",{staticClass:"item"},[t._v("Accessories")]),a("a",{staticClass:"item"},[t._v("Sale")]),a("div",{on:{click:function(e){t.cartOpen=!t.cartOpen}}},[t._v("Cart  "),a("img",{attrs:{src:n("daca")}})]),a("Cart",{attrs:{open:t.cartOpen}})],1)])},h=[],v=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("transition",{attrs:{name:"scroll-open"}},[t.open?n("div",{staticClass:"cart"},[n("h3",[t._v("My cart")]),n("div",{staticClass:"item-list"},t._l(t.items,function(e,a){return n("div",{key:a,staticClass:"order-item"},[n("img",{attrs:{src:e.content.images[0].path}}),n("p",{staticClass:"name"},[t._v(t._s(e.content.name))]),n("div",{staticClass:"details"},[n("p",{staticClass:"quantity"},[t._v("Quantity: "+t._s(e.quantity))]),n("p",{staticClass:"price"},[t._v("£"+t._s((e.inventory.price*e.quantity).toFixed(2)))])])])}),0),n("p",[t._v("Subtotal: "+t._s(t.subtotal))]),n("router-link",{attrs:{to:"/checkout"}},[n("button",[t._v("Checkout")])])],1):t._e()])},m=[],b={name:"cart",props:["open"],computed:{items:function(){return this.$store.state.cart.items},subtotal:function(){return this.$store.state.cart.subtotal}}},g=b,_=(n("77ba"),Object(l["a"])(g,v,m,!1,null,null,null)),y=_.exports,C={name:"navbar",props:["show"],data:function(){return{cartOpen:!1}},components:{Cart:y}},k=C,O=(n("2a1d"),Object(l["a"])(k,p,h,!1,null,null,null)),w=O.exports,x={name:"app",components:{Header:f,Navbar:w},data:function(){return{showMobileNav:!1}}},j=x,E=Object(l["a"])(j,r,i,!1,null,null,null),S=E.exports,M=n("8c4f"),P=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"home"},[n("Headline")],1)},$=[],N=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},A=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",{staticClass:"headline"},[a("img",{staticClass:"headline__image",attrs:{src:n("4f06")}}),a("div",{staticClass:"headline__main"},[a("div",{staticClass:"headline__overlay"}),a("div",{staticClass:"headline__content"},[a("h1",{staticClass:"headline__content__title"},[a("em",[t._v("Intriguing")]),t._v(" bags "),a("br"),t._v(" for "),a("em",[t._v("intriguing")]),t._v(" people")])])])])}],q=(n("a7f5"),{}),T=Object(l["a"])(q,N,A,!1,null,null,null),H=T.exports,L={name:"home",components:{Headline:H}},I=L,B=Object(l["a"])(I,P,$,!1,null,null,null),D=B.exports;a["a"].use(M["a"]);var F=new M["a"]({mode:"history",base:"/",routes:[{path:"/",name:"home",component:D},{path:"/latest",name:"latest",component:function(){return Promise.all([n.e("chunk-98cff65e"),n.e("chunk-2d0b59c2")]).then(n.bind(null,"1a40"))}},{path:"/bags",name:"latest",component:function(){return Promise.all([n.e("chunk-98cff65e"),n.e("chunk-6141296a")]).then(n.bind(null,"e43b"))}},{path:"/checkout",name:"checkout review",component:function(){return n.e("chunk-0a0ec6c3").then(n.bind(null,"7cb4"))}}]}),J=(n("20d6"),n("2f62"));a["a"].use(J["a"]);var U=new J["a"].Store({state:{cart:{items:[],subtotal:0},activeOrder:null},mutations:{addToCart:function(t,e){var n=t.cart.items.findIndex(function(t){return t._id===e._id});n>-1?(t.cart.items[n].quantity++,t.cart.subtotal+=e.inventory.price):(e.quantity||(e.quantity=1),t.cart.items.push(e),t.cart.subtotal+=e.inventory.price)},createOrder:function(t,e){t.activeOrder={items:t.cart.items,shippingMethod:null,subtotal:e.subtotal,total:e.subtotal,paymentIntent:e.paymentIntent}},addShippingAddress:function(t,e){t.activeOrder.shippingAddress=e.shippingAddress,t.activeOrder.email=e.email},addShippingMethod:function(t,e){t.activeOrder.shippingMethod=e,t.activeOrder.total=t.activeOrder.subtotal+e.cost},resetOrder:function(t){t.activeOrder=null}},actions:{}}),z=n("7bb1"),K=n("67b0"),Q=n("4a7a"),R=n.n(Q),G=n("bc3a"),V=n.n(G);a["a"].use(z["b"],{events:"change"});var W={custom:{email:{required:"Please provide an email address so we can keep in touch about your order"}}};z["a"].localize("en",W),a["a"].use(K["a"]),a["a"].component("v-select",R.a);var X=V.a.create({baseURL:"/api/"});a["a"].prototype.$axios=X,a["a"].config.productionTip=!1,new a["a"]({router:F,store:U,render:function(t){return t(S)}}).$mount("#app")},"77ba":function(t,e,n){"use strict";var a=n("f67e"),r=n.n(a);r.a},"9d64":function(t,e,n){t.exports=n.p+"../../public/img/logo.c6aff8bd.png"},a7f5:function(t,e,n){"use strict";var a=n("c71f"),r=n.n(a);r.a},c71f:function(t,e,n){},daca:function(t,e,n){t.exports=n.p+"../../public/img/cart.1c6ca9ca.svg"},df4c:function(t,e,n){"use strict";var a=n("05fc"),r=n.n(a);r.a},f67e:function(t,e,n){}});
//# sourceMappingURL=app.4d39c04f.js.map