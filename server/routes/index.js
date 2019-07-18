const send = require("koa-send");
const passport = require("koa-passport")
const User = require("../models/user")
const validate = require("zxcvbn");

module.exports = ({ router }) => {
    
    router.get('/admin', async (ctx, next) => {
        if(ctx.isAuthenticated()) {
            await send(ctx, './views/admin/index.html');
        } else {
            ctx.redirect("/admin/login")
        }
    })
    
    router.get('/admin/login', async (ctx, next) => {
        if(ctx.isAuthenticated()) {
            ctx.redirect("/admin")
        } else {
            const user = await User.findOne()
            if(user) {
                await send(ctx, './views/login.html');
            } else {
                ctx.redirect("/admin/register")
            }
        }
    })
    
    router.post("/admin/login", passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/admin/login'
    }))
    
    router.get("/admin/register", async (ctx, next) => {
        if(ctx.isAuthenticated()) {
            ctx.redirect("/admin")
        } else {
            const user = await User.findOne()
            if(user) {
                ctx.redirect("/admin/login")
            } else {
                await send(ctx, './views/register.html');
            }
        }
    })
    
    router.post("/admin/register", async (ctx, next) => {
        const { score } = validate(ctx.request.fields.password)
        if(score < 2 || ctx.request.fields.password_confirm !== ctx.request.fields.password || ctx.request.fields.email.indexOf("@") < 0 || ctx.request.fields.email.indexOf(".") < 0) {
            ctx.redirect("/admin/register")
        } else {
            const newUser = await User.create({
                username: "admin",
                email: ctx.request.fields.email,
                isRoot: true,
                displayName: "Admin"
            })
            newUser.password = newUser.generateHash(ctx.request.fields.password);
            newUser.save()
            await ctx.login(newUser.id);
            ctx.redirect("/admin/setup/wizard")
        }
    })
    
    router.post("/admin/logout", async (ctx, next) => {
        if (ctx.isAuthenticated()) {
            ctx.logout();
            ctx.redirect('/admin/login');
        } else {
            ctx.body = { success: false };
            ctx.throw(401);
        }
    })
    
    router.get('/admin/*', async (ctx, next) => {
        if(ctx.isAuthenticated()) {
            await send(ctx, './views/admin/index.html');
        } else {
            ctx.redirect("/admin/login")
        }
    })
    
    router.get('*', async (ctx, next) => {
        await send(ctx, './views/glass/index.html');
    })
};