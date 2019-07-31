<template>
    <main class="tshirts">
        <h1>Find your perfect T-Shirt</h1>
        <h3>Filter products</h3>
        <Filters @updated="getProducts($event)" :filters="filters" />
        <ProductGrid :products="products" />
    </main>
</template>

<script>
    import ProductGrid from "@/components/content-sections/ProductGrid.vue"
    import Filters from "@/components/content-sections/Filters.vue"

    export default {
        name: "tshirts",
        components: {
            ProductGrid,
            Filters
        },
        data() {
            return {
                products: [],
                filters: []
            }
        },
        mounted() {
            this.getProducts()
        },
        methods: {
            getProducts(filterBy) {
                this.$axios.get("/products", {
                    params: filterBy,
                    // paramsSerializer: function (params) {
                    //     return Qs.stringify(params, {arrayFormat: 'brackets'})
                    // },
                })
                .then((res) => {
                    this.products = res.data.products;
                })
            }
        }
    }
</script>

<style lang="scss">
    
</style>