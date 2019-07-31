<template>
    <transition name="scroll-open">
        <div class="cart" v-if="open">
            <h3>My cart</h3>
            <div class="container">
                <div class="item-list" v-if="items.length > 0">
                    <div class="order-item" v-for="(item, index) in items" :key="index">
                        <img :src="item.product.content.images[0].path">
                        <p class="name">{{ item.product.content.name }}</p>
                        <div class="details">
                            <p class="quantity">Quantity: {{ item.quantity }}</p>
                            <p class="price">£{{ (item.product.inventory.price * item.quantity).toFixed(2) }}</p>
                        </div>
                    </div>
                </div>
                <p v-else style="font-size: 1.5em; margin: 40px 0; text-align: center;">Cart is empty. Get shopping!</p>
                <p class="subtotal">Subtotal: <span>£{{ subtotal.toFixed(2) }}</span></p>
                <a><button @click="requestCheckout" class="button button--oldskool">Checkout</button></a>
                <p v-if="alertVisible" class="alert">Whoops, your cart is empty. Please choose some items before proceeding to checkout.</p>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "cart",
        props: ["open"],
        data() {
            return {
                alertVisible: false
            }
        },
        computed: {
            items() {
                return this.$store.state.cart.items
            },
            subtotal() {
                return this.$store.state.cart.subtotal
            }
        },
        methods: {
            requestCheckout() {
                if(this.$store.state.cart.subtotal > 0) {
                    this.$router.push("/checkout")
                    this.$emit("close")
                } else {
                    this.alertVisible = true
                    window.setTimeout(() => {
                        this.alertVisible = false
                    }, 3000)
                }
            }
        }
    }
</script>

<style lang="scss">
    .cart {
        background-color: #fff;
        border: 1px solid #ccc;
        position: absolute;
        top: 115%;
        width: 300px;
        max-width: 100%;
        height: 500px;
        right: 0;
        z-index: 10;
        overflow: hidden;
        h3 {
            margin: 15px;
            padding-bottom: 7px;
            border-bottom: 2px solid #aaa;
            font-size: 1.9em;
            font-weight: 600;
        }
        .container {
            margin: 15px;
        }
        a {
            display: flex;
            justify-content: flex-end;
            button {
                cursor: pointer;
            }
        }
        .subtotal {
            font-size: 1.7em;
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #ddd;
            margin-top: 20px;
            padding-top: 10px;
            span {
                letter-spacing: 1px;
                font-weight: 600;
            }
        }
        .alert {
            color: #d07373;
            font-family: "Roboto", serif;
            font-size: 0.9em;
        }
    }
    
    .scroll-open-enter, .scroll-open-leave-to {
        height: 0;
    }
    
    .scroll-open-enter-active, .scroll-open-leave-active {
        transition: height 0.3s;
    }
</style>