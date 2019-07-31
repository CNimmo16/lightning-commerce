<template>
    <div class="view-order">
        <div v-if="order">
            <el-page-header @back="$router.push('/orders')" title="back to all orders" :content="'order #' + order._id.substr(0,5) + '...'"></el-page-header>
            <h1 class="title title--primary">Order <span style="color: #868686; font-size: 0.7em;">#{{ order._id }}</span></h1>
            <div class="order-item">
                <el-row>
                    <el-col :span="16">
                        <h3>Status</h3>
                        <el-steps
                        :active="step" 
                        finish-status="success"
                        :space="200">
                            <el-step :title="step === 0 ? 'Pending payment' : 'Payment'" icon="el-icon-bank-card"></el-step>
                            <el-step :title="step === 1 ? 'Awaiting fulfillment' : 'Fulfillment'" icon="el-icon-s-claim"></el-step>
                            <el-step :title="step === 2 ? 'Fulfilled' : 'Delivery'" icon="el-icon-truck"></el-step>
                        </el-steps>
                    </el-col>
                    <el-col :span="5">
                        <div class="customer">
                            <h3>Customer</h3>
                            <p>Email: {{ order.customer.email }}</p>
                            <el-button>View customer</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-divider />
                <el-row>
                    <el-col :span="14">
                        <div class="items">
                            <h3>Items</h3>
                            <el-table
                            :data="order.items"
                            striped>
                                <el-table-column
                                width="50px">
                                    <template slot-scope="scope">
                                        <img class="product-image" :src="scope.row.product.content.images[0].path">
                                    </template>
                                </el-table-column>
                                <el-table-column
                                prop="product.content.name"
                                width="300px"
                                label="Product">
                                </el-table-column>
                                <el-table-column
                                prop="quantity"
                                width="155px"
                                label="Quantity">
                                </el-table-column>
                                <el-table-column
                                width="155px"
                                label="Unit price">
                                    <template slot-scope="scope">
                                        <span>£{{ scope.row.product.inventory.price }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                width="155px"
                                label="Total">
                                    <template slot-scope="scope">
                                        <span>£{{ scope.row.product.inventory.price * scope.row.quantity }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-row>
                <el-divider />
                <el-row>
                    <el-col :span="4">
                        <div class="address">
                            <h3>Shipping address</h3>
                            <p>{{ order.fulfillment.shippingAddress.firstName }} {{ order.fulfillment.shippingAddress.lastName }}</p>
                            <p>{{ order.fulfillment.shippingAddress.address }}</p>
                            <p>{{ order.fulfillment.shippingAddress.postcode }}</p>
                            <p>{{ order.fulfillment.shippingAddress.city }}</p>
                            <p>{{ order.fulfillment.shippingAddress.country.name }}</p>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="shipping-method">
                            <h3>Shipping Method</h3>
                            <p>{{ order.fulfillment.shippingMethod.name }} - {{ order.fulfillment.shippingMethod.days[0] }}-{{ order.fulfillment.shippingMethod.days[1] }} business days</p>
                            <!--<el-button type="primary">Get postage label</el-button>-->
                        </div>
                    </el-col>
                </el-row>
                <el-divider />
                <el-row>
                    <el-col :span="4">
                        <div class="address">
                            <h3>Billing address</h3>
                            <p>{{ order.customer.billingAddress.firstName }} {{ order.customer.billingAddress.lastName }}</p>
                            <p>{{ order.customer.billingAddress.address }}</p>
                            <p>{{ order.customer.billingAddress.postcode }}</p>
                            <p>{{ order.customer.billingAddress.city }}</p>
                            <p>{{ order.customer.billingAddress.country.name }}</p>
                        </div>
                    </el-col>
                    <el-col :span="7">
                        <div class="payment">
                            <h3>Payment</h3>
                            <div class="summary">
                                <p>Status: <br><strong style="text-transform: capitalize;" class="status" :class="{ paid: order.payment.paymentStatus === 'paid' }">{{ order.payment.paymentStatus }}</strong></p> 
                                <p>Provider: <br><strong style="text-transform: capitalize;">{{ order.payment.provider }}</strong></p>
                                <p>
                                    Method:<br>
                                    <span v-if="order.payment.method === 'card' && order.payment.paymentStatus === 'paid'"><strong>{{ order.payment.paymentCard.brand }}</strong> ending <strong>{{ order.payment.paymentCard.last4 }}</strong></span>
                                    <span v-else-if="order.payment.method === 'card'">Card - unconfirmed</span>
                                    <span v-else>{{ order.payment.method }}</span>
                                </p>
                            </div>
                            <div class="totals">
                                <p><strong>Subtotal: </strong>£{{ order.costs.subtotal.toFixed(2) }}</p>
                                <p><strong>Shipping: </strong>£{{ order.costs.shipping.toFixed(2) }}</p>
                                <p><strong>Total: </strong>£{{ order.costs.grandTotal.toFixed(2) }}</p>
                                <a v-if="order.payment.invoiceURL" :href="order.payment.invoiceURL" target="_blank"><el-button>View invoice</el-button></a>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "product",
        props: ["id"],
        data() {
            return {
                order: null,
            }
        },
        computed: {
            step() {
                switch(this.order.fulfillment.orderStatus) {
                    case "Pending payment":
                        return 0;
                    case "Awaiting fulfillment":
                        return 1;
                    case "Fulfilled":
                        return 2;
                    default:
                        return 0;
                }
            }
        },
        mounted() {
            if(this.id.length !== 24) {
                this.$router.push("/orders")
                this.$message.error("Whoops, that product doesn't seem to exist. Redirecting to products page.")
            } else {
                this.$emit("set-loading")
                this.$axios.get("/orders/" + this.id)
                .then((res) => {
                    this.order = res.data.order
                    this.$emit("stop-loading")
                })
                .catch(() => {
                    this.$router.push("/orders")
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