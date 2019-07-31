<template>
    <div class="new-stock-adjustment">
        <el-page-header @back="$router.push('/inventory')" title="back to stock management" content="New stock update"></el-page-header>
        <h1 class="title title--primary">New stock update</h1>
        <p>Submit a manual increase or decrease of stock. Stock updates are recorded to the database to easily keep track of what's happening to your inventory.</p>
        <el-form label-position="top" :model="form" :rules="rules" ref="form">
            <el-form-item label="Adjument date">
                <el-date-picker
                v-model="form.datetime"
                type="datetime"
                placeholder="Select date and time">
                </el-date-picker>
                <el-button style="margin-left: 20px;" type="primary" @click="form.datetime = Date.now()">Reset date and time to now</el-button>
            </el-form-item>
            <el-form-item label="Update type">
                <el-radio v-model="form.type" label="increase"><i class="el-icon-sell"></i> &nbsp;Increase</el-radio>
                <el-radio v-model="form.type" label="decrease"><i class="el-icon-sold-out"></i> &nbsp;Reduction</el-radio>
            </el-form-item>
            <el-form-item label="Reason for update">
                <el-select placeholder="Select reason" v-model="form.reason">
                    <el-option
                    v-for="(reason, index) in reasons[form.type]"
                    :key="index"
                    :label="reason"
                    :value="reason">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-divider />
            <el-form-item label="Add products to be adjusted">
                <el-select class="product-select" v-if="!toAdjust" placeholder="Select a product" v-model="toAdjust">
                    <el-option
                    v-for="product in availableProducts"
                    :key="product._id"
                    :label="product.content.name"
                    :value="product">
                    </el-option>
                </el-select>
                <el-collapse-transition>
                    <el-form v-if="toAdjust" class="product-form">
                        <h3>{{ toAdjust.content.name }}</h3>
                        <span>Current total stock: {{ toAdjust.inventory.totalStock }}</span>
                        <el-form-item :label="form.type === 'increase' ? 'Increase stock by' : 'Reduce stock by'">
                            <el-input-number v-if="form.type === 'increase'" :min=1 v-model="adjustBy" :step=1 />
                            <el-input-number v-else :min=1 :max="toAdjust.inventory.totalStock" v-model="adjustBy" :step=1 />
                        </el-form-item>
                        <el-button type="primary" @click="confirmProductAdjustment()">Add</el-button>
                        <el-button @click="toAdjust = null">Cancel</el-button>
                    </el-form>
                </el-collapse-transition>
                <el-table
                :data="productTableComputed"
                border
                style="width: 1101px">
                    <el-table-column
                    prop="name"
                    label="Product"
                    width="200px">
                    </el-table-column>
                    <el-table-column
                    prop="currentStock"
                    label="Current total stock count"
                    width="200px">
                    </el-table-column>
                    <el-table-column
                    label="Change"
                    width="150px">
                        <template slot-scope="scope">
                            {{ form.type === "increase" ? "+ " + scope.row.change : "- " + scope.row.change }}
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="New total stock count"
                    width="200px">
                        <template slot-scope="scope">
                            <span>{{ scope.row.newStock >= 0 ? scope.row.newStock : 0 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                    label="New available stock count"
                    width="200px">
                        <template slot-scope="scope">
                            <span :style="{ color: scope.row.newAvailableStock < 0 ? 'red' : '#000' }">{{ scope.row.newAvailableStock }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="150px">
                        <template slot-scope="scope">
                            <el-button @click="removeProduct(scope.$index)" type="text">Delete <i class="el-icon-delete"></i></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-divider />
            <el-form-item label="Update notes - record any relevant information about the delivery or reduction of stock">
                <el-input type="textarea" v-model="form.notes" :maxlength="400"></el-input>
            </el-form-item>
            <el-alert
                v-if="error"
                title="Whoops"
                description="Looks like you haven't added any products to the update"
                type="error"
                show-icon>
            </el-alert>
            <el-button type="success" @click="formSubmit">Apply update</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "new-stock-adjustment",
        data() {
            return {
                form: {
                    datetime: Date.now(),
                    type: "increase",
                    reason: "",
                    products: [],
                    notes: ""
                },
                productTable: [],
                reasons: {
                    increase: [
                        "Delivery",
                        "Counting error"
                    ],
                    decrease: [
                        "Sale(s) through untracked avenue",
                        "Defective/damaged product(s)",
                        "Loss/theft",
                        "Counting error"
                    ],
                },
                rules: {
                    formRules: {
                        // name: [
                        //     { required: true, type="date" message: 'Please choose a product name', trigger: 'blur' },
                        //     { min: 5, max: 31, message: 'Product name must be between 5 and 30 characters', trigger: 'blur' }
                        // ],
                    }
                },
                products: [],
                showProductAdjustmentForm: false,
                toAdjust: null,
                adjustBy: 1,
                potentialStockIssue: false,
                error: false
            }
        },
        computed: {
            availableProducts() {
                return this.products.filter((product) => {
                    return product.used === false;
                })
            },
            productTableComputed() {
                return this.productTable.map((row) => {
                    const sign = this.form.type === "increase" ? 1 : -1
                    row.newStock = row.currentStock + (row.change * sign)
                    row.newAvailableStock = row.currentAvailableStock + (row.change * sign)
                    // eslint-disable-next-line
                    this.potentialStockIssue = row.newAvailableStock < 0 ? true : false
                    return row
                })
            },
        },
        watch: {
            potentialStockIssue(newValue) {
                if(newValue) {
                    this.stockWarning();
                }
            },
            "form.type": function(newValue) {
                this.form.reason = newValue === "increase" ? "Delivery" : "Sale(s) through untracked avenue"
            }
        },
        mounted() {
            this.$emit("set-loading")
            this.$axios({
                method: "get",
                url: "/products"
            })
            .then(({data}) => {
                this.products = data.products.map((product) => { product.used = false; return product; });
                this.form.reason = this.form.type === "increase" ? "Delivery" : "Sale(s) through untracked avenue"
                this.$emit("stop-loading")
            })
            .catch(() => {
                this.$message.error("Error loading products. Please contact system administrator")
                this.$emit("stop-loading")
            })
        },
        methods: {
            confirmProductAdjustment() {
                this.products[this.products.indexOf(this.toAdjust)].used = true
                this.form.products.push({
                    id: this.toAdjust._id,
                    name: this.toAdjust.content.name,
                    previousTotalStock: this.toAdjust.inventory.totalStock,
                    previousAvailableStock: this.toAdjust.inventory.totalStock - this.toAdjust.inventory.inFulfillment,
                    change: this.adjustBy
                })
                this.productTable.push({
                    name: this.toAdjust.content.name,
                    change: this.adjustBy,
                    currentStock: this.toAdjust.inventory.totalStock,
                    currentAvailableStock: this.toAdjust.inventory.totalStock - this.toAdjust.inventory.inFulfillment,
                })
                // this.products.splice(this.products.indexOf(this.toAdjust), 1)
                this.toAdjust = null;
            },
            removeProduct(index) {
                console.log("removing")
                console.log(index)
                this.products = this.products.map((product) => {
                    if(product._id === this.form.products[index].id) {
                        product.used = false;
                    }
                    return product;
                })
                this.form.products.splice(index, 1)
                this.productTable.splice(index, 1)
                console.log(this.productTable)
            },
            stockWarning() {
                this.$alert("<p>Hey. Looks like you've requested a stock reduction which will leave you unable to fulfill pending, paid orders. If you inserted these numbers by mistake, you can dismiss this message. If not, you might want to review the currently outstanding orders, and cancel them if you are unable to fulfill them.</p><p><router-link to='/orders'</router-link></p>", 'Potential stock issue', {
                    confirmButtonText: 'Dismiss',
                    dangerouslyUseHTMLString: true
                });
            },
            formSubmit() {
                if(this.form.products.length === 0) {
                    this.error = true
                } else {
                    const form = this.form
                    form.datetime = new Date(form.datetime)
                    form.products.forEach((product) => {
                        const sign = form.type === "increase" ? 1 : -1
                        product.newTotalStock = product.previousTotalStock + (product.change * sign);
                        product.newAvailableStock = product.previousTotalStock + (product.change * sign);
                    })
                    this.$axios.post("/inventory", form)
                    .then(() => {
                        this.$message.success("Executed new stock adjustment - requested stock levels have been adjusted, and changes recorded")
                        this.$router.push("/inventory")
                    })
                    .catch(() => {
                        this.$message.error("Error adjusting stock. Please ensure form has been filled out correctly, and try reloading the page. If issue persists, contact your system administrator.")
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-radio i {
        font-size: 20px;
    }
    
    .product-select {
        margin-bottom: 20px;
    }
    
    .product-form {
        width: fit-content;
        padding: 25px;
        margin-bottom: 20px;
        border-radius: 10px;
        border: 1px solid #ddd;
        h3 {
            text-transform: capitalize;
            margin: 0;
        }
        .el-input-number {
            margin-bottom: 20px;
        }
    }
</style>