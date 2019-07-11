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
                    slug: category.slug,
                    id: category._id
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

    // add image to product
    router.put("/products/:id/images", async (ctx, next) => {
        const image = ctx.request.fields
        const orig = image.tmpDir + "/" + image.filename
        let dest = null
        let ref = null
        for(let i=0; i<10; i++) {
            try {
                if(i>0) {
                    image.filename = image.filename + `(${i})`
                }
                dest = path.join(__dirname, "/../../public/assets/images/products/" + ctx.params.id + "/" + image.filename)
                ref = "/public/assets/images/products/" + ctx.params.id + "/" + image.filename
                await fs.move(orig, dest)
                break;
            }
            catch {

            }
        }
        // remove temporary directory
        await fs.remove(image.tmpDir)
        // wait until all promises are resolved
        await Product.findByIdAndUpdate(ctx.params.id, { $push: { "content.images": {
            filename: image.filename,
            path: ref
        }}})
        ctx.body = "updated"
    })

    // remove image from product
    router.del("/products/:id/images/:filename", async (ctx, next) => {
        console.log("teh filename is")
        console.log(ctx.params.filename)
        const product = await Product.findById(ctx.params.id)
        console.log(product.content.images)
        const image = product.content.images.find((image) => { return image.filename == ctx.params.filename })
        const loc = path.join(__dirname, "/../.." + image.path)
        await fs.remove(loc)
        await product.update({ $pull: { "content.images": { filename: image.filename }}})
        ctx.body = "removed"
    });

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