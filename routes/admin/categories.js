const Category = require('../../models/category');
const Product = require('../../models/product');

const fs = require('fs-extra')
const path = require("path")

module.exports = ({ router }) => {
    router.post('/categories', async (ctx, next) => {
        const data = ctx.request.fields;
        try {
            if(data.name.length > 70 || data.slug.indexOf(" ") > -1 || data.description.length > 600 || !Array.isArray(data.images) ) {
                ctx.status = 400;
                ctx.body = "invalid data provided";
                return next()
            }
        }
        catch(err) {
            ctx.status = 400;
            ctx.body = err;
        }
        const category = await Category.create(data);
        if(!category) {
            throw new Error("error creating category")
        } else {
            // move all product images from temporary folder to product directory
            const promises = category.images.map(async (image) => {
                const orig = image.tmpDir + "/" + image.filename
                const dest = path.join(__dirname, "/../../public/assets/images/categories/" + category.id + "/" + image.filename)
                await fs.move(orig, dest)
                // remove temporary directory
                await fs.remove(image.tmpDir)
            });
            // wait until all promises are resolved
            await Promise.all(promises);
            category.images = category.images.map((image) => {
                return {
                    filename: image.filename,
                    path: "/public/assets/images/products/" + category.id + "/" + image.filename
                }
            })
            category.save();
            ctx.body = category
        }
    });
    
    // fetch all categories
    router.get("/categories", async (ctx, next) => {
        const categories = await Category.find()
        if(!categories) {
            ctx.status = 404;
            return next();
        } else {
            ctx.body = categories
        }
    })
};