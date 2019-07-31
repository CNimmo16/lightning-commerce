<template>
    <div class="inventory">
        <h1 class="title title--primary">Stock Management</h1>
        <router-link to="/inventory/new">
            <el-button rounded type="success">New Stock Update</el-button>
        </router-link>
        <h2 class="title title--secondary">Stock update history</h2>
        <p>Filter</p>
        <div class="options">
            <div class="filters">
                <el-form :inline="true">
                    <el-form-item label="Type">
                        <el-select v-model="selectedReasons" multiple placeholder="Select type" style="width: 800px;">
                            <el-option
                            v-for="(reason, index) in reasons"
                            :key="index"
                            :label="reason"
                            :value="reason">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Date range">
                        <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            range-separator="To"
                            start-placeholder="Start date"
                            end-placeholder="End date">
                        </el-date-picker>
                        <el-button @click="dateRange = [Date.now() - 2419200000, Date.now()]">Reset</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-table :data="adjustmentsComputed" :row-class-name="getRowClasses" :default-sort = "{prop: 'datetime', order: 'descending'}">
            <el-table-column
            prop="datetime"
            label="Created"
            width="300px">
            </el-table-column>
            <el-table-column
            label="Type"
            width="300px">
                <template slot-scope="scope">
                    <span><i v-if="scope.row.reason === 'Delivery'" class="el-icon-truck" style="font-size: 25px; margin-right: 5px;"></i>{{ scope.row.reason }}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="Products updated"
            width="350px">
                <template slot-scope="scope">
                    <span v-for="(product, index) in scope.row.products.slice(0, 6)" :key="index">{{ product.name }} <span v-if="index < scope.row.products.slice(0,6).length - 1">, </span></span>
                </template>
            </el-table-column>
            <el-table-column
            label="Notes"
            width="400px">
                <template slot-scope="scope">
                    {{ scope.row.notes.slice(0, 100) }}
                    <span v-if="scope.row.notes.length > 100">...</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            layout="prev, pager, next"
            @current-change="page = $event - 1"
            :hide-on-single-page=true
            :page-count="totalPages">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "inventory",
        data() {
            return {
                // adjustments: [{ "_id" : "5d08e7d479b1c351324f7e8b", "datetime" : "2019-06-18T13:29:16.476Z", "type" : "increase", "reason" : "Delivery", "products" : [ { "_id" : "5d08e7d479b1c351324f7e8d", "id" : "5d08a9fb9e70562b7b72da11", "name" : "shetland", "previousTotalStock" : 30, "previousAvailableStock" : 30, "change" : 54, "newTotalStock" : 84, "newAvailableStock" : 84 }, { "_id" : "5d08e7d479b1c351324f7e8c", "id" : "5d08c9fc8156043fed90b593", "name" : "big rucksack", "previousTotalStock" : 42, "previousAvailableStock" : 42, "change" : 23, "newTotalStock" : 65, "newAvailableStock" : 65 } ], "notes" : "adding some bags", "__v" : 0 }]
                adjustments: [],
                reasons: [
                    "Delivery",
                    "Counting error",
                    "Sale(s) through untracked avenue",
                    "Defective/damaged product(s)",
                    "Loss/theft",
                ],
                selectedReasons: [
                    "Delivery",
                    "Counting error",
                    "Sale(s) through untracked avenue",
                    "Defective/damaged product(s)",
                    "Loss/theft",
                ],
                page: 0,
                dateRange: [Date.now() - 2419200000, Date.now()],
                totalPages: 1
            }
        },
        mounted() {
            this.$emit("set-loading")
            this.getAdjustments()
        },
        watch: {
            page() {
                this.getAdjustments()   
            },
            dateRange() {
                this.getAdjustments()   
                this.page = 0;
            },
            selectedReasons() {
                this.getAdjustments()   
                this.page = 0;
            }
        },
        computed: {
            adjustmentsComputed() {
                return this.adjustments.map((adjustment) => {
                    const date = new Date(adjustment.datetime)
                    adjustment.datetime = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
                    return adjustment
                })
            }
        },  
        methods: {
            getRowClasses({row}) {
                if(row.type === "increase") {
                    return "row-increase"
                } else {
                    return "row-decrease"
                }
            },
            getAdjustments() {
                this.adjustments = []
                let queryString = "?page=" + this.page
                this.selectedReasons.forEach((reason) => {
                    queryString = queryString + "&reason=" + reason
                });
                queryString = queryString + "&daterange=" + new Date(this.dateRange[0]).getTime() + "&daterange=" + new Date(this.dateRange[1]).getTime()
                this.$axios.get("/inventory" + queryString)
                .then((res) => {
                    window.document.getElementsByClassName("el-main")[0].scroll(0,0)
                    this.adjustments = res.data.adjustments
                    this.totalPages = res.data.pages
                    this.$emit("stop-loading")
                })
                .catch(() => {
                    this.$message.error("Error loading stock adjustment database. Please contact your system administrator.")
                    this.$emit("stop-loading")
                })
            }
        }
    }
</script>

<style lang="scss">
    .el-table .row-increase {
        background-color: #e4ffe4;
    }
    .el-table .row-decrease {
        background-color: #fff4f0;
    }
</style>