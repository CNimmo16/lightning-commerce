<template>
    <div class="new-product">
        <el-page-header @back="$router.push('/products')" title="back to all products" content="New product"></el-page-header>
        <h1 class="title title--primary">Launch new product</h1>
        <el-form label-position="top" :model="productForm" :rules="productFormRules" ref="productForm">
            <el-form-item label="Category" prop="category">
                <el-select v-model="productForm.category" placeholder="Select categories">
                    <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category._id">
                    </el-option>
                </el-select>
                <el-button style="margin-left: 20px;" @click="showNewCategoryForm = true">Or create a new category</el-button>
            </el-form-item>
            <NewCategoryForm :show="showNewCategoryForm" @created="createdCategory($event)" @discard="showNewCategoryForm = false" />
            <el-form-item label="Product name" prop="name">
                <el-input v-model="productForm.name" placeholder="Choose a name" />
            </el-form-item>
            <el-form-item label="Url reference" prop="slug">
                <el-input v-model="productForm.slug" placeholder="Choose a url reference" />
            </el-form-item>
            <el-form-item label="Product description" prop="description">
                <el-input type="textarea" v-model="productForm.description" placeholder="Write a detailed description" />
            </el-form-item>
            <el-form-item label="Product images">
                <ImageUpload @finishedUpload="updateProductImages($event)" :showlist="true"  />
            </el-form-item>
            <h3>Pricing and fulfillment</h3>
            <el-form-item label="Price" prop="price">
                £ <el-input-number :controls="false" v-model="productForm.price" :precision="2" />
            </el-form-item>
            <el-form-item label="Initial stock quantity (can be left as zero and added later if needed)" prop="stock">
                <el-input-number :controls="false" v-model="productForm.stock" :step="1" :precision="0" />
            </el-form-item>
            <!--<el-form-item label="Height (in centimetres)" prop="height">-->
            <!--    <el-input-number :controls="false" v-model="productForm.height" :step="1" /> cm-->
            <!--</el-form-item>-->
            <!--<el-form-item label="Width (in centimetres)" prop="width">-->
            <!--    <el-input-number :controls="false" v-model="productForm.width" :step="1" /> cm-->
            <!--</el-form-item>-->
            <!--<el-form-item label="Length (in centimetres)" prop="length">-->
            <!--    <el-input-number :controls="false" v-model="productForm.length" :step="1" /> cm-->
            <!--</el-form-item>-->
            <!--<el-form-item label="Weight" prop="weight">-->
            <!--    <el-input-number :controls="false" v-model="productForm.weight" :precision="2" /> kg-->
            <!--</el-form-item>-->
            <el-alert
                v-if="errors"
                title="Whoops"
                description="Please correct the errors above"
                type="error"
                show-icon>
            </el-alert>
            <el-form-item style="margin-top: 40px;">
                <el-button type="success" @click="submitForm('productForm')" :loading="launchingProduct">Launch product</el-button>
                <el-button type="danger" @click="discardProduct()">Cancel - discard product</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import ImageUpload from "@/components/ImageUpload.vue"
    import NewCategoryForm from "@/components/NewCategoryForm.vue"

    export default {
        name: "new-product",
        components: {
            ImageUpload,
            NewCategoryForm
        },
        data() {
            return {
                showNewCategoryForm: false,
                productForm: {
                    name: "",
                    description: "",
                    slug: "",
                    price: 0,
                    stock: 0,
                    weight: 0,
                    height: 0,
                    length: 0,
                    width: 0,
                    category: "",
                    images: [],
                    tmpDir: null
                },
                slugChanged: false,
                errors: false,
                categories: [],
                productFormRules: {
                    name: [
                        { required: true, message: 'Please choose a product name', trigger: 'blur' },
                        { min: 5, max: 31, message: 'Product name must be between 5 and 30 characters', trigger: 'blur' }
                    ],
                    slug: [
                        { required: true, message: 'Please choose a url reference', trigger: 'blur' },
                        { min: 5, max: 40, message: 'url reference must be between 5 and 40 characters', trigger: 'blur' },
                        { validator: this.validateSlug, message: 'Url reference cannot contain white spaces', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Please write a description', trigger: 'blur' }
                    ],
                    price: [
                        { required: true, message: 'Please choose a product price', trigger: 'blur' },
                    ],
                    // width: [
                    //     { required: true, type: 'number', message: 'Please add dimensions in centimetres', trigger: 'blur' },
                    // ],
                    // length: [
                    //     { required: true, type: 'number', message: 'Please add dimensions in centimetres', trigger: 'blur' },
                    // ],
                    // height: [
                    //     { required: true, type: 'number', message: 'Please add height in centimetres', trigger: 'blur' },
                    //     { min: 1, message: 'Height cannot be zero', trigger: 'blur' },
                    // ],
                    // weight: [
                    //     { required: true, type: 'number', message: 'Please select activity resource', trigger: 'blur' }
                    // ],
                },
                launchingProduct: false
            }
        },
        mounted() {
            this.$axios.get("/categories")
            .then((res) => {
                this.categories = res.data;
            })
            .catch(() => {
                this.$message.error("Whoops, error loading categories. Please contact the system administrator")
            });
        },
        methods: {
            autoCreateSlug(name) {
                if(!this.slugChanged) {
                    this.slug = name.replace(/ /g, "-")
                }
            },
            handleExceed(files, fileList) {
                this.$message.warning(`The limit is 3, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.errors = false
                        const data = this.productForm;
                        this.launchingProduct = true;
                        this.$axios.post("/products", {
                            content: {
                                name: data.name,
                                description: data.description,
                                slug: data.slug,
                                images: data.images
                            },
                            inventory: {
                                price: data.price,
                                totalStock: data.stock,
                                inFulfillment: 0
                            },
                            category: data.category,
                        })
                        .then(() => {
                            this.launchingProduct = false;
                            this.$message.success("Great! You launched a new product - " + data.name);
                            this.$router.push("/products")
                        })
                        .catch(() => {
                            this.launchingProduct = false;
                            this.$message.error("Whoops, something went wrong launching the product :(. Please check that you have filled out the form correctly and try again, then contact your system administrator")
                        });
                    } else {
                        this.errors = true;
                        return false;
                    }
                });
            },
            createdCategory(category) {
                this.categories.push(category);
                this.showNewCategoryForm = false;
            },
            discardProduct() {
                this.$axios.delete("/images")
                .then(() => {
                    this.$router.push("/products");
                })
                .catch(() => {
                    this.$message.warning("Warning: couldn't empty temporary image cache folder. This could cause issues in the future. Please make your system administrator aware of the issue.");
                    this.$router.push("/products");
                })
            },
            updateProductImages(response) {
                this.productForm.images.push(response)
            },
            validateSlug (rule, value, callback) {
                if (value.indexOf(" ") > -1) {
                    callback(new Error('Url reference cannot contain spaces'));
                } else {
                    callback();
                }
            }
        }
    }
</script>

<style lang="scss">
    .el-alert {
        margin: 30px 0 !important;
    }
</style>