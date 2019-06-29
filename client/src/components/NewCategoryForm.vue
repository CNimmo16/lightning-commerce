<template>
    <div class="new-category-form">
        <el-dialog title="New category" :visible.sync="show">
            <el-form :model="newCategoryForm" ref="newCategoryForm" :rules="newCategoryFormRules">
                <el-form-item label="Category name " style="display: flex;" prop="name">
                    <el-input v-model="newCategoryForm.name"></el-input>
                </el-form-item>
                <el-form-item label="Category url reference" style="display: flex;" prop="slug"> 
                    <el-input v-model="newCategoryForm.slug"></el-input>
                </el-form-item>
                <el-form-item label="Category description" prop="description">
                    <el-input type="textarea" v-model="newCategoryForm.description"></el-input>
                </el-form-item>
                <el-form-item label="Category images">
                    <ImageUpload @finishedUpload="updateCategoryImages($event)" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="$emit('discard')">Discard</el-button>
                <el-button type="success" @click="createCategory('newCategoryForm')">Create category</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import ImageUpload from "@/components/ImageUpload.vue"

    export default {
        props: ["show"],
        components: {
            ImageUpload
        },
        data() {
            return {
                newCategoryFormRules: {
                    name: [
                        { required: true, message: 'Please choose a product name', trigger: 'blur' },
                        { max: 14, message: 'Category name must be less than 15 characters', trigger: 'blur' }
                    ],
                    slug: [
                        { required: true, message: 'Please choose a url reference', trigger: 'blur' },
                        { min: 3, max: 20, message: 'url reference must be between 3 and 20 characters', trigger: 'blur' },
                        { validator: this.validateSlug, message: 'Url reference cannot contain white spaces', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Please write a description', trigger: 'blur' },
                        { max: 400, message: "description cannot be more than 400 characters", trigger: 'blur' },
                    ],
                },
                newCategoryForm: {
                    name: "",
                    slug: "",
                    description: "",
                    images: []
                },
            }
        },
        methods: {
            createCategory(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        this.$axios.post("/categories", {
                            name: this.newCategoryForm.name,
                            description: this.newCategoryForm.description,
                            slug: this.newCategoryForm.slug,
                            images: this.newCategoryForm.images
                        })
                        .then((res) => {
                            this.$emit("created", res.data)
                            this.$message.success("Category created successfully. You can now select the category from the dropdown menu")
                            this.$refs[formName].resetFields();
                        })
                        .catch(() => {
                            this.$message.error("Whoops, something went wrong trying to create a new category. Please reload the page and try again, or contact the system administrator if issue persists.");
                        })
                    }
                })
            },
            updateCategoryImages(response) {
                this.newCategoryForm.images.push(response)
            },
        }
    }
</script>