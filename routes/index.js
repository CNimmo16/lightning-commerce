const send = require("koa-send");

module.exports = ({ router }) => {
    router.get('/admin', async (ctx, next) => {
        await send(ctx, '/views/admin/index.html');
    })
    
    router.get('/admin/*', async (ctx, next) => {
        await send(ctx, '/views/admin/index.html');
    })
    
    router.get('*', async (ctx, next) => {
        await send(ctx, '/views/user/index.html');
    })
};