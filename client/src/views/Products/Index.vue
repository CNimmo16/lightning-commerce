<template>
    <div class="products">
        <h1 class="title title--primary title--backgrounded">Products</h1>
        <section class="section">
            <h3 class="title title--tertiary">Filter products</h3>
            <div class="options">
                <div class="filters">
                    <el-form :inline="true">
                        <el-form-item label="Category">
                            <el-select v-model="selectedCategories" multiple placeholder="Select categories" @change="getProducts()">
                                <el-option
                                v-for="(category, index) in categories"
                                :key="index"
                                :label="category.name"
                                :value="category._id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Price range">
                            <el-slider
                            @change="getProducts()"
                            v-model="priceRange"
                            range
                            :step="5"
                            :max="500">
                            </el-slider>
                        </el-form-item>
                    </el-form>
                </div>
                <router-link to="/products/new">
                    <el-button rounded type="success">New Product</el-button>
                </router-link>
            </div>
        </section>
        <section class="section">
            <ProductGrid :products="products" v-if="products.length > 0" @reload="getProducts()" />
            <div v-else style="width: 100%; display: flex; justify-content: center; padding-top: 70px;"><p class="title title--secondary">Whoops, no products found</p></div>
            <el-pagination
                layout="prev, pager, next"
                @current-change="page = $event - 1"
                :hide-on-single-page=true
                :page-count="totalPages">
            </el-pagination>
        </section>
    </div>
</template>

<script>
    import ProductGrid from "@/components/ProductGrid.vue"

    export default {
        name: "products",
        data() {
            return {
                selectedCategories: [],
                categories: [],
                priceRange: [0, 500],
                products: [],
                totalPages: null,
                page: 0,
            }
        },
        components: {
            ProductGrid
        },
        watch: {
            page() {
                this.getProducts();
            }
        },
        mounted() {
            this.$emit("set-loading")
            this.getProducts(true)
        },
        methods: {
            getProducts(setCategories) {
                // add page query 
                let queryString = "?page=" + this.page
                // add category filter query
                this.selectedCategories.forEach((category) => {
                    queryString = queryString + "&category=" + category
                });
                // add price range filter query
                queryString = queryString + "&price=" + this.priceRange[0] + "&price=" + this.priceRange[1]
                // send request
                this.$axios.get("/products" + queryString)
                .then((res) => {
                    if(setCategories) {
                        this.categories = res.data.categories;
                        this.selectedCategories = res.data.categories.map((category) => {return category._id});
                    }
                    this.products = res.data.products;
                    this.totalPages = res.data.pages;
                    window.document.getElementsByClassName("el-main")[0].scroll(0,0)
                    this.$emit("stop-loading")
                })
                .catch(() => {
                    this.$message.error("Error loading products. Please contact system administrator")
                    this.$emit("stop-loading")
                })
            }
        }
    }
</script>

<style lang="scss">
    main {
        background-color: $palette-background-blue;
    }

    .options {
        display: flex;
        justify-content: space-between;
        .el-form-item {
            margin-right: 40px;
            margin-bottom: 7px;
        }
        .el-slider {
            width: 200px;
        }
    }
</style>