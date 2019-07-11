<template>
    <div class="setup">
        <section class="section">
            <h1 class="title title--primary">Setup</h1>
            <el-row style="max-width: 1200px">
                <el-col :span="8">
                    <router-link to="/setup/shipping">
                        <div class="grid-content">
                            <i class="el-icon-truck"></i>
                            <div>
                                Shipping
                                <p>Manage how you ship orders to customers</p>
                            </div>
                        </div>
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
                    <div class="grid-content">
                        <i class="el-icon-coin"></i>
                        <div>
                            Currencies
                            <p>Take your business global by adding additional currencies</p>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </section>
    </div>
</template>

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