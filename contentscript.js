chrome.extension.onMessage.addListener(function(command, sender, sendResponse) {
	console.log('message.', command);
	if (command === 'seasons') {
		var elements = document.getElementsByClassName('subscription');
		if (!elements || elements.length === 0) {
			sendResponse(null);
			
		} else {
			console.log('seasons: ', elements);
			var seasons = Array.prototype.slice.call(elements).map(function(a) {
				return a.getAttribute('temporada');
			}).reduce(function(list, element) {
				if (element) {
					list.push(element);
				}
				return list;
			}, []);
			sendResponse(seasons.join(','));
		}
    }
});