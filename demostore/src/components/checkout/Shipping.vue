<template>
    <div class="left-column">
        <div class="review">
            <div>
                <span>Email</span>
                <span>{{ email }}</span>
                <span @click="$emit('previous-step')">Change</span>
            </div>
            <div>
                <span>Ship to</span>
                <span>{{ address }}</span>
                <span @click="$emit('previous-step')">Change</span>
            </div>
        </div>
        <form @submit.prevent="submit()">
            <div class="shipping">
                <h2>Shipping method</h2>
                <div class="radios">
                    <!--<label for="method1"><input id="method1" type="radio" v-model="selectedMethod" name="method" value="Standard delivery - 3-5 business days"><span>Standard delivery - 3-5 business days</span><span>Free</span></label>-->
                    <!--<label for="method2"><input id="method2" type="radio" v-model="selectedMethod" name="method" value="Express delivery - 1-2 business days"><span>Express delivery - 1-2 business days</span><span>£4.50</span></label>-->
                    <label v-for="(method, index) in shippingMethods" :for="'method' + index">
                        <input :id="'method' + index" type="radio" name="method" :value="method._id" v-model="selectedMethod">
                        <span>{{ method.name + " - " + method.days[0] + "-" + method.days[1] + " business days" }}</span><span>£{{ method.cost.toFixed(2) }}</span>
                    </label>
                </div>
            </div>
            <div class="choices">
                <p @click="$router.back()">< Continue shopping</p>
                <button class="button button--oldskool">Proceed to payment</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: "shipping",
        props: ["email", "address", "method"],
        mounted() {
            this.$axios.get("/shipping-methods")
            .then((res) => {
                this.shippingMethods = res.data
                this.selectedMethod = this.method ? this.method._id : this.shippingMethods[0]._id
            })
            .catch(() => {
                this.$router.push("/")
            })
        },
        data() {
            return {
                selectedMethod: null,
                shippingMethods: [],
            }
        },
        methods: {
            submit() {
                const method = this.shippingMethods.find((method) => { return method._id === this.selectedMethod })
                this.$emit("next-step", method)
            }
        },
    }
</script>

<style lang="scss">
    .shipping {
        width: 100%;
        margin: 35px 0;
        .v-select{
            width: 100%
        }
    }
    .review {
        border: 1px solid #ddd;
        padding: 0 12px;
        border-radius: 5px;
        margin: 20px 0;
        font-family: "Roboto", sans-serif;
        font-size: 0.9em;
        div {
            display: grid;
            grid-template-columns: 80px 1fr 55px;
            grid-column-gap: 10px;
            padding: 12px 0;
            &:nth-of-type(1) {
                border-bottom: 1px solid #ddd;
            }
            span {
                color: #555;
                font-weight: 300;
                &:nth-of-type(2) {
                    color: #333;
                    font-weight: 400;
                    line-height: 19px;
                }
                &:nth-of-type(3) {
                    font-size: 0.9em;
                    color: #000;
                    line-height: 20px;
                    cursor: pointer;
                }
            }
        }
    }
    .radios {
        font-family: "Roboto", sans-serif;
        font-size: 0.9em;
        margin: 18px 0;
        label {
            display: block;
            padding: 13px 12px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-top: 14px;
            margin-bottom: 4px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
                background-color: #efefef;
            }
            span {
                margin: 0 7px;
            }
            span:nth-of-type(2) {
                margin-left: auto;
            }
        }
    }
</style>