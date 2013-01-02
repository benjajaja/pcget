var show = {};

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
	chrome.pageAction.hide(tabId);
	if (change.status == "complete" && tab.url.indexOf('http://piratecloud.tv/') === 0 && tab.url.indexOf('fichas/ver/') !== -1) {
		var match = tab.url.match(/\/fichas\/ver\/([0-9]*)/);
		if (match[1]) {
			show.id = parseInt(match[1]);
			
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendMessage(tab.id, 'seasons', function(data) {
					console.log('response of seasons', data);
					if (data.seasons) {
						show.seasons = data.seasons.split(',');
					} else {
						show.seasons = [];
					}
					show.name = data.name;
					chrome.pageAction.show(tabId);
				});
			});
		}
	}
});

