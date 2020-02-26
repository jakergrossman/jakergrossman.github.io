// populate music sheet once page has loaded
window.onload = populateMusic()

document.onkeydown = function(e) {
	e = e || window.event;
	var isEscape = false;

	if ('key' in e) {
		isEscape = (e.key === 'Escape' || e.key === 'Esc');
	} else {
		isEscape = (e.keyCode === 27);
	}

	if (isEscape) {
		if (document.getElementById('music-overlay') !== null) {
			closeMusicOverlay();
			return;
		}

		if (!document.getElementById('music-pane').classList.contains('hidden')) {
			showLanding();
			return;
		}
	}
}

function showMusicPane() {
	let landing = document.getElementById('landing');
	let music   = document.getElementById('music-pane');
	let back    = document.getElementById('back');

	landing.classList.add('hidden');
	music.classList.remove('hidden');
	back.classList.remove('hidden');

	setTimeout(function() {
		back.style.left = '1em';
	}, 500);
}

function showLanding() {
	let landing		 = document.getElementById('landing');
	let music		 = document.getElementById('music-pane');
	let musicOverlay = document.getElementById('music-overlay');
	let back		 = document.getElementById('back');

	// if music-preview is open, delete it
	if (musicOverlay !== null) {
		musicOverlay.remove();
	}

	landing.classList.remove('hidden');
	music.classList.add('hidden');

	setTimeout(function() {
		back.style.left = (back.offsetWidth * -1) + 'px';
	}, 500);
}

function createMusicOverlay(filename) {
	if (document.getElementById('music-overlay') !== null) {
		// music-overlay already exists, return
		return;
	}

	let musicOverlay = document.createElement('div');
	musicOverlay.id = ('music-overlay');

	let sheetMusic = document.createElement('embed');
	sheetMusic.src = filename + '#toolbar=0&navpanes=0&scrollbar=0&view=fitH&statusbar=0';
	sheetMusic.type = 'application/pdf';
	sheetMusic.addEventListener('keypress', document.onkeydown);

	sheetMusic.width  = screen.width * .5;
	sheetMusic.height = screen.height * .8;

	musicOverlay.appendChild(sheetMusic);


	musicOverlay.addEventListener('click', function(e) {	
		closeMusicOverlay();
	});


	document.documentElement.appendChild(musicOverlay);
}

function closeMusicOverlay() {
	let musicOverlay = document.getElementById('music-overlay')	
	if (musicOverlay !== null) {
		musicOverlay.remove();
	}
}

function updateMusicPane(music) {
	let musicPane = document.getElementById('music-pane');

	// delete all existing music entries
	musicPane.innerHTML = '';

	// populate with new music entries
	music.forEach(piece => {
		musicPane.appendChild(piece);
	});
}

function populateMusic() {
	let musicItems = [];
	fetch('../static/musicindex.json')
		.then(response => response.json())
		.then(json => {
			let composers = json['composers'];
			composers.forEach(n => {
				Object.keys(n).forEach(m => {
					n[m].forEach(piece => {
						musicItems.push(createMusicItem(piece));
					});
				});
			});
		})
		.then(() => {
			updateMusicPane(musicItems);
		});
}

function createMusicItem(info) {
	// create html elements
	let musicItem = createElement('div', {classes: ['music-item']});
	let h2 = createElement('h2', {textContent: info.title});
	let hr = createElement('hr');
	let h3 = createElement('h3', {textContent: info.composer});
	let musicItemContent = createElement("div", {classes: ["content"]});
	let p = createElement('p', {textContent: info.blurb});
	let musicFooter = createElement('div', {classes: ['music-item-footer']});

	let previewButton = createElement('button');
	previewButton.setAttribute('onclick', 'createMusicOverlay("' + info.link + '")');
	previewButton.setAttribute('title', 'Preview');

	let downloadButton = createElement('a');
	downloadButton.setAttribute('href', info.link);
	downloadButton.setAttribute('target', "_blank");
	downloadButton.setAttribute('title', 'Download');

	let downloadIcon = createElement('i', {classes: ['fas','fa-file-pdf']});
	downloadIcon.setAttribute('aria-hidden', 'true');

	// link html elements
	downloadButton.appendChild(downloadIcon);

	musicFooter.appendChild(downloadButton);

	musicItemContent.appendChild(p);
	musicItemContent.appendChild(musicFooter);

	musicItem.appendChild(h2);
	musicItem.appendChild(hr);
	musicItem.appendChild(h3);
	musicItem.appendChild(musicItemContent);

	return musicItem;
}

function createElement(tagName, options) {
	let element = document.createElement(tagName);

	if (options !== undefined)
	{
		if (options.classes !== undefined) {
			options.classes.forEach(c => {
				element.classList.add(c);
			});
		}

		if (options.textContent !== undefined) {
			element.textContent = options.textContent;
		}
	}

	return element;
}
