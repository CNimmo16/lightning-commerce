(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-98cff65e"],{"00f7":function(t,n,s){"use strict";var e=s("7d51"),o=s.n(e);o.a},"082c":function(t,n,s){"use strict";var e=function(){var t=this,n=t.$createElement,s=t._self._c||n;return s("div",{staticClass:"product-grid"},t._l(t.products,function(n,e){return s("article",{key:e,staticClass:"product-card"},[s("router-link",{attrs:{to:"/"+n.category.slug+"/"+n.content.slug}},[s("Carousel",{attrs:{images:n.content.images}})],1),s("router-link",{attrs:{to:"/"+n.category.slug+"/"+n.content.slug}},[s("h1",[t._v(t._s(n.content.name))])]),s("p",[t._v("£"+t._s(n.inventory.price.toFixed(2)))]),s("button",{staticClass:"button button--oldskool",on:{click:function(s){return t.addItemToCart(n)}}},[t._v("Add to cart")])],1)}),0)},o=[],r=function(){var t=this,n=t.$createElement,s=t._self._c||n;return s("div",{staticClass:"gallery image-carousel"},[t._l(t.images,function(t,n){return s("div",{key:n+"-op",staticClass:"control-operator",attrs:{id:"item-"+n}})}),t._l(t.images,function(t,n){return s("figure",{key:n,staticClass:"item"},[s("img",{attrs:{src:t.path}})])}),s("div",{staticClass:"controls"},t._l(t.images,function(n,e){return s("a",{key:e+"-control",staticClass:"control-button",attrs:{href:"#item-"+e}},[t._v("•")])}),0)],2)},a=[],c={name:"image-carousel",props:["images"]},i=c,u=(s("0b06"),s("2877")),l=Object(u["a"])(i,r,a,!1,null,null,null),d=l.exports,m={name:"product-grid",components:{Carousel:d},props:["products"],methods:{addItemToCart:function(t){this.$store.commit("addToCart",t)}}},p=m,f=(s("00f7"),Object(u["a"])(p,e,o,!1,null,null,null));n["a"]=f.exports},"0b06":function(t,n,s){"use strict";var e=s("2660"),o=s.n(e);o.a},2660:function(t,n,s){},"7d51":function(t,n,s){}}]);
//# sourceMappingURL=chunk-98cff65e.419ea8d4.js.map