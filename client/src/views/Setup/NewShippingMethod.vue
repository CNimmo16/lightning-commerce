<template>
    <div class="new-shipping-method">
        <el-page-header @back="$router.push('/setup/shipping')" title="Shipping" content="New Shipping Method"></el-page-header>
        <h1 class="title title--primary">New Shipping Method</h1>
        <el-form :model="method" label-position="top">
            <el-form-item label="Short description of the method">
                <el-input v-model="method.name" placeholder='eg. DHL Express Delivery' />
            </el-form-item>
            <el-form-item>
                <label class="el-form-item__label">Estimated delivery time range</label>
                <el-slider
                v-model="method.days"
                range
                :step="1"
                :max="15">
                </el-slider>
                <p style="color: #666; margin: 0;">{{ method.days[0] }} - {{ method.days[1] }} business days</p>
            </el-form-item>
            <el-form-item label="Shipping method cost">
                £&nbsp;<el-input-number v-model="method.cost" />
            </el-form-item>
            <h4 style="font-weight: 600;">Example preview</h4>
            <p style="font-size: 0.8em">"{{ method.name }}, {{ method.days[0] }} - {{ method.days[1] }} business days - £{{ method.cost.toFixed(2) }}"</p>
            <el-divider />
            <el-form-item label="Fulfillment target - how quickly do you aim to fulfill orders placed with this delivery method?">
                Within  &nbsp;<el-input-number :min="1" :max="96" v-model="method.targetHours" /> &nbsp;hours of order being placed
            </el-form-item>
            <el-divider />
            <el-button type="success" @click="newShippingMethod()">Create shipping method</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "new-shipping-method",
        data() {
            return {
                method: {
                    name: "",
                    days: [2,3],
                    cost: 3,
                    targetHours: 24
                }
            }
        },
        methods: {
            newShippingMethod() {
                this.$axios.post("/shipping-methods", this.method)
                .then(() => {
                    this.$message.success("Successfully created new shipping method")
                    this.$router.push("/setup/shipping")
                })
                .catch(() => {
                    this.$message.error("Error creating new shipping method. Please try again, then contact your system administrator if problem persists.")
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-slider {
        width: 180px;
    }
    .el-form-item {
        margin-right: 40px;
    }
</style>