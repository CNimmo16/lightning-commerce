const User = require("../../models/user");
const passport = require('koa-passport');
const sodium = require('sodium').api;

module.exports = ({ router }) => {

    router.post("/setup/users", async (ctx, next) => {
        const newUser = await User.create({
            username: ctx.request.fields.username
        })
        newUser.password = newUser.generateHash(ctx.request.fields.password);
        newUser.save()
        await passport.authenticate('local')
        ctx.body = "created user"
    })
    
    router.post("/login", passport.authenticate('local'), async (ctx, body) => {
        console.log(ctx.isAuthenticated())
        ctx.body = "logged in successfully"
    });
}