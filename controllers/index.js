// index:
const config = require('../config');

module.exports = {
    'GET /': async (ctx, next) => {
        let user = ctx.state.user;
        ctx.render('home.html', {ws_proto: config.ws_proto});
    }
};
