const   Koa     = require("koa"),
        app     = new Koa();
        
const Router  = require("koa-router");

// bodyparser setup
var body = require('koa-better-body')
const formidable = require("formidable")

app.use(body())
    // .use(body({
    //     IncomingForm: new formidable.IncomingForm()
    // }))
    // .use(function * (next) {
    //     console.log(this.request.files)
    //     var form = new formidable.IncomingForm()
    //     this.request.IncomingForm.parse(this.request.files, function(err, fields, files) {
    // });

    //     yield next
    // })

// environment config
require('dotenv').config({path: __dirname + '/process.env'})

//db connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
    // Error logging
    const logger = require("koa-logger");
    app.use(logger())
}

// enable cors DISABLE IN PRODUCTION
// if(process.env.DEVELOPMENT === "true") {
    // app.use(async (ctx, next) => {
    //     ctx.set('Access-Control-Allow-Origin', '*');
    //     ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    //     ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    //     return next();
    // });
// }

// error handling
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


// serve public assets
const serve = require("koa-static");
const mount = require("koa-mount");
app.use(mount("/public", serve("./public")));

// import route files
const router = new Router()
require('./routes/index')({ router: router });
const apiRouter = new Router({prefix: "/api"});
require('./routes/products')({ router: apiRouter });
require('./routes/categories')({ router: apiRouter });
require('./routes/orders')({ router: apiRouter });
require('./routes/inventory')({ router: apiRouter });
require('./routes/images')({ router: apiRouter });

app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});

module.exports = server;
