<template>
    <div class="navbar">
        <el-row class="tac">
            <el-col :span="24">
                <el-menu
                ref="navbar"
                :default-active="active"
                class="el-menu-vertical-demo">
                    <router-link to="/">
                        <el-menu-item index="1">
                            <i class="el-icon-data-analysis"></i>
                            <span>Dashboard</span>
                        </el-menu-item>
                    </router-link>
                    <!--<router-link to="/search">-->
                    <!--    <el-menu-item index="2">-->
                    <!--        <i class="el-icon-search"></i>-->
                    <!--        <span>Search</span>-->
                    <!--    </el-menu-item>-->
                    <!--</router-link>-->
                    <router-link to="/customers">
                        <el-menu-item index="3">
                            <i class="el-icon-user"></i>
                            <span>Customers</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/products">
                        <el-menu-item index="4">
                            <i class="el-icon-goods"></i>
                            <span>Products</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/inventory">
                        <el-menu-item index="5">
                            <i class="el-icon-box"></i>
                            <span>Stock Management</span>
                        </el-menu-item>
                    </router-link>
                    <router-link to="/promotions">
                        <el-menu-item index="6">
                            <i class="el-icon-discount"></i>
                            <span>Promotions & Discounts</span>
                        </el-menu-item>
                    </router-link>
                    
                    <el-submenu index="7">
                        <template slot="title">
                            <i class="el-icon-truck"></i>
                            <span>Orders</span>
                        </template>
                        <router-link to="/fulfillment"><el-menu-item index="1-1"><i class="el-icon-magic-stick"></i>Fulfillment wizard</el-menu-item></router-link>
                        <router-link to="/orders"><el-menu-item index="1-2"><i class="el-icon-s-order"></i>All orders</el-menu-item></router-link>
                    </el-submenu>
                    <router-link to="/setup">
                        <el-menu-item index="8">
                            <i class="el-icon-s-tools"></i>
                            <span>Setup</span>
                        </el-menu-item>
                    </router-link>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>


<script>
export default {
    name: "navbar",
    data() {
        return {
            isCollapse: false,
            active: "1"
        }
    },
    watch: {
        '$route' (to) {
            switch(to.name) {
                case "customers":
                    this.active = "3"
                    break;
                case "products":
                case "newProduct":
                case "product":
                    this.active = "4"
                    break;
                case "inventory":
                case "newAdjustment":
                    this.active = "5"
                    break;
                case "promotions":
                case "newPromotion":
                    this.active = "6";
                    break;
                case "fulfillment":
                    this.active = "1-1";
                    break;
                case "setup":
                case "shipping-setup":
                case "new-shipping-method":
                    this.active = "8";
                    break;
            }
        }
    },
}
</script>