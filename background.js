var showId;

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
	chrome.pageAction.hide(tabId);
	showId = null;
	if (change.status == "complete" && tab.url.indexOf('http://piratecloud.tv/') === 0 && tab.url.indexOf('fichas/ver/') !== -1) {
		var match = tab.url.match(/\/fichas\/ver\/([0-9]*)/);
		if (match[1]) {
			showId = parseInt(match[1]);
			
			chrome.pageAction.show(tabId);
			
			
		}
	}
});

