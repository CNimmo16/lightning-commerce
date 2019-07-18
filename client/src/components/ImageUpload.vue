<template>
    <div class="image-upload">
        <el-upload
        class="image-upload"
        drag
        action="/api/admin/images"
        :on-success="finishedUpload"
        multiple
        :limit="5"
        :show-file-list="showlist" 
        list-type="picture">
            <el-button size="small" type="primary">Click to upload</el-button>
            <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: "image-upload",
        props: ["showlist"],
        methods: {
            finishedUpload(response) {
                this.$emit('finishedUpload', response)
            }
        }
    }
</script>

<style>
    
    .image-upload {
        margin-bottom: 30px;
    }

</style>