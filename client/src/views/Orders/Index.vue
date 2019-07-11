<template>
    <div class="orders">
        <h1 class="title title--primary title--backgrounded">Orders</h1>
        <section class="section"
        v-if="toFulfillCount > 0">
            <el-alert
            type="success"
            :closable="false">
                <div slot="title">You have {{ toFulfillCount }} order{{ toFulfillCount > 1 ? 's' : "" }} awaiting fulfillment. &nbsp; <router-link to="/fulfillment"><el-button type="primary">Go to fulfillment wizard</el-button></router-link></div>
            </el-alert>
        </section>
        
        <section class="section">
            <OrderTable :ordersRaw="ordersRaw" />
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
    import OrderTable from "@/components/OrderTable.vue"

    export default {
        name: "orders",
        components: {
            OrderTable
        },
        data() {
            return {
                ordersRaw: [],
                activeNames: ["1"],
                page: 0,
                totalPages: null,
            }
        },
        computed: {
            toFulfillCount() {
                return this.ordersRaw.filter((order) => {
                    return order.fulfillment.orderStatus === "Awaiting fulfillment";
                }).length
            },
        },
        watch: {
            page() {
                this.getOrders();
            }
        },
        mounted() {
            this.$emit("set-loading")
            this.getOrders();
        },
        methods: {
            getOrders() {
                // add page query 
                let queryString = "?page=" + this.page
                // // add category filter query
                // this.selectedCategories.forEach((category) => {
                //     queryString = queryString + "&category=" + category
                // });
                // // add price range filter query
                // queryString = queryString + "&price=" + this.priceRange[0] + "&price=" + this.priceRange[1]
                // send request
                this.$axios.get("/orders" + queryString)
                .then((res) => {
                    this.ordersRaw = res.data.orders;
                    this.totalPages = res.data.pages;
                    window.document.getElementsByClassName("el-main")[0].scroll(0,0)
                    this.$emit("stop-loading")
                })
                .catch(() => {
                    this.$message.error("Error loading orders. Please contact your system administrator")
                    this.$emit("stop-loading")
                })
            },
        }
    }
</script>

<style lang="scss">
    .clickable-row {
        cursor: pointer;
        &:hover {
            background-color: rgb(217, 236, 255);
            > td {
                background-color: transparent !important;
            }
        }
    }

    .payment-status {
        margin: 4px 40px;
        font-weight: 600;
        text-align: center;
        background-color: #aaa;
        color: #fff;
        &.pending {
            background-color: #d88c00;
        }
        &.paid {
            background-color: #18dc00
        }
    }
    
    .order-status {
        font-weight: 600; 
        font-size: 1.05em;
        &.action {
            color: #f56c6c;
        }
    }
</style>