const Customer = require('../../models/customer');

module.exports = ({ router }) => {

    // get all customers
    router.get("/customers", async (ctx, next) => {
        const perPage = 15
        const options = { sort: {"date": "descending"}, skip: ctx.request.query.page*perPage, limit: perPage }
        const customers = await Customer.find({}, null, options)
        const count = await Customer.estimatedDocumentCount()
        const pages = Math.floor(count / perPage) + 1  
        ctx.body = {
            customers,
            pages
        }
    })

    // get customer by id
    router.get("/customers/:id", async (ctx, next) => {
        const customer = await Customer.findById(ctx.params.id).populate("orders").exec()
        ctx.body = {
            customer: customer
        }
    })
    
}