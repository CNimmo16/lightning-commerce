(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-10d920ea"],{"33e0":function(t,e,r){"use strict";r.r(e);var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("main",{staticClass:"tshirts"},[r("h1",[t._v("Find your perfect T-Shirt")]),r("h3",[t._v("Filter products")]),r("Filters",{attrs:{filters:t.filters},on:{updated:function(e){return t.getProducts(e)}}}),r("ProductGrid",{attrs:{products:t.products}})],1)},n=[],c=r("082c"),o=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"filters"},[r("v-select",{attrs:{multiple:"",options:t.filters.categories,placeholder:"Product type"},model:{value:t.requested.category,callback:function(e){t.$set(t.requested,"category",e)},expression:"requested.category"}})],1)},u=[],a=void 0,i={name:"filters",props:["filters"],data:function(){return{requested:{category:[]}}},watch:{requested:{deep:!0,handler:function(){a.$emit("updated",a.requested)}}}},d=i,l=(r("68df"),r("2877")),p=Object(l["a"])(d,o,u,!1,null,"70050aca",null),f=p.exports,h={name:"tshirts",components:{ProductGrid:c["a"],Filters:f},data:function(){return{products:[],filters:[]}},mounted:function(){this.getProducts()},methods:{getProducts:function(t){var e=this;this.$axios.get("/products",{params:t}).then(function(t){console.log(t),e.products=t.data.products})}}},m=h,v=Object(l["a"])(m,s,n,!1,null,null,null);e["default"]=v.exports},"68df":function(t,e,r){"use strict";var s=r("d024"),n=r.n(s);n.a},d024:function(t,e,r){}}]);
//# sourceMappingURL=chunk-10d920ea.8e182da2.js.map