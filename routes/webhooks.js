const stripe = require('stripe')(process.env.STRIPESECRET);

module.exports = ({ router }) => {
    router.post("/webhook/stripe", async (ctx, next) => {
        
        // const sig = ctx.headers['stripe-signature'];
        // const body = ctx.request.fields

        // let event = null;
        // const endpointSecret = "whsec_Jlf0Hkl7vAUiWcgz3jJDetFONygod6OY";

        // try {
        //     event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        // }
        // catch (err) {
        //     // invalid signature
        //     ctx.status = 400;
        //     return await next();
        // }
        // const intent = event.data.object
        
        const intent = ctx.request.fields
        
        if(intent.type === "payment_intent.succeeded") {
            console.log(intent)
            // intent.id 
            ctx.body = "successfully captured payment and sent order for fulfillment"
        } else if(intent.type === "payment_intent.payment_failed") {
            const message = intent.last_payment_error && intent.last_payment_error.message;
            console.log('Failed:', intent.id, message);
            ctx.body = "successfully acknowledged failed payment, contacting customer by email"
        } else {
            ctx.throw(500)
        }
    })
}