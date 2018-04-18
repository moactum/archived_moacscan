var config = require('./config');

const PORT = process.env.PORT | config.port | 3000; 

const url = require('url');

const ws = require('ws');

const rest = require('./rest');
//const Cookies = require('cookies');

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const controller = require('./controller');

const templating = require('./templating');

const WebSocketServer = ws.Server;

const app = new Koa();


// log request URL:
app.use(async (ctx, next) => {
	console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
	await next();
});


// static file support:
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

app.use(async (ctx, next) => {
	if (ctx.request.path === '/robots.txt') {
		ctx.response.redirect('/static/robots.txt');
	} else {
		await next();
	}
});
// parse request body:
app.use(bodyParser());

// add nunjucks as view:
app.use(templating('views', {
	noCache: true,
	watch: true,
}));

// bind .rest() for ctx:
app.use(rest.restify());

// add controller middleware:
app.use(controller());

let server = app.listen(PORT);

function parseUser(obj) {
	return;
}

function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
	let wss = new WebSocketServer({
		server: server,
		path: '/ws/moac'
	});
	wss.broadcast = function broadcast(data) {
		wss.clients.forEach(function each(client) {
			if (client.readyState === ws.OPEN) {
				client.send(data);
			}
		});
	};
	onConnection = onConnection || function () {
		console.log('[WebSocket] connected.');
	};
	onMessage = onMessage || function (msg) {
		console.log('[WebSocket] message received: ' + msg);
	};
	onClose = onClose || function (code, message) {
		console.log(`[WebSocket] closed: ${code} - ${message}`);
	};
	onError = onError || function (err) {
		console.log('[WebSocket] error: ' + err);
	};
	wss.on('connection', function (ws,req) {
		let location = url.parse(req.url, true);
		console.log('[WebSocketServer] connection: ' + location.href);
		//console.log(req);
		try {
			if (req.headers.origin.match(/feed/)) {
				ws.on('message', onMessage);
			} else {
				ws.on('message', () => console.log('...exluding non feed data'));
			}
		}
		catch(e) {
			ws.on('message', onMessage);
		}
		ws.on('close', onClose);
		ws.on('error', onError);
		if (location.pathname !== '/ws/moac') {
			// close ws:
			ws.close(4000, 'Invalid URL');
		}
		// check user:
		let user = { name: 'undefined' };
		ws.user = user;
		ws.wss = wss;
		onConnection.apply(ws);
	});
	console.log('WebSocketServer was attached.');
	return wss;
}

var messageIndex = 0;

function createMessage(type, data) {
	messageIndex ++;
	return JSON.stringify({
		id: messageIndex,
		type: type,
		data: data
	});
}

function onConnect() {
	//let user = this.user;
	//let msg = createMessage('join', "new client connected");
	//this.wss.broadcast(msg);
	// build user list:
	//let users = [];
	//this.wss.clients.forEach(function (client) {
	//	users.push( client.user );
	//});
	let connections = this.wss.clients.size
	this.wss.broadcast(createMessage('serverinfo', {sockconn: connections}));
	console.log(`...there are ${connections} clients`)
}

function onMessage(message) {
	//console.log(message);
	if (message && message.trim()) {
		let msg = createMessage('datafeed', JSON.parse(message));
		this.wss.broadcast(msg);
		console.log(`there are  ${this.wss.clients.size} clients ...`);
	}
}

function onClose() {
	let connections = this.wss.clients.size
	//this.wss.broadcast(createMessage('serverinfo', {sockconn: connections}));
	console.log(`...there are ${connections} clients`)
}

app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);

//setTimeout(() => app.wss.broadcast(createMessage('serverinfo',{sockconn: app.wss.clients.size}), 3000));
//setTimeout(() => app.wss.broadcast(createMessage('datafeed',{hashrate: 100, blocknumber: 200, txcount: 300}), 1000));
console.log(`app started at port ${PORT} ...`);
