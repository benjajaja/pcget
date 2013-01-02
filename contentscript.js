chrome.extension.onMessage.addListener(function(command, sender, sendResponse) {
	console.log('message.', command);
	if (command === 'seasons') {
		var elements = document.getElementsByClassName('subscription');
		
		var seasons = Array.prototype.slice.call(elements).map(function(a) {
			return a.getAttribute('temporada');
		}).reduce(function(list, element) {
			if (element) {
				list.push(element);
			}
			return list;
		}, []);
		
		var elements = document.getElementsByClassName('transaction');
		seasons = Array.prototype.slice.call(elements).map(function(a) {
			return a.getAttribute('temporada');
		}).reduce(function(list, element) {
			if (element) {
				list.push(element);
			}
			return list;
		}, seasons);
		
		seasons.sort();
		
		sendResponse(seasons.join(','));
    }
});