<template>
    <div id="app">
        <el-container class="app-container">
            <el-aside width="280px">
                <div class="logo">
                    <img src="@/assets/images/logo.png">
                    <a href="/"><el-button type="primary">Go to store</el-button></a>
                </div>
                <Navbar />
            </el-aside>
            <el-main
            v-loading=loading
            element-loading-text="Loading..."
            element-loading-background="rgba(0, 0, 0, 0.8)">
                <router-view @set-loading="setLoading()" @stop-loading="stopLoading()" />
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Navbar from "@/components/Navbar.vue"

    export default {
        components: {
            Navbar
        },
        data() {
            return {
                loading: false,
                stopLoad: false
            }
        },
        methods: {
            stopLoading() {
                this.stopLoad = true;
                this.loading = false
            },
            setLoading() {
                this.stopLoad = false;
                window.setTimeout(() => {
                    if(this.stopLoad === false) {
                        this.loading = true
                    }
                }, 1000)
            }
        }
    }
</script>

<style lang="scss">
    .app-container {
        height: 100vh;
    }
    a {
        color: black;
    }
    .el-aside {
        .logo {
            display: flex;
            flex-direction: column;
            align-items: center;
            border-right: 1px solid #e6e6e6;
            img {
                width: 219px;
                max-width: 70%;
                margin: 10px 0;
            }
        }
    }
    .el-main {
        min-height: 100%;
        padding: 45px 35px !important;
    }
    .el-loading-spinner {
        .el-loading-text {
            color: #fff !important;
        }
        .path {
            stroke: #fff !important;
        }
    }
</style>