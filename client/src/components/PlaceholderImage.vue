<template>
    <div class="placeholder-image" :style="{ height: height }">
        <i class="el-icon-picture-outline"></i>
    </div>
</template>

<script>
    export default {
        name: "placeholder-image",
        props: ["height"]
    }
</script>

<style lang="scss" scoped>
    .placeholder-image {
        width: 100%;
        height: 270px;
        background-color: #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            font-size: 5em;
            color: #666;
        }
    }
</style>