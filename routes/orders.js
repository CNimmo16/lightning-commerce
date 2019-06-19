const Category = require('../models/category');
const Product = require('../models/product');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    // create new order
    router.post("/orders", async (ctx, next) => {
        const data = ctx.request.fields;
        console.log(data)
        const category = await Category.findById(data.category)
        if(!category) {
            ctx.status = 400
            ctx.body = "invalid data - containing category not found"
            return next()
        } else {
            data.category = {
                name: category.name,
                slug: category.slug
            }
            const product = await Product.create(data)
            if(!product) {
                throw new Error("Unknown error creating product");
            } else {
                // move all product images from temporary folder to product directory
                const promises = product.content.images.map(async (image) => {
                    const orig = image.tmpDir + "/" + image.filename
                    const dest = path.join(__dirname, "/../public/assets/images/products/" + product.id + "/" + image.filename)
                    await fs.move(orig, dest)
                    // remove temporary directory
                    await fs.remove(image.tmpDir)
                });
                // wait until all promises are resolved
                await Promise.all(promises);
                product.content.images = product.content.images.map((image) => {
                    return {
                        filename: image.filename,
                        path: "/public/assets/images/products/" + product.id + "/" + image.filename
                    }
                })
                product.save();
                ctx.body = product;
            }
        }
    });
    
    // fetch all orders, option to filter
    router.get("/orders", async (ctx, next) => {
        const query = {}
        const products = await Product.find(query)
        if(!products) {
            ctx.status = 404;
            return next();
        } else {
            const categories = await Category.find({})
            if(!categories) {
                throw new Error("Unknown error getting categories");
            } else {
                // still returns empty array if no products found
                ctx.body = {
                    categories,
                    products
                }
            }
        }
    })
};