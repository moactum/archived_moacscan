var config = require('../config');

const sleep = require('sleep');

const Chain3 = require('chain3');

const chain3 = new Chain3();

chain3.setProvider(new chain3.providers.HttpProvider(config.chain3_provider || 'http://127.0.0.1:8545'));

const APIError = require('../rest').APIError;

module.exports = {
	'GET /api/block': async (ctx, next) => {
		ctx.rest({info: 'index not ready yet, use the search please'});
	},
	'GET /api/block/:hash_or_height': async (ctx, next) => {
		var data = chain3.mc.getBlock(ctx.params.hash_or_height, true);
		if (!data) {
			throw new APIError('invalid_data', 'not found');
		}
		ctx.rest(data);
	},
	'GET /api/uncle': async (ctx, next) => {
		ctx.rest({info: 'index not ready yet, use the search please'});
	},
	'GET /api/uncle/:hash_or_height': async (ctx, next) => {
		var data = chain3.mc.getUncle(ctx.params.hash_or_height,0);
		if (!data) {
			throw new APIError('invalid_data', 'not found');
		}
		ctx.rest(data);
	},
	'GET /api/uncle/:hash_or_height/:index': async (ctx, next) => {
		var data = chain3.mc.getUncle(ctx.params.hash_or_height,ctx.params.index);
		if (!data) {
			throw new APIError('invalid_data', 'not found');
		}
		ctx.rest(data);
	},
	'GET /api/tx': async (ctx, next) => {
		ctx.rest({info: 'index not ready yet, use the search please'});
	},
	'GET /api/tx/:hash': async (ctx, next) => {
		var data = chain3.mc.getTransaction(ctx.params.hash);
		if (!data) {
			throw new APIError('invalid_data', 'not found');
		}
		ctx.rest(data);
	},
	'GET /api/address': async (ctx, next) => {
		ctx.rest({info: 'index not ready yet, use the search please'});
	},
	'GET /api/address/:address': async (ctx, next) => {
		var data = chain3.fromSha(chain3.mc.getBalance(ctx.params.address));
		if (!data) {
			throw new APIError('invalid_data', 'not found');
		}
		ctx.rest({balance_moac: data});
	},
	'GET /api/search': async (ctx, next) => {
		ctx.rest({info: 'index not ready yet, use the search please'});
	},
	'GET /api/search/:hash': async (ctx, next) => {
		var data = chain3.mc.getBlock(ctx.params.hash, true);
		if (!data) {
			console.log("try tx")
			data = chain3.mc.getTransaction(ctx.params.hash);
			if (!data) {
				console.log("try wallet")
				data = chain3.fromSha(chain3.mc.getBalance(ctx.params.hash));
				if (!data) {
					throw new APIError('invalid_data', 'not found');
				} else {
					ctx.rest({balance_moac: data});
				}
			} else {
				ctx.rest(data);
			}
		} else {
			ctx.rest(data);
		}
	}
}
