<template>
    <div class="fulfillment-wizard">
        <h1 class="title title--primary title--backgrounded">Fulfillment Wizard</h1>
        
        <div class="empty"  v-if="orders.length === 0">
            <p>No outstanding orders awaiting fulfillment. Sit back and relax!</p>
        </div>
        <div class="wizard" v-else>
            <div class="overview">
                <p>
                    <span>{{ currentOrder }} orders fulfilled</span>
                    <span>{{ orders.length - currentOrder }} orders remaining</span>
                </p>
                <el-progress :percentage="(currentOrder / orders.length * 100)" :show-text="false"></el-progress>
            </div>
            <el-carousel indicator-position="none" arrow="never" :autoplay="false" height="1300px" ref="order-carousel" :loop="false">
                <el-carousel-item v-for="(order, index) in orders" :key="index">
                    <div class="order-item">
                        <el-row>
                            <el-col :span="24">
                                <div class="inner-cell header">
                                    <div class="left">
                                        <h2 class="title title--secondary">Order &nbsp;<span style="color: #444; font-size: 0.7em">#{{ order._id }}</span></h2>
                                        <p class="summary" v-if="getRawTimeRemaining(order.date, order.fulfillment.shippingMethod.targetHours) > 0">
                                            <span style="color: red; font-weight: 500;" v-if="getRawTimeRemaining(order.date, order.fulfillment.shippingMethod.targetHours) < 3600000">URGENT &nbsp;</span>
                                            <strong>
                                                <i class="el-icon-timer"></i>
                                                {{ getTimeRemaining(order.date, order.fulfillment.shippingMethod.targetHours) }}
                                            </strong>
                                            until fulfillment deadline
                                            (order placed 
                                            <strong>{{ getAgo(order.date) }} </strong>)
                                        </p>
                                        <p class="summary" v-else>
                                            <span style="color: red; font-weight: 500;">URGENT - OVERDUE &nbsp;</span>
                                            <strong>
                                                <i class="el-icon-timer"></i>
                                                {{ getTimeRemaining(order.date, order.fulfillment.shippingMethod.targetHours).substr(1) }}
                                            </strong>
                                            passed since fulfillment deadline
                                            (order placed 
                                            <strong>{{ getAgo(order.date) }} </strong>)
                                        </p>
                                    </div>
                                    <el-steps align-center
                                    :active="order.fulfillment.orderStatus === 'Awaiting fulfillment' ? 1 : 2" 
                                    finish-status="success">
                                        <el-step title="Payment" icon="el-icon-bank-card"></el-step>
                                        <el-step title="Fulfillment" icon="el-icon-s-claim"></el-step>
                                        <el-step title="Delivery" icon="el-icon-truck"></el-step>
                                    </el-steps>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="16">
                                <div class="inner-cell items">
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
                                        label="Quantity">
                                        </el-table-column>
                                        <el-table-column
                                        label="Unit price">
                                            <template slot-scope="scope">
                                                <span>£{{ scope.row.product.inventory.price }}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                        label="Total">
                                            <template slot-scope="scope">
                                                <span>£{{ scope.row.product.inventory.price * scope.row.quantity }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="inner-cell address">
                                    <h3>Shipping address</h3>
                                    <p>{{ order.fulfillment.shippingAddress.firstName }} {{ order.fulfillment.shippingAddress.lastName }}</p>
                                    <p>{{ order.fulfillment.shippingAddress.address }}</p>
                                    <p>{{ order.fulfillment.shippingAddress.postcode }}</p>
                                    <p>{{ order.fulfillment.shippingAddress.city }}</p>
                                    <p>{{ order.fulfillment.shippingAddress.country.name }}</p>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <div class="inner-cell shipping-method">
                                    <h3>Shipping</h3>
                                    <p>{{ order.fulfillment.shippingMethod.name }} - {{ order.fulfillment.shippingMethod.days[0] }}-{{ order.fulfillment.shippingMethod.days[1] }} business days</p>
                                    <el-button type="primary">Get postage label</el-button>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="inner-cell payment">
                                    <h3>Payment</h3>
                                    <div class="summary">
                                        <p>Status: <br><strong style="text-transform: capitalize;" class="status" :class="{ paid: order.payment.paymentStatus === 'paid' }">{{ order.payment.paymentStatus }}</strong></p>
                                        <p>Provider: <br><strong style="text-transform: capitalize;">{{ order.payment.provider }}</strong></p>
                                        <p>
                                            Method:<br>
                                            <span v-if="order.payment.method === 'card'"><strong>{{ order.payment.paymentCard.brand }}</strong> ending <strong>{{ order.payment.paymentCard.last4 }}</strong></span>
                                        </p>
                                    </div>
                                    <el-divider />
                                    <div class="totals">
                                        <p><strong>Subtotal: </strong>£{{ order.costs.subtotal.toFixed(2) }}</p>
                                        <p><strong>Shipping: </strong>£{{ order.costs.shipping.toFixed(2) }}</p>
                                        <p><strong>Total: </strong>£{{ order.costs.grandTotal.toFixed(2) }}</p>
                                        <a v-if="order.payment.invoiceURL" :href="order.payment.invoiceURL" target="_blank"><el-button>View invoice</el-button></a>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="inner-cell confirm">
                                    <el-button :disabled="currentOrder < 1" type="warning" @click="previousOrder()"><i class="el-icon-arrow-left"></i>Return to previous order</el-button>
                                    <el-button v-if="currentOrder < orders.length - 1" type="success" @click="nextOrder()" :loading="loading">Mark as fulfilled and move onto next order<i class="el-icon-arrow-right"></i></el-button>
                                    <el-button v-else :disabled="currentOrder >= orders.length" type="success" @click="finishWizard()" :loading="loading">Mark as fulfilled and finish wizard<i class="el-icon-arrow-right"></i></el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
    const moment = require('moment');

    export default {
        name: "fulfillment",
        methods: {
            getAgo(date) {
                return moment(date).fromNow();
            },
            getRawTimeRemaining(placed, targetHours) {
                placed = new Date(placed)
                const targetUnix = placed.getTime() + targetHours * 3600000
                return targetUnix - Date.now();
            },
            getTimeRemaining(placed, targetHours) {
                const remaining = this.getRawTimeRemaining(placed, targetHours);
                if(Math.abs(remaining) > 3600000) {
                    return Math.floor(remaining / 3600000) + " hours"
                } else {
                    return Math.floor(remaining / 60000) + " minutes";
                }
            },
            finishWizard() {
                
            },
            previousOrder() {
                this.loading = true;
                if(this.currentOrder > 0) {
                    this.$axios.put("/orders/" + this.orders[this.currentOrder-1]._id, {
                        status: "Awaiting fulfillment"
                    })
                    .then(() => {
                        this.$refs["order-carousel"].prev()
                        this.currentOrder --;
                        this.orders[this.currentOrder].fulfillment.orderStatus = "Awaiting fulfillment"
                        this.loading = false;
                    })
                    .catch(() => {
                        this.$message.error("Couldn't return to previous order. Please contact your system administrator.");
                        this.loading = false;
                    })
                }
            },
            nextOrder() {
                if(this.currentOrder < this.orders.length - 1) {
                    this.loading = true;
                    this.$axios.put("/orders/" + this.orders[this.currentOrder]._id, {
                        status: "Fulfilled"
                    })
                    .then(() => {
                        this.orders[this.currentOrder].fulfillment.orderStatus = "Fulfilled"
                        this.loading = false;
                        window.setTimeout(() => {
                            this.$refs["order-carousel"].next()
                            this.currentOrder ++
                        }, 400)
                    })
                    .catch(() => {
                        this.$message.error("Couldn't fulfill order. Please contact your system administrator.");
                        this.loading = false;
                    })
                }
            }
        },
        data() {
            return {
                currentOrder: 0,
                loading: false,
                orders: [],
                urgentCount: 5
            }
        },
        mounted() {
            this.$emit("set-loading");
            this.$axios.get("/orders/fulfillment")
            .then(({data}) => {
                this.orders = data.orders;
                this.$emit("stop-loading")
            })
            .catch(() => {
                this.$message.error("Error loading fulfillment wizard. Please contact your system administrator. For urgent order management, please use the All Orders page.")
                this.$emit("stop-loading")
            })
        }
    }
</script>

<style lang="scss">
    .product-image {
        width: 50px;
        height: 50px;
        object-fit: contain;
    }

    .wizard {
        background-color: $palette-background-blue;
        border-radius: 15px;
        max-width: 1100px;
        margin-top: 25px;
        .overview {
            background-color: #fff;
            border-radius: 10px;
            margin: 4px;
            padding: 10px 15px;
            margin-bottom: 22px;
            p {
                margin: 10px 0; 
                font-size: 1.05em;
                letter-spacing: 0.02em;
                display: flex;
                justify-content: space-between;
            }
            .el-progress {
                min-height: 8px;
                margin-bottom: 12px;
            }
        }
    }
    .order-item {
        .header {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            .el-steps {
                padding-top: 15px;
            }
        }
        .inner-cell {
            background-color: #fff;
            margin: 4px;
            padding: 15px;
            height: 100%;
        }
        h3 {
            font-weight: 500;
            margin: 12px 0;
        }
        h2 {
            margin: 10px 0;
        }
        p.summary {
            margin: 10px 0;
        }
        .address p {
            font-size: 1em;
            margin: 7px 0;
        }
        .shipping-method {
            height: 240px;
            border-bottom-left-radius: 10px;
        }
        .payment {
            height: 240px;
            border-bottom-right-radius: 10px;
            .summary {
                display: flex;
                p {
                    margin: 0px 40px 5px 0;
                    line-height: 1.6;
                    color: #666;
                    strong {
                        color: #0c0c0c;
                        &.status {
                            color: #e88100;
                            &.paid {
                                color: #5daf34;
                            }
                        }
                    }
                }
            }
            .totals {
                display: grid;
                grid-template-columns: 70% 30%;
                p {
                    grid-column: 1 / 2;
                    margin: 7px 0;
                }
                a {
                    grid-column: 2 / 3;
                    grid-row: 1 / 4;
                }
            }
            .el-divider {
                margin: 15px 0;
            }
        }
        .confirm {
            background-color: transparent;
            .el-button {
                font-size: 1.1em;
                padding: 15px 25px;
                display: block;
                line-height: 1.3;
                float: left;
                i {
                    margin: 0 7px;
                    font-size: 1.1em;
                    font-weight: 900;
                }
                &:nth-of-type(2) {
                    float: right;
                }
            }
        }
    }
</style>