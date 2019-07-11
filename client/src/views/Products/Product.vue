<template>
    <div class="view-product">
        <div v-if="product">
        <el-page-header @back="$router.push('/products')" title="back to all products" :content="product.content.name"></el-page-header>
            <h1 class="title title--primary title--backgrounded">{{ product.content.name }}</h1>
            <!-- Category -->
            <section class="section">
                <h2 class="title title--secondary">Category</h2>
                <el-form>
                    <el-form-item prop="category">
                        <el-select v-model="categoryId" placeholder="Select categories">
                            <el-option
                            v-for="(category, index) in categories"
                            :key="index"
                            :label="category.name"
                            :value="category._id">
                            </el-option>
                        </el-select>
                        <el-button style="margin-left: 20px;" type="primary" @click.prevent="update('category', 'category', categoryId)">Update category</el-button>
                        <el-button style="margin-left: 20px;" @click.prevent="showNewCategoryForm = true">Or create a new category</el-button>
                    </el-form-item>
                </el-form>
                <NewCategoryForm :show="showNewCategoryForm" @created="createdCategory($event)" @discard="showNewCategoryForm = false" />
            </section>
            <!-- Images -->
            <section class="section">
                <h2 class="title title--secondary">Images</h2>
                <div class="image-grid">
                    <div v-for="(image, index) in product.content.images" :key="index" class="image">
                        <img :src="image.path">
                        <div class="overlay">
                            <el-button type="danger" icon="el-icon-delete" circle @click="deleteImage(image)"></el-button>
                        </div>
                    </div>
                </div>
                <h3 class="title title--tertiary" style="margin-top: 30px;">Upload new image</h3>
                <ImageUpload @finishedUpload="addImageToProduct($event)" :showlist="false" />
            </section>
            <!-- Price and promos -->
            <section class="section">
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
            </section>
            <!-- Inventory -->
            <section class="section">
                <h2 class="title title--secondary">Inventory</h2>
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
            </section>
        </div>
    </div>
</template>

<script>
    import NewCategoryForm from "@/components/NewCategoryForm.vue"
    import ImageUpload from "@/components/ImageUpload.vue"

    export default {
        name: "product",
        props: ["id"],
        components: {
            NewCategoryForm,
            ImageUpload
        },
        data() {
            return {
                changing: {
                    price: false,
                    name: false,
                    category: false,
                    stock: false,
                },
                categoryId: null,
                categories: [],
                showNewCategoryForm: false,
                product: null
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
                this.getProduct()
            }
        },
        methods: {
            getProduct() {
                this.$emit("set-loading")
                this.$axios.get("/products/" + this.id)
                .then((res) => {
                    const product = res.data
                    this.product = product
                    this.categoryId = product.category.id
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
                .catch((err) => {
                    console.log(err)
                    this.$router.push("/products")
                    this.$message.error("Whoops, looks like that product doesn't exist. Redirecting to products page.")
                    this.$emit("stop-loading")
                })
            },
            update(field, toUpdate, updateWith) {
                this.$axios.put("/products/" + this.product._id, {
                    toUpdate: toUpdate,
                    updateWith: updateWith
                })
                .then(() => {
                    this.$message.success(field + " successfully updated.")
                    this.changing[field] = false;
                })
                .catch(() => {
                    this.$message.error("Error updating " + field + ". Please contact your system administrator.")
                })
            },
            createdCategory(category) {
                this.categories.push(category);
                this.showNewCategoryForm = false;
            },
            addImageToProduct(response) {
                this.$axios.put("/products/" + this.product._id + "/images", response)
                .then(() => {
                    this.$message.success("Added new product image.")
                    this.getProduct()
                })
                .catch(() => {
                    this.$message.error("Error adding image. Please contact your system administrator.")
                    this.getProduct()
                })
            },
            deleteImage(image) {
                this.$axios.delete("/products/" + this.product._id + "/images/" + image.filename)
                .then(() => {
                    this.$message.error("Deleted image.")
                    this.getProduct()
                })
                .catch(() => {
                    this.$message.warning("Error deleting image.")
                })
            }
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
    .image-grid {
        display: grid;
        grid-template-columns: 135px 135px 135px 135px 135px;
        grid-column-gap: 20px;
    }
    .image {
        width: 135px;
        height: 135px;
        position: relative;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .overlay {
            display: none;
            @extend %overlay;
            align-items: center;
            justify-content: center;
            background-color: rgba(0,0,0,0.3);
        }
        &:hover {
            .overlay {
                display: flex;
            }
        }
    }
</style>