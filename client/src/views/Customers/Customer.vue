<template>
    <div class="view-customer">
        <div v-if="customer">
            <el-page-header @back="$router.push('/customers')" title="back to all customers" :content="customer.billingAddress.firstName + ' ' + customer.billingAddress.lastName"></el-page-header>
            <h1 class="title title--primary">
                {{ customer.billingAddress.firstName }} {{ customer.billingAddress.lastName }}
            </h1>
            <h2>Contact</h2>
                <p><strong>{{ customer.contact.email }}</strong></p>
            <h2>Billing address</h2>
            <div class="address">
                <p>{{ customer.billingAddress.firstName }} {{ customer.billingAddress.lastName }}</p>
                <p>{{ customer.billingAddress.address }}</p>
                <p>{{ customer.billingAddress.postcode }}</p>
                <p>{{ customer.billingAddress.city }}</p>
                <p>{{ customer.billingAddress.country.name }}</p>
            </div>
            <h2>Orders</h2>
            <OrderTable :ordersRaw="customer.orders" />
        </div>
    </div>
</template>

<script>
    import OrderTable from "@/components/OrderTable.vue"

    export default {
        name: "customer",
        props: ["id"],
        components: {
            OrderTable
        },
        data() {
            return {
                customer: null,
            }
        },
        mounted() {
            if(this.id.length !== 24) {
                this.$router.push("/customers")
                this.$message.error("Whoops, that customer doesn't seem to exist. Redirecting to customers page.")
            } else {
                this.$emit("set-loading")
                this.$axios.get("/customers/" + this.id)
                .then((res) => {
                    this.customer = res.data.customer
                    this.$emit("stop-loading")
                })
                .catch(() => {
                    this.$router.push("/customers")
                    this.$message.error("Whoops, that customer doesn't seem to exist. Redirecting to customers page.")
                    this.$emit("stop-loading")
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
    p {
        font-size: 0.9;
        margin: 8px 0;
    }
    h2 {
        margin-top: 40px;
    }
</style>