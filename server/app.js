const   Koa     = require("koa"),
        app     = new Koa();
        
const   Router  = require("koa-router"),
        body    = require('koa-better-body'),
        session = require('koa-session'),
        passport = require('koa-passport'),
        serve = require("koa-static"),
        mount = require("koa-mount"),
        path = require ("path");

// ==== KOA Middleware Setup ====
    // body parser
    app.use(body())
    
    app.use(async(ctx, next) => {
        ctx.request.body = ctx.request.fields;
        await next()
    })
    
    // serve assets
    app.use(mount("/public", serve(path.join(__dirname, "/public"))));
    
    // session
    app.keys = ['whatever-comes-to-mind'];
    app.use(session({}, app));
    
    // authentication
    require('./auth');
    app.use(passport.initialize());
    app.use(passport.session());

// ==== Environment Config ====
    require('dotenv').config({path: __dirname + '/process.env'})

// ==== Database Setup ====
    const mongoose = require("mongoose");
    mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));

// ==== Error Handling ====
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            console.error(err)
            ctx.status = err.status || 500;
            ctx.body = err.message;
            ctx.app.emit('error', err, ctx);
        }
    });

// ==== Router Configuration ====

    const router = new Router()
    const adminRouter = new Router({prefix: "/api/admin"});
    const apiRouter = new Router({prefix: "/api"});
    
    // webhook routes
    require('./routes/webhooks')({ router: router });
    
    // admin api routes
    require('./routes/admin/products')({ router: adminRouter });
    require('./routes/admin/categories')({ router: adminRouter });
    require('./routes/admin/orders')({ router: adminRouter });
    require('./routes/admin/inventory')({ router: adminRouter });
    require('./routes/admin/images')({ router: adminRouter });
    require('./routes/admin/customers')({ router: adminRouter });
    require('./routes/admin/currencies')({ router: adminRouter });
    require('./routes/admin/auth')({ router: adminRouter });
    
    // public api routes
    require('./routes/api')({ router: apiRouter });
    
    // view routes
    require('./routes/index')({ router: router });
    
    app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
    app.use(adminRouter.routes()).use(adminRouter.allowedMethods());
    app.use(router.routes()).use(router.allowedMethods());
    
// ==== Server Initialisation ====

const server = app.listen(process.env.PORT || 8080, async() => {
    console.log(`Example app listening on port ${process.env.PORT || 8080}!`);
    // create setup object if doesn't exist
    const Setup = require(path.join(__dirname, '/models/setup'));
    const setupObject = await Setup.findOne({})
    if(!setupObject) {
        Setup.create({
            primaryCurrency: {
                name: "United States Dollar",
                symbol: "USD"
            },
            usableCurrencies: [{
                name: "United States Dollar",
                symbol: "USD"
            }],
        })
    }
});

module.exports = server;
