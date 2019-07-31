import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        cart: {
            items: [],
            subtotal: 0
        },
        activeOrder: null
    },
    mutations: {
        addToCart(state, context) {
            const i = state.cart.items.findIndex((item) => { return item.product._id === context.product._id })
            if(i > -1) {
                state.cart.items[i].quantity += context.quantity
                state.cart.subtotal += context.product.inventory.price * context.quantity
            } else {
                state.cart.items.push({
                    product: context.product,
                    quantity: context.quantity
                })
                state.cart.subtotal += context.product.inventory.price * context.quantity
            }
        },
        createOrder(state, context) {
            state.activeOrder = {
                items: state.cart.items,
                shippingMethod: null,
                subtotal: context.subtotal,
                total: context.subtotal,
                paymentIntent: context.paymentIntent
            }
        },
        addShippingAddress(state, context) {
            state.activeOrder.shippingAddress = context.shippingAddress
            state.activeOrder.email = context.email
        },
        addShippingMethod(state, method) {
            state.activeOrder.shippingMethod = method;
            state.activeOrder.total = state.activeOrder.subtotal + method.cost
        },
        addBillingAddress(state, address) {
            state.activeOrder.billingAddress = address
        },
        completeOrder(state) {
            state.activeOrder.complete = true
            state.cart.items = []
            state.cart.subtotal = 0
        },
        resetOrder(state) {
            state.activeOrder = null;
        }
    },
    actions: {
        
    }
})
