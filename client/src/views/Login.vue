<template>
    <div class="login">
        <h1 class="title title--primary title--backgrounded">Hey there!</h1>
        <section class="section">
            <h2 class="title title--secondary">Login to your account</h2>
            <el-form>
                <el-form-item label="Username">
                    <el-input placeholder="username"/>
                </el-form-item>
                <el-form-item label="Password">
                    <el-input placeholder="password"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">Login</el-button>
                </el-form-item>
            </el-form>
        </section>
    </div>
</template>

<script>
    export default {
        name: "login",
        methods: {
            authenticate() {
                this.$axios.post("/login")
                .then(() => {
                    window.location.reload()
                })
                .catch((err) => {
                    console.error(err)
                })
            }
        }
    }
</script>