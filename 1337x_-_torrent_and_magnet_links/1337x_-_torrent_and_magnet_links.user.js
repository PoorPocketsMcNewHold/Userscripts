// ==UserScript==
// @name        1337x - torrent and magnet links
// @namespace   darkred
// @version     2021.1.26
// @description Adds a column with torrent and magnet links in RARBG lists
// @author      darkred
// @contributor NotNeo
// @license     MIT
// @include     /^https?://1337x\.(to|st|ws|eu|se|is|gd|unblocked.dk)/(home|search|sort-search|trending|cat|top-100|sub|popular-(.+)|new-episodes)(\/.+)?$/
// @grant       GM_addStyle
// @run-at      document-idle
// ==/UserScript==


// Thanks to NotNeo: most of the CSS used is taken from this script https://greasyfork.org/en/scripts/373230-1337x-magnet-torrent-links-everywhere .



GM_addStyle(`

	main.container, div.container {
		/* max-width: 1600px; */
		max-width: 1450px;
	}

	.xhrMagnetLink, .xhrDownloadLink {
		/* padding: 0px 1px 0px 1px; */
	}

	.coll-1b {
		/* padding: 10px 8px 10px 8px !important; */
		/* display: flex; */
		/* align: center; */
		/* width: 52px; */
		/* min-height: 37px; */
		/* text-align: center; */
		/* vertical-align: middle; */
		/* box-sizing: border-box; */
	}

	.list-dl-button-magnet > i.flaticon-magnet {
		font-size: 13px;
		color: #da3a04
	}

	.list-dl-button > i.flaticon-torrent-download {
		font-size: 13px;
		color: #89ad19;
	}

	table.table-list td.dl-buttons {
		border-left: 1px solid #f6f6f6;
		padding-left: 2.5px;
		padding-right: 2.5px;
		text-align: center !important;
		position: relative;
		display: inline-block !important;
		/* width: 50px; */
		width: 52px;
	}

	td.dl-buttons > a,
	td.dl-buttons > a:hover,
	td.dl-buttons > a:visited,
	td.dl-buttons > a:link,
	td.dl-buttons > a:active {
		color: inherit;
		text-decoration: none;
		cursor: pointer;
		display: inline-block !important;
		/* margin: 0 1.5px; */
		margin: 0 2px;
	}

	table.table-list td.coll-2 {
		/* border-left: 1px solid silver; */
		border-left: 1px solid #f6f6f6;
	}


`);


function appendColumn(elem) {

	const title = 'ML&nbsp;DL';

	let entries = elem.querySelectorAll('.table-list > thead > tr > th:nth-child(1), .table-list > tbody > tr > td:nth-child(1)');        // the initial column 'Files' after of which the extra column will be appended

	entries[0].insertAdjacentHTML('afterend', `<th>` + title + `</th>`);          // creation of the extra column
	for (let i = 1; i < entries.length; i++) {
		entries[i].insertAdjacentHTML('afterend', `<td>` + title + `</td>`);
	}


	let header = elem.querySelector('.table-list > thead > tr > th:nth-child(2)');       // the first cell (the header cell) of the new column
	header.innerHTML = title;
	header.setAttribute('align', 'center');
	header.setAttribute('class', 'coll-1b');

	let cells = elem.querySelectorAll('.table-list > tbody > tr > td:nth-child(2)');               // the rest cells of the new column
	for (let i = 0; i < cells.length; i++) {
		cells[i].classList.add('coll-1b');
		cells[i].classList.add('dl-buttons');
	}


	let newColumn = elem.querySelectorAll('.table-list > tbody > tr > td:nth-child(2)');       // new column
	let oldColumn = elem.querySelectorAll('.table-list > tbody > tr > td:nth-child(1)');       // old column


	for (let i = 0; i < newColumn.length; i++) {

		let href = oldColumn[i].firstElementChild.nextElementSibling.href;

		newColumn[i].innerHTML = '<a class="list-dl-button-magnet xhrMagnetLink" data-href="' + href + '"' + 'href="javascript:void(0)" + title="ML via XHR"><i class="flaticon-magnet"></i></a>';

		newColumn[i].innerHTML += '<a class="list-dl-button xhrDownloadLink" data-href="' + href + '"' + 'href="javascript:void(0)" + title="DL via XHR"><i class="flaticon-torrent-download"></i></a>';


	}

}



function addClickListeners(links, type){

	for(let i = 0; i < links.length; i++) {

		links[i].addEventListener('click', function(event){

			let href = this.getAttribute('href');
			if (href === 'javascript:void(0)') {
				let tLink = this.getAttribute('data-href');

				var xhr = new XMLHttpRequest();
				xhr.open('GET', tLink, true);	// XMLHttpRequest.open(method, url, async)
				xhr.onload = function () {

					let container = document.implementation.createHTMLDocument().documentElement;
					container.innerHTML = xhr.responseText;

					let retrievedLink;
					if (type === 'ml'){
						retrievedLink = container.querySelector('a[href^="magnet:"]');		// the 'magnet link' element in the retrieved page
					} else {
						retrievedLink = container.querySelector('.dropdown-menu > li > a');		// the 'download link' element in the retrieved page
					}


					if (retrievedLink) {
						// links[i].setAttribute('href', retrievedLink.href);
						links[i].setAttribute('href', retrievedLink.href.replace('http:', 'https:'));  // the links are http and as such are blocked in Chrome
						links[i].click();
					}


				};
				xhr.send();

			}

		}, false);

	}

}



function createColumn(element){
	appendColumn(element);
	addClickListeners(element.querySelectorAll('.xhrMagnetLink'), 'ml' );
	addClickListeners(element.querySelectorAll('.xhrDownloadLink'), 'dl' );
}


createColumn(document);        // the initial column 'Files' after of which the extra column will be appended);
