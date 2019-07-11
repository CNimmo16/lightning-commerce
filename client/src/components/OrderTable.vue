<template>
    <el-table
    :data="orders"
    :row-class-name="'clickable-row'"
    @row-click="rowClicked($event)"
    stripe>
        <el-table-column
        label="Order ID"
        width="135px">
            <template slot-scope="scope">
                <span>#...{{ scope.row._id.substr(19) }}</span>
            </template>
        </el-table-column>
        <el-table-column
        prop="date"
        label="Date"
        width="155px">
        </el-table-column>
        <el-table-column
        label="Customer"
        width="160px">
            <template slot-scope="scope">
                <span>{{ scope.row.fulfillment.shippingAddress.firstName }} {{ scope.row.fulfillment.shippingAddress.lastName }}</span>
            </template>
        </el-table-column>
        <el-table-column
        prop="numOfItems"
        label="No. of items"
        width="130px">
        </el-table-column>
        <!-- <el-table-column
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
 -->        <el-table-column
        label="Total"
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
</template>

<script>
    const moment = require("moment")
    
    export default {
        name: "order-table",
        props: ["ordersRaw"],
        computed: {
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
        methods: {
            rowClicked(row) {
                this.$router.push("/orders/" + row._id)
            },
        }
    }
</script>