const stripe = require('stripe')(process.env.STRIPESECRET);

module.exports = ({ router }) => {
    router.post("/webhook/stripe", async (ctx, next) => {
        console.log(ctx.request.fields)
        const sig = ctx.headers['stripe-signature'];
        const body = ctx.request.fields
    })
}