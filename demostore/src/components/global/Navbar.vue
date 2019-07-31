<template>
    <div class="nav-container" :class="{ show: show }">
        <nav>
            <router-link to="/" class="item">Home</router-link>
            <router-link to="/tshirts" class="item">T-Shirts</router-link>
            <router-link to="/latest" class="item">Latest</router-link>
            <a class="item">Accessories</a>
            <a class="item">Sale</a>
            <div @click="cartOpen = !cartOpen" @close="cartOpen = false" class="cart-button item">Cart &nbsp;<img src="@/assets/icons/cart.svg"></div>
            <Cart :open="cartOpen" />
        </nav>
    </div>
</template>

<script>
    import Cart from '@/components/global/Cart.vue'

    export default {
        name: "navbar",
        props: ["show"],
        data() {
            return {
                cartOpen: false
            }
        },
        components: {
            Cart
        },
    }
</script>

<style lang="scss">
    .nav-container {
        width: 100%;
        margin: 0 auto;
        margin-bottom: 25px;
        display: none;
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
        &.show {
            display: block;
        }
        .cart-button {
            display: flex;
            align-items: center;
            border: none !important;
        }
        @include mq("phone") {
            display: block;
            nav {
                width: 1000px;
                max-width: 100%;
                margin: 0 auto;
                height: 55px;
                display: flex;
                justify-content: space-around;
                align-items: center;
                position: relative;
                .item {
                    cursor: pointer;
                    color: #520000;
                    font-size: 1.7em;
                    font-weight: 600;
                    position: relative;
                    &:hover {
                        border-bottom: 2px solid #520000;
                    }
                }
            }
        }
    }
</style>