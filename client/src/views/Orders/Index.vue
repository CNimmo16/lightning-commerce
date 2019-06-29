<template>
    <div class="orders">
        <h1 class="title title--primary">Orders</h1>
        <el-alert
        v-if="toFulfillCount > 0"
        type="success"
        :closable="false">
            <p slot="title">You have {{ toFulfillCount }} order{{ toFulfillCount > 1 ? 's' : "" }} awaiting fulfillment. &nbsp; <router-link to="/fulfillment"><el-button type="primary">Go to fulfillment wizard</el-button></router-link></p>
        </el-alert>
        <el-table
        :data="orders"
        :row-class-name="'clickable-row'"
        @row-click="rowClicked($event)"
        striped>
            <el-table-column
            label="Order ID"
            width="135px">
                <template slot-scope="scope">
                    <span>...{{ scope.row._id.substr(14) }}</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="date"
            label="Order placed"
            width="155px">
            </el-table-column>
            <el-table-column
            label="Customer"
            width="180px">
                <template slot-scope="scope">
                    <span>{{ scope.row.fulfillment.shippingAddress.firstName }} {{ scope.row.fulfillment.shippingAddress.lastName }}</span>
                </template>
            </el-table-column>
            <el-table-column
            prop="numOfItems"
            label="No. of items"
            width="130px">
            </el-table-column>
            <el-table-column
            label="Subtotal"
            width="130px">
                <template slot-scope="scope">
                    <span>£{{ scope.row.costs.subtotal.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="Shipping method"
            width="200px">
                <template slot-scope="scope">
                    <span>{{ scope.row.fulfillment.shippingMethod.name }} - £{{ scope.row.costs.shipping.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="Total paid"
            width="150px">
                <template slot-scope="scope">
                    <span>£{{ scope.row.costs.grandTotal.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="Payment"
            width="200px">
                <template slot-scope="scope">
                    <p style="margin: 4px 0;">
                        <span v-if="scope.row.payment.method === 'card' && scope.row.payment.paymentCard.last4">{{ scope.row.payment.paymentCard.brand }} ending {{ scope.row.payment.paymentCard.last4 }}</span>
                        <span v-else-if="scope.row.payment.method === 'card'">Card - details unconfirmed</span>
                        <span v-else>Manual payment - cash or other</span>
                    </p>
                    <p class="payment-status" 
                    :class="{ pending: scope.row.payment.paymentStatus === 'pending', paid: scope.row.payment.paymentStatus === 'paid' }">
                        {{ scope.row.payment.paymentStatus }}
                    </p>
                </template>
            </el-table-column>
            <el-table-column
            label="Order status"
            width="280px">
                <template slot-scope="scope">
                    <span class="order-status" :class="{ action: scope.row.fulfillment.orderStatus === 'Awaiting fulfillment' }">{{ scope.row.fulfillment.orderStatus }}</span>
                    <!--<el-button type="danger" size="mini" v-if="scope.row.fulfillment.orderStatus === 'Awaiting fulfillment'" style="margin-top: 5px;">Go to fulfillment</el-button>-->
                    <span v-if="scope.row.fulfillment.orderStatus === 'Awaiting fulfillment'"><br>{{ scope.row.timeRemaining }} until fulfillment deadline</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            @current-change="page = $event - 1"
            :hide-on-single-page=true
            :page-count="totalPages">
        </el-pagination>
    </div>
</template>

<script>
    const moment = require("moment")

    export default {
        name: "orders",
        data() {
            return {
                ordersRaw: [],
                activeNames: ["1"],
                page: 0,
                totalPages: null,
            }
        },
        computed: {
            toFulfillCount() {
                return this.orders.filter((order) => {
                    return order.fulfillment.orderStatus === "Awaiting fulfillment";
                }).length
            },
            orders() {
                return this.ordersRaw.map((order) => {
                    const d = new Date(order.date)
                    if(Date.now() - d.getTime() < 3.6e+6) {
                        order.date = moment(d).fromNow();
                    } else if(Date.now() - d.getTime() < 1.728e+8) {
                        order.date = moment(d).calendar();
                    } else {
                        order.date = moment(d).format('MMMM Do YYYY')
                    }
                    const a = order.fulfillment.shippingAddress
                    let firstLine = a.address
                    if(a.flatNumber) { firstLine = a.flatNumber + ", " + firstLine }
                    if(a.company) { firstLine = a.company + ", " + firstLine }
                    order.shippingAddress = a.firstName + " " + a.lastName + ", " + firstLine + ", " + a.postcode + ", " + a.city + ", " + a.country.name
                    order.numOfItems = order.items.reduce((accumulator, item) => {
                        return accumulator + item.quantity
                    }, 0)
                    
                    if(order.fulfillment.orderStatus === "Awaiting fulfillment") {
                        const targetUnix = d.getTime() + order.fulfillment.shippingMethod.targetHours * 3600000
                        const remaining = (targetUnix - Date.now());
                        if(Math.abs(remaining) > 3600000) {
                            order.timeRemaining = Math.floor(remaining / 3600000) + " hours"
                        } else {
                            order.timeRemaining = Math.floor(remaining / 60000) + " minutes";
                        }
                    }
                    return order
                })
            }
        },
        watch: {
            page() {
                this.getOrders();
            }
        },
        mounted() {
            this.$emit("set-loading")
            this.getOrders();
        },
        methods: {
            rowClicked(row) {
                this.$router.push("/orders/" + row._id)
            },
            getOrders() {
                // add page query 
                let queryString = "?page=" + this.page
                // // add category filter query
                // this.selectedCategories.forEach((category) => {
                //     queryString = queryString + "&category=" + category
                // });
                // // add price range filter query
                // queryString = queryString + "&price=" + this.priceRange[0] + "&price=" + this.priceRange[1]
                // send request
                this.$axios.get("/orders" + queryString)
                .then((res) => {
                    this.ordersRaw = res.data.orders;
                    this.totalPages = res.data.pages;
                    window.document.getElementsByClassName("el-main")[0].scroll(0,0)
                    this.$emit("stop-loading")
                })
                .catch(() => {
                    this.$message.error("Error loading orders. Please contact your system administrator")
                    this.$emit("stop-loading")
                })
            },
        }
    }
</script>

<style lang="scss">
    .clickable-row {
        cursor: pointer;
        &:hover {
            background-color: rgb(217, 236, 255);
            > td {
                background-color: transparent !important;
            }
        }
    }

    .payment-status {
        margin: 4px 40px;
        font-weight: 600;
        text-align: center;
        background-color: #aaa;
        color: #fff;
        &.pending {
            background-color: #d88c00;
        }
        &.paid {
            background-color: #18dc00
        }
    }
    
    .order-status {
        font-weight: 600; 
        font-size: 1.05em;
        &.action {
            color: #f56c6c;
        }
    }
</style>