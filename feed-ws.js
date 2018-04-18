var config = require('./config');
var PORT = process.env.PORT | config.port | 3002
var metrics = {};
var blockNumber = 0, block, block_hash = '';
const sleep = require('sleep');
const WS = require('ws');
const Chain3 = require('chain3');

const chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider('http://127.0.0.1:8545'));

blockNumber = chain3.mc.blockNumber;
while ( ! block ) {
	block = chain3.mc.getBlock(blockNumber);
}
metrics.block = block;
//console.log(chain3.mc.syncing);
//console.log(chain3.mc.getBalance('0x77e026289892f430e16562e0e825b3051e027109').toString(10) / 1e18);

var wsc = new WS('ws://127.0.0.1:' + PORT + '/ws/moac',{origin: 'https://datafeed.daszichan.com'});
//var wsc = new WS(config.ws_proto + '://' + config.host_fqdn + ':' + PORT + '/ws/moac',{origin: 'https://datafeed.daszichan.com'});

console.log(wsc)

wsc.on('open', () => {
	console.log("...feeding data...");
	wsc.send(JSON.stringify(metrics));
});

wsc.on('close', () => console.log("about to close"));

wsc.on('message', function (data) {
	console.log(`received ${data}`);
});

wsc.on('error', () => console.log("error happend"))

function getNextBlock() {
	block = chain3.mc.getBlock(blockNumber + 1);
	console.log(blockNumber + 1);
	metrics = {}
	if (block) {
		blockNumber += 1;
		metrics.block = block;
		wsc.send(JSON.stringify(metrics));
		//console.log(block);
	}
}
//wsc.send("triggering braodcase of current state");
sleep.sleep(3);
setInterval(getNextBlock,4000);
setInterval(() => wsc.send(JSON.stringify({})),17000);
