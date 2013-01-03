var getSeason = function(season) {
	var alert = function(text) {
		var alert = document.createElement('div');
		alert.className = 'alert alert-error';
		
		var x = document.createElement('button');
		x.className = 'close';
		x.innerHTML = '&times';
		x.addEventListener('click', function() {
			window.close();
		});
		alert.appendChild(x);
		
		var p = document.createElement('p');
		p.innerText = text;
		alert.appendChild(p);
		
		return alert;
	};

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			var div = document.createElement('div');
			div.innerHTML = xhr.response;
			
			var titles = Array.prototype.slice.call(div.getElementsByClassName('rlsliB')).map(function(li) {
				var title = {
					number: li.children[0].innerText.replace(/\s+/g, ''),
					title: li.children[1].innerText.replace(/^\s+/, ''),
				};
				console.log('title: "' + title.title + '" number "' + title.number + '"');
				
				var a = li.getElementsByClassName('archivo subscription')[0];
				if (a) {
					title.id = parseInt(a.id.match(/medi([0-9]*)/)[1]);
				} else {
					a = li.getElementsByClassName('glyph links tip')[0];
					title.link = parseInt(a.id.match(/epiLink([0-9]*)/)[1]);
				}
				return title;
			});
			
			if (titles.length === 0) {
				document.body.innerHTML = '';
				document.body.appendChild(alert('No he encontrado ningún judío, Señor.'));
				
			} else {
				console.log(titles[0].number);
				clear();
								
				var list = document.createElement('div');
				document.body.appendChild(list);
				
				titles.map(function(title) {
					list.appendChild((function(title) {
						var li = document.createElement('div');
						li.className = 'row';
						
						var span = document.createElement('strong');
						span.innerText = title.number;
						span.className = 'span1';
						li.appendChild(span);
						
						var links = document.createElement('strong');
						links.innerText = '-';
						links.href = '#';
						links.className = 'span1';
						li.appendChild(links);
						
						var a = document.createElement('a');
						a.href = '#' + title.id;
						a.innerText = title.title;
						a.className = 'span7';
						a.addEventListener('click', function() {
							getLink(title, function(urls) {
								if (urls.length > 0) {
									links.innerText = '';
									urls.forEach(function(url, i) {
										var a = document.createElement('a');
										a.href = url;
										a.innerText = i + 1;
										a.target = '_blank';
										
										if (chrome.downloads) {
											a.addEventListener('click', function(e) {
												e.preventDefault();
												console.log('Download! ' + url);
												var ext = url.substr(url.lastIndexOf('.'));
												chrome.downloads.download({
													url: url,
													filename: chrome.extension.getBackgroundPage().show.name + ' ' + season + 'x'
														+ title.number
														+ ' ' + title.title + ext,
													saveAs: true
												});
											});
										}
										
										links.appendChild(a);
										links.appendChild(document.createTextNode(' '));
									});
								} else {
									links.innerText = 'error/none found';
								}
							});
						});
						li.appendChild(a);
						
						span = document.createElement('span');
						span.innerText = title.id;
						span.className = 'span1';
						li.appendChild(span);
						
						return li;
					})(title))
				});
			}
			
			
		}
	};
	xhr.open("GET", 'http://piratecloud.tv/fichas/loadEpisodios/' + chrome.extension.getBackgroundPage().show.id + '/' + season, true);
	xhr.send();
};

var getLink = function(title, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			var div = document.createElement('div');
			div.innerHTML = JSON.parse(xhr.response).html;
			callback(extractLink(div, !!title.link));
		}
	};
	if (title.id) {
		xhr.open("GET", 'http://piratecloud.tv/fichas/getMedia/' + title.id, true);
	} else {
		xhr.open("GET", 'http://piratecloud.tv/fichas/loadEpisodioLinks/' + title.link, true);
	}
	xhr.send();
};

var extractLink = function(html, isLink) {
	if (!isLink) {
		var elements = html.getElementsByTagName('embed');
		if (!elements || elements.length === 0) {
			return [];
		} else {
			if (elements[0].hasAttribute('target')) {
				return [elements[0].getAttribute('target')];
			} else if (elements[0].hasAttribute('src')) {
				return [elements[0].getAttribute('src')];
			} else {
				return [];
			}
		}
		
	} else {
		return Array.prototype.slice.call(html.children[0].children).map(function(li) {
			return li.children[0].children[0].href;
		});
	}
};

var clear = function() {
	document.body.innerHTML = '<button type="button" class="close" data-dismiss="alert">&times;</button>'
		+ '<h1>' + chrome.extension.getBackgroundPage().show.name + '</h1>';
	document.getElementsByTagName('button')[0].onclick = window.close.bind(window);
	var div = document.createElement('div');
	div.className = 'pagination';
	
	var ul = document.createElement('ul');
	chrome.extension.getBackgroundPage().show.seasons.forEach(function(season) {
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.href = '#';
		a.innerText = season;
		a.addEventListener('click', function() {
			getSeason(parseInt(season));
		});
		li.appendChild(a);
		ul.appendChild(li);
	});
	div.appendChild(ul);
	
	document.body.appendChild(div);
};

getSeason(1);