<template>
    <div class="setup-wizard-start">
        <h1 class="title title--primary title--backgrounded">Congratulations!</h1>
        <section class="section">
            <p>Lightning Commerce has been initialized on your server with the admin login details you entered in the previous step. You can now begin setting up the essentials, then we'll show you the way around your admin dashboard.</p>
            <h2 class="title title--secondary">Let's get you set up.</h2>
            <p>First, please select a payment service provider from the list below. You'll need to create an account with the payments provider seperately, but we can help guide you through that if you don't already have one.</p>
            <div class="gateway-list">
                <el-card shadow="hover" :class="{ selected: gateway === 'stripe' }">
                    <div @click="gateway = 'stripe'" class="gateway" :class="{ selected: gateway === 'stripe' }">
                        <img src="@/assets/images/gateways/stripe-logo.png">
                        <p>Stripe</p>
                    </div>
                </el-card>
                <el-card shadow="hover" :class="{ selected: gateway === 'braintree' }" >
                    <div class="gateway" @click="gateway = 'braintree'">
                        <img src="@/assets/images/gateways/braintree-logo.png">
                        <p>Braintree</p>
                    </div>
                </el-card>
                <el-card shadow="hover" :class="{ selected: gateway === 'authorize' }" >
                    <div @click="gateway = 'authorize'" class="gateway">
                        <img src="@/assets/images/gateways/authorize-logo.png">
                        <p>Authorize.net</p>
                    </div>
                </el-card>
            </div>
            <router-link to="/welcome/locales"><el-button type="primary" :loading="loading" :disabled="!gateway">Continue</el-button></router-link>
        </section>
    </div>
</template>

<script>
    export default {
        name: "setup-wizard-start",
        data() {
            return {
                gateway: null,
                loading: false
            }
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    .gateway-list {
        display: flex;
        flex-wrap: wrap;
        margin: 20px 0;
    }
    .el-card {
        margin: 10px;
        &.selected {
            background-color: #ddd;
        }
        > div {
            padding: 0;
        }
    }
    .gateway {
        width: 350px;
        cursor: pointer;
        display: grid;
        grid-template-columns: 150px 1fr;
        grid-column-gap: 30px;
        padding: 14px 5px;
        img {
            margin: 0 auto;
            height: 50px;
            font-weight: 600;
        }
        p {
            margin: 0;
            line-height: 50px;
        }
    }
</style>