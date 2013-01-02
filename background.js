var showId, seasons;

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
	chrome.pageAction.hide(tabId);
	showId = null, seasons = null;
	if (change.status == "complete" && tab.url.indexOf('http://piratecloud.tv/') === 0 && tab.url.indexOf('fichas/ver/') !== -1) {
		var match = tab.url.match(/\/fichas\/ver\/([0-9]*)/);
		if (match[1]) {
			showId = parseInt(match[1]);
			
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendMessage(tab.id, 'seasons', function(string) {
					console.log('response of seasons', string);
					if (string) {
						seasons = string.split(',');
					} else {
						seasons = [];
					}
					chrome.pageAction.show(tabId);
				});
			});
		}
	}
});

