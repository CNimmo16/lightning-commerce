<template>
    <div class="product-grid">
        <article class="product-card" v-for="(product, index) in products" :key="index">
            <router-link :to="'/' + product.category.slug + '/' + product.content.slug">
                <Carousel :images="product.content.images" />
            </router-link>
            <router-link :to="'/' + product.category.slug + '/' + product.content.slug"><h1>{{ product.content.name }}</h1></router-link>
            <p>£{{ product.inventory.price.toFixed(2) }}</p>
            <button class="button button--oldskool" @click="addItemToCart(product)">Add to cart</button>
        </article>
    </div>
</template>

<script>
    import Carousel from "@/components/content-sections/Carousel.vue"

    export default {
        name: "product-grid",
        components: {
            Carousel
        },
        inject: ['notyf'],
        props: ["products"],
        methods: {
            addItemToCart(product) {
                const available = product.inventory.totalStock - product.inventory.inFulfillment
                const existing = this.$store.state.cart.items.find((item) => { return item.product._id === product._id })
                const newTotal = existing ? 1 + existing.quantity : 1
                if(newTotal <= available) {
                    this.$store.commit("addToCart", {
                        product: product,
                        quantity: 1
                    })
                    this.notyf.success('Added product to cart');
                } else if(available === 0) {
                    this.notyf.error('Sorry, this product is out of stock');
                } else {
                    this.notyf.error('Whoops, you can only add a maximum of ' + available + " of this product to your cart");
                }
            }
        }
    }
</script>

<style lang="scss">
    .product-grid {
        display: grid;
        min-height: 100vh;
        grid-template-columns: 1fr;
        grid-column-gap: 3%;
        grid-row-gap: 25px;
        @include mq("phone") {
            grid-template-columns: 1fr 1fr;
        }
        @include mq("large-tablet") {
            grid-template-columns: 1fr 1fr 1fr 1fr;
        }
        .product-card {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            .image-carousel {
                width: 100%;
                height: 300px;
                .item {
                    margin: 0;
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }
            }
            h1 {
                text-transform: capitalize;
                font-size: 2.15em;
                margin: 15px 0 7px 0;
                color: #333;
            }
            p {
                font-family: "Libre Baskerville";
                font-size: 1.15em;
                /*font-weight: 600;*/
                margin: 0;
                color: #5a5a5a;
            }
            button {
                margin: 10px;
            }
        }
    }
</style>