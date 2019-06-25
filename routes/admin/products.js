const Category = require('../../models/category');
const Product = require('../../models/product');

const cors = require('@koa/cors');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    // create product
    router.post("/products", cors(), async (ctx, next) => {
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
                slug: category.slug,
                id: category.id
            }
            const product = await Product.create(data)
            if(!product) {
                throw new Error("Unknown error creating product");
            } else {
                // move all product images from temporary folder to product directory
                const promises = product.content.images.map(async (image) => {
                    const orig = image.tmpDir + "/" + image.filename
                    const dest = path.join(__dirname, "/../../public/assets/images/products/" + product.id + "/" + image.filename)
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
    
    // fetch all products, option to filter
    router.get("/products", async (ctx, next) => {
        console.log("getting")
        const categories = ctx.request.query.category
        const priceRange = ctx.request.query.price
        const query = {};
        if(categories) { query["category.id"] = {$in: categories} }
        if(priceRange) { query["inventory.price"] = { $gte: priceRange[0], $lte: priceRange[1] } }
        const perPage = 15
        const options = { sort: {"content.name": "descending"}, skip: ctx.request.query.page*perPage, limit: perPage }
        const products = await Product.find(query, null, options)
        const count = await Product.estimatedDocumentCount()
        const pages = Math.floor(count / perPage) + 1
        if(!products) {
            ctx.status = 404;
            return next();
        } else {
            const categories = await Category.find()
            if(!categories) {
                throw new Error("Unknown error getting categories");
            } else {
                // still returns empty array if no products found
                ctx.body = {
                    categories,
                    products,
                    pages
                }
            }
        }
    })
    
    // fetch single product by id
    router.get("/products/:id", async (ctx, next) => {
        try {
            const product = await Product.findById(ctx.params.id)
            if(!product) {
                ctx.status = 404;
                return next()
            } else {
                ctx.body = product;
            }
        }
        catch(err) {
            ctx.status = 400;
            ctx.body = "invalid product id";
            return next()
        }
    })
    
    // update product by id
    router.put("/products/:id", async (ctx, next) => {
        const toUpdate = ctx.request.fields.toUpdate.toString();
        let updateWith = ctx.request.fields.updateWith;
        if(toUpdate === "category") {
            const category = await Category.findById(updateWith)
            if(!category) {
                ctx.status = 400
                ctx.body = "invalid data - containing category not found"
                return next()
            } else {
                updateWith = {
                    name: category.name,
                    slug: category.slug
                }
            }
        }
        try {
            await Product.findByIdAndUpdate(ctx.params.id, { [toUpdate]: updateWith })
            ctx.body = "successfully updated product"
        }
        catch(err) {
            ctx.status = 400;
            ctx.body = "error updating product - " + err;
            return next()
        }
    })
    
    router.del("/products/:id", async (ctx, next) => {
        try {
            await Product.findByIdAndRemove(ctx.params.id)
            ctx.body = "Successfully deleted product"
        }
        catch(err) {
            throw new Error("Unknown error deleting product");
        }
    })
};