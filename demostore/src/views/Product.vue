<template>
    <main class="product">
        <div v-if="foundProduct">
            <Carousel :images="foundProduct.content.images" />
            <div class="content">
                <h1 class="title title--primary">{{ foundProduct.content.name }}</h1>
                <p class="price">£{{ foundProduct.inventory.price.toFixed(2) }} GBP</p>
                <p class="out-of-stock" v-if="foundProduct.inventory.totalStock - foundProduct.inventory.inFulfillment < 1">OUT OF STOCK</p>
                <label for="quantity">Quantity</label>
                <div class="add">
                    <input type="number" id="quantity" name="quantity" v-model="quantity">
                    <button :disabled="foundProduct.inventory.totalStock - foundProduct.inventory.inFulfillment < 1" class="button button--oldskool" @click="addToCart(foundProduct)">Add to cart</button>
                </div>
                <hr>
                <p class="description text">
                    {{ foundProduct.content.description }}
                </p>
            </div>
        </div>
    </main>
</template>

<script>
    import Carousel from "@/components/content-sections/Carousel.vue"

    export default {
        name: "product-view",
        props: ["category", "product"],
        inject: ['notyf'],
        components: {
            Carousel
        },
        data() {
            return {
                foundProduct: null,
                quantity: 1
            }
        },
        mounted() {
            this.$axios.get("/products/" + this.category + "/" + this.product)
            .then((res) => {
                this.foundProduct = res.data.product
            })
        },
        methods: {
            addToCart(product) {
                const available = product.inventory.totalStock - product.inventory.inFulfillment
                const existing = this.$store.state.cart.items.find((item) => { return item.product._id === product._id })
                const newTotal = existing ? parseInt(this.quantity, 10) + existing.quantity : parseInt(this.quantity, 10)
                if(newTotal <= available) {
                    this.$store.commit("addToCart", {
                        product: product,
                        quantity: parseInt(this.quantity, 10)
                    })
                    this.notyf.success('Added product to cart');
                } else {
                    this.notyf.error('Whoops, you can only add a maximum of ' + available + " of this product to your cart");
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .product > div {
        @include mq("tablet") {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }
        .title--primary {
            font-size: 3em;
            margin-bottom: 10px;
        }
        .price {
            font-family: "Libre Baskerville", serif;
            font-size: 1.1em;
            margin: 10px 0;
        }
        .out-of-stock {
            color: #d64e4e;
            font-size: 1.6em;
            font-weight: 600;
            margin: 10px 0;
        }
        hr {
            margin: 30px 0;
        }
        label {
            font-family: "Roboto", sans-serif;
            margin-bottom: 6px;
            margin-top: 30px;
            display: block;
        }
        .add {
            input {
                width: 80px;
                margin-right: 10px;
            }
            button {
                padding: 12px 20px;
                &[disabled] {
                    background-color: #d0d0d0 !important;
                }
            }
        }
        .description {
            
        }
    }
</style>