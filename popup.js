var id = chrome.extension.getBackgroundPage().showId;

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
			return {
				number: li.children[0].innerText.replace(/^\s+/, ''),
				title: li.children[1].innerText,
				id: parseInt(li.getElementsByClassName('archivo subscription')[0].id.match(/medi([0-9]*)/)[1])
			};
		});
		
		if (titles.length === 0) {
			document.body.innerHTML = '';
			document.body.appendChild(alert('No he encontrado ningún judío, Señor.'));
			
		} else {
			console.log(titles[0].number);
			document.body.innerHTML = '';
			
			/*document.body.appendChild((function() {
				var x = document.createElement('button');
				x.className = 'close';
				x.innerHTML = '&times';
				x.addEventListener('click', function() {
					window.close();
				});
				return x;
			})());*/
			
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
					
					var link = document.createElement('a');
					link.innerText = '-';
					link.href = '#';
					link.className = 'span1';
					li.appendChild(link);
					
					var a = document.createElement('a');
					a.href = '#' + title.id;
					a.innerText = title.title;
					a.className = 'span7';
					a.addEventListener('click', function() {
						getLink(title, function(url) {
							link.href = url;
							link.innerText = 'Descargar';
							link.target = '_blank';
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
xhr.open("GET", 'http://piratecloud.tv/fichas/loadEpisodios/' + id + '/1', true);
xhr.send();

var getLink = function(title, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			var div = document.createElement('div');
			try {
				div.innerHTML = JSON.parse(xhr.response).html;
				callback(extractLink(div));
			} catch (e) {
				console.log('http://piratecloud.tv/fichas/getMedia/' + title.id, e, xhr.response);
			}
			
		}
	};
	xhr.open("GET", 'http://piratecloud.tv/fichas/getMedia/' + title.id, true);
	xhr.send();
};

var extractLink = function(html) {
	var elements = html.getElementsByTagName('embed');
	if (!elements || elements.length === 0) {
		return null;
		
	} else {
		return elements[0].getAttribute('target');
		
	}
};