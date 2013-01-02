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
		
		var name;
		Array.prototype.slice.call(document.getElementsByTagName('h1')).map(function(h1) {
			if (h1.getAttribute('itemprop') == 'name') {
				name = h1.innerText;
			}
		})[0];
		
		
		sendResponse({seasons: seasons.join(','), name: name});
    }
});