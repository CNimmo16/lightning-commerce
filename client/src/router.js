import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from './views/Dashboard.vue'
import Login from './views/Login.vue'
// customer components
import CustomersMain from './views/Customers/Index.vue'
import Customer from './views/Customers/Customer.vue'
// product components
import ProductsMain from './views/Products/Index.vue'
import NewProduct from './views/Products/New.vue'
import Product from './views/Products/Product.vue'
// inventory components
import InventoryMain from './views/Inventory/Index.vue'
import NewStockAdjustment from './views/Inventory/New.vue'
// promotion components
import PromotionMain from './views/Promotions/Index.vue'
import NewPromotion from './views/Promotions/New.vue'
// order components
import OrderMain from './views/Orders/Index.vue'
import FulfillmentWizard from './views/Orders/FulfillmentWizard.vue'
import Order from './views/Orders/Order.vue'
// setup components
import SetupMain from './views/Setup/Index.vue'
import ShippingSetup from './views/Setup/Shipping.vue'
import NewShippingMethod from './views/Setup/NewShippingMethod.vue'
import CurrencySetup from './views/Setup/Currencies.vue'
// setup wizard components
import SetupWizardGateway from './views/Setup/Wizard/1_Gateway.vue'
import SetupWizardLocales from './views/Setup/Wizard/2_Locales.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        // customer routes
        {
            path: "/customers",
            name: "customers",
            component: CustomersMain
        },
        {
            path: "/customers/:id",
            name: "customer",
            component: Customer,
            props: true
        },
        // product routes
        {
            path: "/products",
            name: "products",
            component: ProductsMain
        },
        {
            path: "/products/new",
            name: "newProduct",
            component: NewProduct
        },
        { 
            path: '/products/:id',
            name: "product",
            component: Product, 
            props: true 
        },
        // inventory routes
        {
            path: "/inventory",
            name: "inventory",
            component: InventoryMain
        },
        {
            path: "/inventory/new",
            name: "newAdjustment",
            component: NewStockAdjustment
        },
        // promotion routes
        {
            path: "/promotions",
            name: "promotions",
            component: PromotionMain
        },
        {
            path: "/promotions/new",
            name: "newPromotion",
            component: NewPromotion
        },
        // order routes
        {
            path: "/orders",
            name: "orders",
            component: OrderMain
        },
        { 
            path: '/orders/:id',
            name: "order",
            component: Order, 
            props: true 
        },
        {
            path: "/fulfillment",
            name: "fulfillment",
            component: FulfillmentWizard
        },
        // setup routes
        {
            path: "/setup",
            name: "setup",
            component: SetupMain
        },
        {
            path: "/setup/shipping",
            name: "shipping-setup",
            component: ShippingSetup
        },
        {
            path: "/setup/shipping/new",
            name: "new-shipping-method",
            component: NewShippingMethod
        },
        {
            path: "/setup/currencies",
            name: "currency-setup",
            component: CurrencySetup
        },
        // setup wizard routes
        {
            path: "/welcome",
            redirect: "/welcome/payment-provider"
        },
        {
            path: "/welcome/payment-provider",
            name: "setup-wizard-gateway",
            component: SetupWizardGateway
        },
        {
            path: "/welcome/locales",
            name: "setup-wizard-locales",
            component: SetupWizardLocales
        },
    ],
    methods: {
        setData (err, product) {
            if (err) {
                this.error = err.message
            } else {
                this.product = product
            }
        }
    }
})
