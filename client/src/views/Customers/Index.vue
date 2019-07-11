<template>
    <div class="customers">
        <h1 class="title title--primary title--backgrounded">Customers</h1>
        <section class="section">
            <el-table
            :data="customers"
            :row-class-name="'clickable-row'"
            @row-click="rowClicked($event)"
            striped>
                <el-table-column
                prop="fullName"
                label="Name"
                width="255px">
                </el-table-column>
                <el-table-column
                prop="contact.email"
                label="Email address"
                width="305px">
                </el-table-column>
                <el-table-column
                prop="billingAddress"
                label="Billing address"
                width="400px">
                </el-table-column>
                <el-table-column
                label="Orders"
                width="350px">
                    <template slot-scope="scope">
                        {{ scope.row.orders.length }}
                        <!--<router-link v-for="order in scope.row.orders" :key="order._id" :to="'/orders/' + order._id">-->
                        <!--    {{ order._id }}-->
                        <!--</router-link>, -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                layout="prev, pager, next"
                @current-change="page = $event - 1"
                :hide-on-single-page=true
                :page-count="totalPages">
            </el-pagination>
        </section>
    </div>
</template>

<script>
    export default {
        name: "customers",
        data() {
            return {
                customersRaw: [],
                page: 0,
                totalPages: null,
            }
        },
        computed: {
            customers() {
                return this.customersRaw.map((customer) => {
                    const a = customer.billingAddress
                    let firstLine = a.address
                    if(a.flatNumber) { firstLine = a.flatNumber + ", " + firstLine }
                    if(a.company) { firstLine = a.company + ", " + firstLine }
                    customer.billingAddress = firstLine + ", " + a.postcode + ", " + a.city + ", " + a.country.name
                    customer.fullName = a.firstName + " " + a.lastName
                    
                    return customer
                })
            }
        },
        mounted() {
            this.$emit("set-loading")
            this.getCustomers()
        },
        methods: {
            getCustomers() {
                this.$axios.get("/customers")
                .then((res) => {
                    this.customersRaw = res.data.customers
                    this.$emit("stop-loading")
                })
                .catch(() => {
                    this.$message.error("Error loading customers. Please contact your system administrator.")
                    this.$emit("stop-loading")
                })
            },
            rowClicked(row) {
                this.$router.push("/customers/" + row._id)
            },
        }
    }
</script>