const stripe = require('stripe')(process.env.STRIPESECRET);

const Order = require('../models/order');

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
        
        const event = ctx.request.fields
        const intent = event.data.object;
        
        if(event.type === "payment_intent.succeeded") {
            console.log(intent)
            const order = await Order.findOne({ "payment.transactionId": intent.id })
            const charge = intent.charges.data.find((charge) => { return charge.paid === true })
            order.payment.paymentCard = {
                brand: charge.payment_method_details.card.brand,
                last4: charge.payment_method_details.card.last4
            }
            order.payment.invoiceURL = charge.receipt_url;
            order.payment.paymentStatus = "paid";
            order.fulfillment.orderStatus = "Awaiting fulfillment";
            await order.save()
            
            ctx.body = "successfully captured payment and sent order for fulfillment"
        } else if(event.type === "payment_intent.payment_failed") {
            const message = intent.last_payment_error && intent.last_payment_error.message;
            console.log('Failed:', intent.id, message);
            ctx.body = "successfully acknowledged failed payment, contacting customer by email"
        } else {
            ctx.throw(500)
        }
    })
}