chrome.extension.onMessage.addListener(function(command, sender, sendResponse) {
	if (command === 'getlink') {
		var elements = document.getElementsByTagName('embed');
		if (!elements || elements.length === 0) {
			sendResponse(null);
		} else {
			//sendResponse(elements[0].getAttribute('target'));
			if (elements[0].playlist) {
				elements[0].playlist.stop();
			}
			
			
			elements[0].parentNode.appendChild((function(url) {
				var a = document.createElement('a');
				a.href = url;
				a.innerText = url;
				
				var h = document.createElement('h1');
				h.appendChild(a);
				return h;
			})(elements[0].getAttribute('target')));
		}
    }
});