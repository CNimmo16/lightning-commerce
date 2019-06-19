const send = require("koa-send");

module.exports = ({ router }) => {
    router.get('*', async (ctx, next) => {
        await send(ctx, '/views/admin/index.html');
    })
};