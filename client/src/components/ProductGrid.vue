<template>
    <div class="product-grid">
        <el-container>
            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4" v-for="(product, index) in products" :key="index">
                <el-card :body-style="{ padding: '0px' }">
                    <div class="live-status">
                        <el-switch inactive-text="Disabled" active-text="Live" v-model="product.live" @change="updateLive($event, product)" />
                    </div>
                    <el-carousel v-if="product.content.images.length > 0" height="250px" :autoplay="false">
                        <el-carousel-item v-for="(image, index) in product.content.images" :key="index">
                            <img :src="image.path" class="image">
                        </el-carousel-item>
                    </el-carousel>
                    <PlaceholderImage v-else :height="'250px'" />
                    <div class="card__content">
                        <router-link :to="'/products/' + product._id"><h2>{{ product.content.name }}</h2></router-link>
                        <div class="category">
                            <h3>{{ product.category.name }}</h3>
                            <p>£{{ product.inventory.price.toFixed(2) }}</p>
                        </div>
                        <p>Current available stock: {{ product.inventory.totalStock - product.inventory.inFulfillment }}</p>
                        <p v-if="product.inventory.totalStock - product.inventory.inFulfillment < 1" style="color: #dd6161;">OUT OF STOCK</p>
                        <div class="bottom clearfix">
                            <el-row>
                                <router-link :to="'/products/' + product._id"><el-button size="small" icon="el-icon-edit" round>Edit</el-button></router-link>
                                <el-button type="danger" size="small" icon="el-icon-delete" round @click="deleting = true">Delete</el-button>
                                <el-dialog
                                    :visible.sync="deleting"
                                    width="30%"
                                    :before-close="deleteProduct">
                                    <span slot="title">Permenantly delete <strong>{{ product.content.name }}</strong>?</span>
                                    <span>Are you sure you want to permentantly remove this product from the site? This will remove all data about the product from the database, and is irreversible. To remove the product with the option to relist it later, use the "disable" switch instead.</span>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="deleting = false">Cancel</el-button>
                                        <el-button type="danger" @click="deleteProduct(product, index)">Permenantly delete</el-button>
                                    </span>
                                </el-dialog>
                            </el-row>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-container>
    </div>
</template>

<script>
    import PlaceholderImage from "@/components/PlaceholderImage.vue"

    export default {
        name: "product-grid",
        props: ["products", "loading"],
        data() {
            return {
                deleting: false
            }  
        },
        components: {
            PlaceholderImage
        },
        methods: {
            deleteProduct(product) {
                this.$axios.delete("/products/" + product._id)
                .then(() => {
                    this.$emit("reload")
                    this.$message.success("Permenantly deleted " + product.content.name)
                })
                .catch(() => {
                    this.$message.error("Error deleting " + product.content.name + ". Please contact your system administrator.")
                })
                this.deleting = false;
            },
            updateLive(live, product) {
                this.$axios.put("/products/" + product._id, {
                    toUpdate: 'live',
                    updateWith: live
                })
                .then(() => {
                    const message = live ? "Made live - Product is now visible and available to purchase on customer facing site. To reverse this action, click the slider again." : "Product removed from customer facing site. This item can no longer be added to cart. Any in-cart or completed orders are unaffected. You can reenable it at any time."
                    this.$message.success(message)
                })
                .catch(() => {
                    this.$message.error("Failed to update product status")
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-card {
        margin: 10px;
        .live-status {
            margin: 13px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .el-carousel-item {
            height: 100%;
            width: 100%;
        }
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        h2 {
            margin: 5px 0;
        }
        .category {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 5px;
            margin-bottom: 0px;
            p {
                margin: 0;
                font-weight: 600;
            }
        }
        h3 {
            margin: 0;
        }
        p {
            margin: 15px 0;
        }
    }
    
    .card__content {
        padding: 6%;
    }
</style>