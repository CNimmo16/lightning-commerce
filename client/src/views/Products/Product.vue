<template>
    <div class="view-product">
        <div v-if="product">
        <el-page-header @back="$router.push('/products')" title="back to all products" :content="product.content.name"></el-page-header>
            <h1 class="title title--primary">{{ product.content.name }}</h1>
            <el-form>
                <el-form-item label="Category" prop="category">
                    <el-select v-model="product.category" placeholder="Select categories">
                        <el-option
                        v-for="category in categories"
                        :key="category.id"
                        :label="category.name"
                        :value="category._id">
                        </el-option>
                    </el-select>
                    <el-button type="primary" @click.prevent="update('category', 'category', product.category)">Update category</el-button>
                    <el-button style="margin-left: 20px;" @click.prevent="showNewCategoryForm = true">Or create a new category</el-button>
                </el-form-item>
            </el-form>
            <NewCategoryForm :show="showNewCategoryForm" @created="createdCategory($event)" @discard="showNewCategoryForm = false" />
            <h2 class="title title--secondary">Images</h2>
            <el-carousel v-if="product.content.images.length > 0" height="250px" :autoplay="false">
                <el-carousel-item v-for="(image, index) in product.content.images" :key="index">
                    <img :src="image.path" class="image">
                </el-carousel-item>
            </el-carousel>
            <PlaceholderImage v-else :height="'250px'" />
            <ImageUpload @finishedUpload="" />
            <h2 class="title title--secondary">Price and promotions</h2>
            <div v-if="!changing.price">
                <p>Product currently priced at &nbsp;<strong style="font-size: 1.1em; color: #6d0000;">£{{ product.inventory.price }}</strong></p>
                <el-button @click="changing.price = true">Change price</el-button>
            </div>
            <div v-else>
                <el-form label-position="left" label-width="80px" ref="newPriceForm">
                    <el-form-item label="New price">
                        <!--<el-input-number style="width: 180px;"></el-input-number>-->
                        £ <el-input-number :max="25000" :precision="2" :controls="false" v-model="product.inventory.price" :step="1" style="width: 110px;" />
                    </el-form-item>
                    <el-button @click="update('price', 'inventory.price', product.inventory.price)" type="success">Update price</el-button>
                    <el-button @click="changing.price = false">Cancel</el-button>
                </el-form>
            </div>
            <p>No promotions currently active on this product</p>
            <router-link to="/promotions/new"><el-button type="primary">Create a promotion</el-button></router-link>
            <h2>Inventory</h2>
            <el-table
            :data="inventoryData"
            style="width: 500px">
                <el-table-column
                prop="total"
                label="Total stock">
                </el-table-column>
                <el-table-column
                prop="inFulfillment"
                label="In fulfillment">
                </el-table-column>
                <el-table-column
                prop="available"
                label="Available stock">
                </el-table-column>
            </el-table>
            <router-link :to="'/inventory/new'"><el-button type="primary">Add or remove stock</el-button></router-link>
            <p>Note that <strong>total stock</strong> refers to all physical stock, including stock that is in placed orders that haven't yet been shipped. <strong>In fulfillment</strong> refers to stock in orders that have been placed, but haven't been shipped yet. <strong>Available stock</strong> refers to the remaining stock which is actually available to be ordered - this is the number shown on the public facing site.</p>
            <h2 class="title title--secondary">Orders</h2>
        </div>
    </div>
</template>

<script>
    import NewCategoryForm from "@/components/NewCategoryForm.vue"

    export default {
        name: "product",
        props: ["id"],
        components: {
            NewCategoryForm
        },
        data() {
            return {
                changing: {
                    price: false,
                    name: false,
                    category: false,
                    stock: false,
                },
                categories: [],
                showNewCategoryForm: false,
                product: null,
            }
        },
        computed: {
            inventoryData() {
                return [{
                    total: this.product.inventory.totalStock,
                    available: this.product.inventory.totalStock - this.product.inventory.inFulfillment,
                    inFulfillment: this.product.inventory.inFulfillment
                }]
            }
        },
        mounted() {
            if(this.id.length !== 24) {
                this.$router.push("/products")
                this.$message.error("Whoops, that product doesn't seem to exist. Redirecting to products page.")
            } else {
                this.$emit("set-loading")
                this.$axios.get("/products/" + this.id)
                .then((res) => {
                    this.product = res.data
                    // this.product.price = res.data.inventory.price
                    this.$emit("stop-loading")
                    this.$axios.get("/categories")
                    .then((res) => {
                        this.categories = res.data;
                    })
                    .catch(() => {
                        this.$message.error("Whoops, error loading categories. Please contact the system administrator")
                    });
                })
                .catch(() => {
                    this.$router.push("/products")
                    this.$message.error("Whoops, looks like that product doesn't exist. Redirecting to products page.")
                    this.$emit("stop-loading")
                })
            }
        },
        methods: {
            update(field, toUpdate, updateWith) {
                this.$axios.put("/products/" + this.product._id, {
                    toUpdate: toUpdate,
                    updateWith: updateWith
                })
                .then(() => {
                    this.$message.success(field + " successfully updated. All new orders will use the updated price.")
                    this.changing[field] = false;
                })
                .catch(() => {
                    this.$message.error("Error updating " + field + ". Please contact your system administrator.")
                    // this.newPrice = this.product[toUpdate];
                })
            },
            createdCategory(category) {
                this.categories.push(category);
                this.showNewCategoryForm = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .el-carousel {
        width: 400px;
    }
    h2 {
        margin-top: 50px;
    }
    p {
        font-weight: 300;
        line-height: 1.8;
        font-size: 0.9em;
    }
</style>