<template>
    <div class="site-header">
        <img src="@/assets/images/logo.png">
        <a class="admin" href="/admin/products">Admin Dashboard</a>
        <div class="menu-icon" @click="$emit('toggle-nav')">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'site-header',
}
</script>

<style lang="scss">
    .site-header {
        padding: 25px 0 17px 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .admin {
            display: block;
            position: fixed;
            top: 20px;
            right: 20px;
            font-family: "Roboto", sans-serif;
            font-size: 1.2em;
            color: #000080;
            text-decoration: underline;
        }
        img {
            width: 219px;
            max-width: 70%;
        }
        .menu-icon {
            position: relative;
            height: 18px;
            width: 25px;
            margin: 0 20px;
            .bar {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 2px;
                background-color: #000;
                border-radius: 3px;
                &:nth-of-type(2) {
                    transform: translateY(9px);
                }
                &:nth-of-type(3) {
                    transform: translateY(18px);
                }
            }
            @include mq("phone") {
                display: none;
            }
        }
    }
</style>