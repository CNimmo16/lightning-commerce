<template>
    <main class="order-complete">
        <h1>Order complete!</h1>
        <p class="text">Your TipTopTee order is on its way to you. We've emailed confirmation of your order details to <strong>{{ order.email }}</strong>. You can review your order below.</p>
        <h2>My order</h2>
        <div class="order-item" v-for="(item, index) in order.items" :key="index">
            <img :src="item.product.content.images[0].path">
            <p class="name">{{ item.product.content.name }}</p>
            <div class="details">
                <p class="quantity">Quantity: {{ item.quantity }}</p>
                <p class="price">£{{ (item.product.inventory.price * item.quantity).toFixed(2) }} GBP</p>
            </div>
        </div>
        <hr>
        <div class="totals">
            <div><span>Subtotal:</span><span>£{{ order.subtotal.toFixed(2) }} GBP</span></div>
            <div><span>Shipping:</span><span>£{{ order.shippingMethod.cost.toFixed(2) }}</span></div>
        </div>
        <div class="grand-total">
            <span>Total:</span><span>£{{ order.total.toFixed(2) }} GBP</span>
        </div>
        <hr>
        <p class="text"><strong>Shipping method:</strong> {{ order.shippingMethod.name }} - {{ order.shippingMethod.days[0] }}-{{ order.shippingMethod.days[1] }} business days</p>
        <p class="text"><strong>Estimated delivery date:</strong> {{ deliveryEstimate }}</p>
    </main>
</template>

<script>
    export default {
        name: "order-complete",
        computed: {
            order() {
                if(this.$store.state.activeOrder && this.$store.state.activeOrder.complete) {
                    return this.$store.state.activeOrder
                } else {
                    this.$router.push("/")
                }
            },
            deliveryEstimate() {
                const unix = Date.now() + this.order.shippingMethod.days[0] * 8.64e+7
                const d = new Date(unix)
                return d.toDateString()
            }
        }
    }
</script>

<style lang="scss" scoped>
    h2 {
        font-family: "Libre Baskerville";
        margin-top: 45px;
    }
    hr {
        margin: 25px 0;
    }
    .totals, .grand-total {
        font-family: "Roboto";
        line-height: 1.8;
    }
    .totals div, .grand-total {
        display: flex;
        justify-content: space-between;
        margin: 7px 0;
    }
</style>