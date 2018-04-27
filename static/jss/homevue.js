function addMessage(list, msg) {
	list.unshift(msg);
	$('#message-list').parent().animate({
		scrollTop: $('#message-list').height()
	}, 1000);
}
function addTxs(list, msg) {
	msg.data.block.transactions.forEach( tx => list.unshift(tx) );
	$('#tx-list').parent().animate({
		scrollTop: $('#tx-list').height()
	}, 1000);
}

$(function () {
	var vmMessageList = new Vue({
		el: '#scrollbar2',
		data: {
			messages: []
		},
		methods: {
			block: function (msg) {
				window.open(`/api/block/${msg.data.block.hash}`);
			}
		}
	});
	var vmTxList = new Vue({
		el: '#scrollbar',
		data: {
			txs: []
		},
		methods: {
			transaction: function (tx) {
				window.open(`/api/tx/${tx}`);
			},
		}
	});
	var vmCmcDict = new Vue({
		el: '#graph_one',
		data: {
			info_cmc: {},
			info_moac: {}
		}
	});
	var vmMoacDict = new Vue({
		el: '#moac_info',
		data: {
			info_moac: {}
		}
	});

	var ws_conncted = true;

	ws.onmessage = function(event) {
		var data = event.data;
		console.log("received new websocket message");
		var msg = JSON.parse(data);
		if (msg.type === 'datafeed') {
			if (msg.data.block) {
				addMessage(vmMessageList.messages, msg);
				addTxs(vmTxList.txs, msg);
			}
			if (msg.data.info_cmc) {
				vmCmcDict.info_cmc = msg.data.info_cmc;
			}
			if (msg.data.info_moac) {
				vmCmcDict.info_moac = msg.data.info_moac;
				vmMoacDict.info_moac = msg.data.info_moac;
			}
		}
	};
	ws.onclose = function (evt) {
		console.log('[closed] ' + evt.code);
		ws_connected = false;
	};
	ws.onerror = function (code, msg) {
		console.log('[ERROR] ' + code + ': ' + msg);
		ws_connected = false;
	};

	$('#containerchart').highcharts({
		  chart: {
				type: 'line',
				spacingBottom: 0,
				spacingTop: 0,
				spacingLeft: 0,
				spacingRight: 0,
		  },
		  legend: {
				enabled: false
		  },
		  exporting: {
				enabled: false
		  },
		  credits: {
				enabled: false
		  },
		  title: {
				text: '14 day Ethereum Transaction History',
				style: {
					 fontSize: '13px'
				}
		  },
		  xAxis: {
				title: { text: '' },
				categories: [
					 '4/5','4/6','4/7','4/8','4/9','4/10','4/11','4/12','4/13','4/14','4/15','4/16','4/17','4/18',
				]
		  },
		  yAxis: {
				labels: {
					 enabled: true
				},
				title: {
					 text: null
				}
		  },
		  
		  tooltip: {
				formatter: function () {
					 return '<span style="font-size:10px">' + this.point.friendlydate + '</span><br><table><tr><td style="padding:0">' +
							  '<span style="color:' + this.series.color + '">Transactions: </a></span><b>' + this.point.y + '</b><br>'									  
							  '</td></tr></table>';
				}
		  },
		  plotOptions: {
				series: {
					 animation: {
								duration: 0
					 },
					 point: {
						  events: {
								select: function (e) {
									 location.href = 'txs?dt=' + this.options.dt;
								}
						  }
					 }
				},
				column: {
					 pointPadding: 0.1,
					 borderWidth: 0
				}
		  },
		  series: [{
				name: 'Transactions',
				data: [{y : 695871, dt : '1522886400', friendlydate : 'Thu 5, Apr 2018',  },{y : 647981, dt : '1522972800', friendlydate : 'Fri 6, Apr 2018',  },{y : 535865, dt : '1523059200', friendlydate : 'Sat 7, Apr 2018',  },{y : 595733, dt : '1523145600', friendlydate : 'Sun 8, Apr 2018',  },{y : 609799, dt : '1523232000', friendlydate : 'Mon 9, Apr 2018',  },{y : 571388, dt : '1523318400', friendlydate : 'Tue 10, Apr 2018',  },{y : 609102, dt : '1523404800', friendlydate : 'Wed 11, Apr 2018',  },{y : 692606, dt : '1523491200', friendlydate : 'Thu 12, Apr 2018',  },{y : 730344, dt : '1523577600', friendlydate : 'Fri 13, Apr 2018',  },{y : 611188, dt : '1523664000', friendlydate : 'Sat 14, Apr 2018',  },{y : 619985, dt : '1523750400', friendlydate : 'Sun 15, Apr 2018',  },{y : 664402, dt : '1523836800', friendlydate : 'Mon 16, Apr 2018',  },{y : 742823, dt : '1523923200', friendlydate : 'Tue 17, Apr 2018',  },{y : 703293, dt : '1524009600', friendlydate : 'Wed 18, Apr 2018',  },],
				allowPointSelect: true,
		  },
		  ]
	 });
	 $('#containerchart').highcharts({
		  chart: {
				type: 'line',
				spacingBottom: 0,
				spacingTop: 0,
				spacingLeft: 0,
				spacingRight: 0,
		  },
		  legend: {
				enabled: false
		  },
		  exporting: {
				enabled: false
		  },
		  credits: {
				enabled: false
		  },
		  title: {
				text: '14 day Ethereum Transaction History',
				style: {
					 fontSize: '13px'
				}
		  },
		  xAxis: {
				title: { text: '' },
				categories: [
					 '4/5','4/6','4/7','4/8','4/9','4/10','4/11','4/12','4/13','4/14','4/15','4/16','4/17','4/18',
				]
		  },
		  yAxis: {
				labels: {
					 enabled: true
				},
				title: {
					 text: null
				}
		  },
		  
		  tooltip: {
				formatter: function () {
					 return '<span style="font-size:10px">' + this.point.friendlydate + '</span><br><table><tr><td style="padding:0">' +
							  '<span style="color:' + this.series.color + '">Transactions: </a></span><b>' + this.point.y + '</b><br>'									  
							  '</td></tr></table>';
				}
		  },
		  plotOptions: {
				series: {
					 animation: {
								duration: 0
					 },
					 point: {
						  events: {
								select: function (e) {
									 location.href = 'txs?dt=' + this.options.dt;
								}
						  }
					 }
				},
				column: {
					 pointPadding: 0.1,
					 borderWidth: 0
				}
		  },
		  series: [{
				name: 'Transactions',
				data: [{y : 695871, dt : '1522886400', friendlydate : 'Thu 5, Apr 2018',  },{y : 647981, dt : '1522972800', friendlydate : 'Fri 6, Apr 2018',  },{y : 535865, dt : '1523059200', friendlydate : 'Sat 7, Apr 2018',  },{y : 595733, dt : '1523145600', friendlydate : 'Sun 8, Apr 2018',  },{y : 609799, dt : '1523232000', friendlydate : 'Mon 9, Apr 2018',  },{y : 571388, dt : '1523318400', friendlydate : 'Tue 10, Apr 2018',  },{y : 609102, dt : '1523404800', friendlydate : 'Wed 11, Apr 2018',  },{y : 692606, dt : '1523491200', friendlydate : 'Thu 12, Apr 2018',  },{y : 730344, dt : '1523577600', friendlydate : 'Fri 13, Apr 2018',  },{y : 611188, dt : '1523664000', friendlydate : 'Sat 14, Apr 2018',  },{y : 619985, dt : '1523750400', friendlydate : 'Sun 15, Apr 2018',  },{y : 664402, dt : '1523836800', friendlydate : 'Mon 16, Apr 2018',  },{y : 742823, dt : '1523923200', friendlydate : 'Tue 17, Apr 2018',  },{y : 703293, dt : '1524009600', friendlydate : 'Wed 18, Apr 2018',  },],
				allowPointSelect: true,
		  },
		  ]
	 });
});
