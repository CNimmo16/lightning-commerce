<template>
    <main class="latest">
        <h1>Check out our latest T Shirts</h1>
        <ProductGrid />
    </main>
</template>

<script>
    import ProductGrid from "@/components/content-sections/ProductGrid.vue"

    export default {
        name: "latest",
        components: {
            ProductGrid
        },
        data() {
            return {
                products: []
            }
        },
        mounted() {
            this.getProducts()
        },
        methods: {
            getProducts() {
                this.$axios.get("/products", {
                    params: {
                        
                    },
                    // paramsSerializer: function (params) {
                    //     return Qs.stringify(params, {arrayFormat: 'brackets'})
                    // },
                })
            }
        }
    }
</script>

<style lang="scss">
    
</style>