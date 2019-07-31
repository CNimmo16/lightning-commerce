<template>
    <div class="shipping">
        <el-page-header @back="$router.push('/setup')" title="Setup" content="Shipping"></el-page-header>
        <h1 class="title title--primary">Shipping</h1>
        
        <h2 class="title title--secondary">Shipping methods</h2>
        <el-table :data="methods">
            <el-table-column
            prop="name"
            label="Name"
            width="200px">
            </el-table-column>
            <el-table-column
            label="Cost"
            width="150px">
                <template slot-scope="scope">
                    <span>£{{ scope.row.cost.toFixed(2) }}</span>
                </template>
            </el-table-column>
            <el-table-column
            label="Estimated delivery time"
            width="220px">
                <template slot-scope="scope">
                    <span>{{ scope.row.days[0] }}-{{ scope.row.days[1] }} days</span>
                </template>
            </el-table-column>
            <el-table-column
            label="Target fulfillment time"
            width="220px">
                <template slot-scope="scope">
                    <span>{{ scope.row.targetHours }} hours</span>
                </template>
            </el-table-column>
            <el-table-column
            width="120px">
                <template slot-scope="scope">
                    <i style="color: #f56c6c; cursor: pointer; font-size: 1.3em;" class="el-icon-delete-solid" @click="deleting = true"></i>
                    <el-dialog
                        :visible.sync="deleting"
                        width="30%">
                        <span slot="title">Permenantly delete <strong>{{ scope.row.name }}</strong>?</span>
                        <span>Are you sure you want to delete this shipping method?</span>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="deleting = false">Cancel</el-button>
                            <el-button type="danger" @click="deleteMethod(scope.row._id, scope.$index)">Delete</el-button>
                        </span>
                    </el-dialog>
                </template>
            </el-table-column>
        </el-table>
        <router-link to="/setup/shipping/new">
            <el-popover
            placement="right"
            width="300"
            popper-class="tutorial-tooltip"
            trigger="manual"
            v-model="showGuides"
            content="Click here to add your first shipping method">
                <el-button type="primary" slot="reference">New shipping method</el-button>
            </el-popover>
        </router-link>
        
        <h2 class="title title--secondary" style="margin: 50px 0 10px 0;">Shipping days</h2>
        <el-form label-position="top">
            <el-form-item label="Select the days on which you are fulfilling orders (affects calculation of fulfillment targets and estimated delivery dates).">
                <el-checkbox-group v-model="shippingDays">
                    <el-checkbox label="Monday"></el-checkbox>
                    <el-checkbox label="Tuesday"></el-checkbox>
                    <el-checkbox label="Wednesday"></el-checkbox>
                    <el-checkbox label="Thursday"></el-checkbox>
                    <el-checkbox label="Friday"></el-checkbox>
                    <el-checkbox label="Saturday"></el-checkbox>
                    <el-checkbox label="Sunday"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-button type="success">Save changes</el-button>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "shipping",
        data() {
            return {
                shippingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                methods: [],
                deleting: false,
                showGuides: false
            }
        },
        mounted() {
            this.$emit("set-loading")
            this.$axios.get("/shipping-methods")
            .then((res) => {
                this.methods = res.data.methods
                this.showGuides = res.data.methods.length > 0 ? false : true
                this.$emit("stop-loading")
            })
            .catch(() => {
                this.$message.error("Failed to load shipping methods. Please contact your system administrator.")
                this.showGuides = true;
                this.$emit("stop-loading")
            })
        },
        methods: {
            deleteMethod(id, index) {
                this.$axios.delete("/shipping-methods/" + id)
                .then(() => {
                    this.$message.success("Permenantly deleted shipping method - this method is no longer available in the checkout process")
                    this.methods.splice(index, 1)
                })
                .catch(() => {
                    this.$message.error("Error deleting shipping method. Please contact your system administrator.")
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-table {
        margin-bottom: 20px;
    }
</style>