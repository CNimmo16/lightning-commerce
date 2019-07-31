<template>
    <div class="currencies">
        <el-page-header @back="$router.push('/setup')" title="Setup" content="Currencies"></el-page-header>
        <h1 class="title title--primary">Currencies</h1>
        
        <section class="section">
            <h2 class="title title--secondary">Primary currency</h2>
            <p>Select the primary currency that you do business in - this currency will be used to set prices, and will be used as the base currency for currency conversions.</p>
            <el-form>
                <el-form-item prop="category">
                    <el-select v-model="primaryCurrency" placeholder="Primary currency" filterable>
                        <el-option
                        v-for="(name, symbol) in currencyList"
                        :key="symbol"
                        :label="name + ' - ' + symbol"
                        :value="symbol">
                            <span style="float: left">{{ name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ symbol }}</span>
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 20px;" type="primary" @click.prevent="updatePrimaryCurrency()">Update</el-button>
                </el-form-item>
            </el-form>
        </section>
        
        <section class="section">
            <h2 class="title title--secondary">Available payment currencies</h2>
            <p>Choose the currencies that you want your customers to be able to checkout in.</p>
            <p>Please note that the currencies displayed are dependent on the currencies supported by your chosen payment service provider. <strong>Stripe</strong> is your current payment provider. <router-link to="/setup/payment-providers">Click here to change your payment provider.</router-link></p>
            <el-form>
                <el-form-item prop="category">
                    <el-select v-model="primaryCurrency" placeholder="Primary currency" filterable>
                        <el-option
                        v-for="(name, symbol) in currencyList"
                        :key="symbol"
                        :label="name + ' - ' + symbol"
                        :value="symbol">
                            <span style="float: left">{{ name }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ symbol }}</span>
                        </el-option>
                    </el-select>
                    <el-button style="margin-left: 20px;" type="primary" @click.prevent="updatePrimaryCurrency()">Update</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
    export default {
        name: "currencies",
        data() {
            return {
                currencyList: null,
                primaryCurrency: null
            }
        },
        mounted() {
            this.$axios.get("https://openexchangerates.org/api/currencies.json")
            .then(({data}) => {
                this.currencyList = data
                this.getCurrentSettings()
            })
            // f0ebb3ed832b47db87d7f5903dfd3d2b
        },
        methods: {
            getCurrentSettings() {
                this.$axios.get("/setup")
                .then(({data}) => {
                    if(data.primaryCurrency) {
                        this.primaryCurrency = data.primaryCurrency.symbol
                    }
                })
                .catch(() => {
                    this.$message.error("Error loading current currency settings. Please try again, then contact your system administrator.")
                })
            },
            updatePrimaryCurrency() {
                this.$axios.put("/currencies/primary", {
                    name: this.currencyList[this.primaryCurrency],
                    symbol: this.primaryCurrency
                })
                .then(() => {
                    this.$message.success("Successfully updated primary currency")
                })
                .catch(() => {
                    this.$message.error("Error updating primary currency. Please contact your system administrator.")
                    this.getCurrentSettings()
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>