<template>
    <div class="setup">
        <section class="section">
            <router-link to="/setup/wizard">Wizard</router-link>
            <h1 class="title title--primary">Setup</h1>
            <el-row style="max-width: 1200px">
                <el-col :span="8">
                    <router-link to="/setup/shipping">
                        <el-popover
                        placement="bottom"
                        title="First time here?"
                        width="250"
                        popper-class="tutorial-tooltip"
                        trigger="manual"
                        v-model="showGuides"
                        content="Get started by adding a shipping method">
                            <div class="grid-content" slot="reference">
                                <i class="el-icon-truck"></i>
                                <div>
                                    Shipping
                                    <p>Manage how you ship orders to customers</p>
                                </div>
                            </div>
                        </el-popover>
                    </router-link>
                </el-col>
                
                <el-col :span="8">
                    <div class="grid-content">
                        <i class="el-icon-bank-card"></i>
                        <div>
                            Payment Providers
                            <p>Take control of how your users pay for their purchases</p>
                        </div>
                    </div>
                </el-col>
                
                <el-col :span="8">
                    <router-link to="/setup/currencies">
                        <div class="grid-content">
                            <i class="el-icon-coin"></i>
                            <div>
                                Currencies
                                <p>Take your business global by adding additional currencies</p>
                            </div>
                        </div>
                    </router-link>
                </el-col>
            </el-row>
        </section>
    </div>
</template>

<script>
    export default {
        name: "setup",
        data() {
            return {
                showGuides: false
            }
        },
        mounted() {
            this.$axios.get("/shipping-methods")
            .then(({data}) => {
                if(data.methods.length > 0) {
                    this.showGuides = false
                } else {
                    this.showGuides = true
                }
            })
            .catch(() => {
                this.showGuides = true;
            })
        }
    }
</script>

<style lang="scss">
    .grid-content {
        background: $palette-background-blue;
        border-radius: 15px;
        display: flex;
        padding: 14px 40px 10px 40px;
        margin: 20px;
        justify-content: center;
        align-items: center;
        font-size: 1.4em;
        font-weight: 700;
        color: #004e86;
        p {
            color: #303133;
            font-size: 0.7em;
            font-weight: 400;
            margin: 8px 0;
        }
        i {
            margin-right: 30px;
            font-size: 2em;
        }
    }
</style>