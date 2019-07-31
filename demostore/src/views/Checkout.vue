<template>
    <main class="review-order">
        <h1>Checkout</h1>
        <div class="breadcrumb">
            <span @click="navigateTo(0)" :class="{ active: step === 0 }">Details</span> > 
            <span @click="navigateTo(1)" :class="{ active: step === 1 }">Shipping</span> > 
            <span @click="navigateTo(2)" :class="{ active: step === 2 }">Payment</span>
        </div>
        <div class="order-grid">
            <CustomerInfo :emailInit="order.email" :addressInit="order.shippingAddress" v-if="step === 0" @next-step="proceedToShipping($event)" />
            <Shipping :email="order.email" :address="formattedAddress" :method="order.shippingMethod" v-else-if="step === 1" @next-step="proceedToPayment($event)" @previous-step="step = 0" />
            <Payment :email="order.email" :formattedAddress="formattedAddress" :shippingAddress="order.shippingAddress" :method="order.shippingMethod" v-else-if="step === 2" />
            <div class="right-column">
                <h2>My order</h2>
                <div class="order-item" v-for="(item, index) in items" :key="index">
                    <img :src="item.product.content.images[0].path">
                    <p class="name">{{ item.product.content.name }}</p>
                    <div class="details">
                        <p class="quantity">Quantity: {{ item.quantity }}</p>
                        <p class="price">£{{ (item.product.inventory.price * item.quantity).toFixed(2) }} GBP</p>
                    </div>
                </div>
                <div class="discounts">
                    <input type="text" placeholder="Gift card or discount code">
                    <button>Apply</button>
                </div>
                <div class="totals" v-if="activeOrder">
                    <div><span>Subtotal:</span><span>£{{ activeOrder.subtotal.toFixed(2) }} GBP</span></div>
                    <div><span>Shipping:</span><span>{{ order.shippingMethod ? (order.shippingMethod.cost > 0 ? "£" + order.shippingMethod.cost.toFixed(2) + " GBP" : "Free" ) : "calculated at next step" }}</span></div>
                </div>
                <div class="grand-total" v-if="activeOrder">
                    <span>Total:</span><span>£{{ activeOrder.total.toFixed(2) }} GBP</span>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    import CustomerInfo from "@/components/checkout/CustomerInfo.vue"
    import Shipping from "@/components/checkout/Shipping.vue"
    import Payment from "@/components/checkout/Payment.vue"

    export default {
        name: "checkout",
        data() {
            return {
                step: 0,
                order: {
                    shippingMethod: null,
                    shippingAddress: null,
                    email: null
                }
            }
        },
        components: {
            Shipping,
            CustomerInfo,
            Payment
        },
        mounted() {
            const subtotal = this.$store.state.cart.subtotal;
            let data = {
                amount: subtotal * 100,
                currency: "gbp"
            }
            const method = this.$store.state.activeOrder ? "put" : "post"
            if(this.$store.state.activeOrder) {
                data.id = this.$store.state.activeOrder.paymentIntent.id
            }
            this.$axios({
                method: method,
                url: "/orders/intent", 
                data: data
            })
            .then((res) => {
                this.$store.commit("createOrder", {
                    paymentIntent: res.data.paymentIntent ? res.data.paymentIntent : this.$store.state.activeOrder.paymentIntent,
                    subtotal: subtotal
                })
            })
            .catch(() => {
                this.$router.push("/")
            })
        },
        computed: {
            items() {
                return this.$store.state.cart.items
            },
            subtotal() {
                return this.$store.state.cart.subtotal
            },
            activeOrder() {
                return this.$store.state.activeOrder
            },
            formattedAddress() {
                if(this.order.shippingAddress) {
                    const c = this.order.shippingAddress
                    let toReturn = c.flatNumber ? c.flatNumber + ", " : ""
                    return toReturn + c.address + ", " + c.city + ", " + c.postcode + ", " + c.country.name
                } else {
                    return null
                }
            }
        },
        methods: {
            proceedToShipping(details) {
                this.order.shippingAddress = details.shippingAddress
                this.order.email = details.email
                this.$store.commit("addShippingAddress", {
                    shippingAddress: details.shippingAddress,
                    email: details.email
                })
                this.step = 1
            },
            proceedToPayment(shippingMethod) {
                this.order.shippingMethod = shippingMethod
                this.step = 2
                if(shippingMethod.cost > 0) {
                    this.$axios.put("/orders/intent", {
                        id: this.$store.state.activeOrder.paymentIntent.id,
                        amount: this.$store.state.activeOrder.total * 100 + shippingMethod.cost * 100,
                        currency: "gbp"
                    })
                    .then((res) => {
                        this.$store.commit("addShippingMethod", shippingMethod)
                    })
                    .catch(() => {
                        this.$store.commit("resetOrder")
                        this.$router.push("/")
                    })
                } else {
                    this.$store.commit("addShippingMethod", shippingMethod)
                }
            },
            navigateTo(step) {
                switch(step) {
                    case 0:
                        this.step = 0;
                        break;
                    case 1:
                        if(this.order.email && this.order.shippingAddress) {
                            this.step = 1;
                            break;
                        }
                    case 2:
                        if(this.order.shippingMethod) {
                            this.step = 2;
                            break;
                        }
                }
            }
        }
    }
</script>

<style lang="scss">
    .review-order {
        max-width: 1100px;
        > h1 {
            margin-top: 0;
        }
        .breadcrumb {
            font-family: "Roboto", sans-serif;
            font-size: 0.95em;
            margin: 20px 0;
            color: #666;
            span {
                margin: 0 5px;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
            .active {
                color: #222;
                font-weight: 500;
            }
        }
    }

    .order-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-column-gap: 7%;
        .contact, .address {
            flex-direction: column;
            margin-bottom: 30px;
            font-family: "Roboto", sans-serif;
        }
        .address {
            margin-bottom: 10px;
        }
        .choices {
            display: flex;
            justify-content: space-between;
            margin-bottom: 70px;
            p {
                margin: 13px 0;
                cursor: pointer;
                font-size: 0.9em;
            }
            button {
                cursor: pointer;
                font-size: 1em;
                letter-spacing: 0.8px;
                font-family: "Roboto";
                font-weight: 300;
            }
        }
        .address, .contact {
            > input {
                width: 100%;
                box-sizing: border-box;
                margin-top: 12px;
                margin-bottom: 4px;
                &.half {
                    width: calc(50% - 8px);
                    &:nth-of-type(2n) {
                        margin-left: 16px;
                    }
                }
            }
        }
        .v-select {
            margin-top: 12px;
            margin-bottom: 4px;
            width: calc(50% - 8px);
            float: left;
            margin-right: 16px;
            &.error {
                .vs__dropdown-toggle {
                    border: 2px solid #e25959;
                }
            }
            .vs__dropdown-toggle {
                padding: 8px 3px;
            }
            ::placeholder {
                color: #6d6d6d;
            }
            .vs__dropdown-menu {
                max-height: 200px;
            }
        }
        h2 {
            font-size: 1.1em;
            font-weight: 300;
            margin-bottom: 20px;
            font-family: "Roboto", sans-serif;
            span {
                display: block;
                float: right;
                font-size: 0.85em;
                line-height: 1.8;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        p {
            font-family: "Roboto";
            font-size: 0.9em;
            font-weight: 300;
            margin-top: 10px;
            margin-bottom: 25px;
        }
        .order-item {
            margin: 25px 0;
        }
        .discounts {
            display: flex;
            margin: 35px 0;
            input {
                width: 100%;
            }
            button {
                width: 150px;
                margin-left: 16px;
                border-radius: 5px;
                background-color: #ccc;
                color: #fff;
                border: none;
                height: 44px;
                font-family: "Roboto", sans-serif;
                font-size: 1em;
                cursor: pointer;
                &.available {
                    background-color: #d8e8fb;
                    /*border: 2px solid #b6d2f3;*/
                    color: #000;
                    font-weight: 500;
                }
            }
        }
        .totals {
            margin: 35px 0;
            div {
                font-family: "Roboto", sans-serif;
                font-size: 0.9em;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                color: #333;
                span:nth-child(2) {
                    color: #333;
                    font-weight: 500;
                }
            }
        }
        .grand-total {
            display: flex;
            justify-content: space-between;
            font-family: "Roboto", sans-serif;
            font-size: 1.2em;
            span:nth-child(2) {
                color: #333;
                font-weight: 500;
            }
        }
    }
</style>