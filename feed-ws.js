var config = require('./config');
var PORT = process.env.PORT || config.port || 3003
var metrics = {};
var blockNumber = 0, block, block_hash = '';
const axios = require('axios');
const sleep = require('sleep');
const WS = require('ws');
const Chain3 = require('chain3');

const chain3 = new Chain3();
chain3.setProvider(new chain3.providers.HttpProvider(config.chain3_provider || 'http://127.0.0.1:8545'));

blockNumber = chain3.mc.blockNumber;
while ( ! block ) {
	block = chain3.mc.getBlock(blockNumber);
}
metrics.block = block;
//console.log(chain3.mc.syncing);
//console.log(chain3.mc.getBalance('0x77e026289892f430e16562e0e825b3051e027109').toString(10) / 1e18);

var wsc = new WS('ws://127.0.0.1:' + PORT + '/ws/moac',{origin: 'https://datafeed.daszichan.com'});
//var wsc = new WS(config.ws_proto + '://' + config.host_fqdn + ':' + PORT + '/ws/moac',{origin: 'https://datafeed.daszichan.com'});

wsc.on('open', () => {
	console.log("...feeding data...");
	wsc.send(JSON.stringify(metrics));
});

wsc.on('close', () => console.log("about to close"));

wsc.on('message', function (data) {
	console.log(`received ${data}`);
});

wsc.on('error', () => console.log("error happend, closing ..."))

function getNextBlock() {
	block = chain3.mc.getBlock(blockNumber + 1, true);
	console.log(blockNumber + 1);
	metrics = {};
	if (block) {
		block2 = chain3.mc.getBlock(blockNumber - 9);
		blockNumber += 1;
		metrics.block = block;

		metrics.info_moac = {
			block_current: blockNumber,
			block_timedelta: block.timestamp - block2.timestamp ,
			block_difficulty: block.difficulty,
			version_api: chain3.version.api,
			version_moac: chain3.version.moac,
			version_network: chain3.version.network
		};

		//async function getCoinMarketCap() {
		//	try {
		//		const response_cmc = await axios.get('https://api.coinmarketcap.com/v1/ticker/moac/');
		//		metrics.info_cmc = response_cmc.data[0];
		//		console.log(metrics.info_cmc);
		//	} catch (error) {
		//		console.error(error);
		//	}
		//	wsc.send(JSON.stringify(metrics));
		//}
		//getCoinMarketCap();

		async function getJsonStat() {
			try {
				const response_stat = await axios.get('http://localhost:8000/drf/jsonstats/1/');
				metrics.info_stat = response_stat.data;
				//console.log(metrics.info_stat);
			} catch (error) {
				console.error(error);
			}
			wsc.send(JSON.stringify(metrics));
		}
		getJsonStat();

	}
	//console.log(block);
}
//wsc.send("triggering braodcase of current state");
sleep.sleep(3);
setInterval(getNextBlock,5000);
setInterval(() => wsc.send(JSON.stringify({})),17000);
