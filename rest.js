module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
				if (!/json/i.test(ctx.request.headers.accept) && /html/i.test(ctx.request.headers.accept)) {
                	ctx.rest = (data) => {
						//ctx.render('api.html', {data: data});
						ctx.render('api.html', {data: data});
					}
				} else {
                    ctx.rest = (data) => {
                        ctx.response.type = 'application/json';
                        ctx.response.body = data;
                    }
				}
                try {
                    await next();
                } catch (e) {
                    console.log('Process API error...');
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
        };
    }
};
