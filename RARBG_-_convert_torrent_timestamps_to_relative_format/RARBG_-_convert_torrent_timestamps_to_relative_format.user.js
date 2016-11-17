// ==UserScript==
// @name        RARBG - convert torrent timestamps to relative format
// @namespace   darkred
// @description Converts torrent upload timestamps to relative format
// @include     /^https?:\/\/(www\.)?rarbg\.(to|com)\/torrents.php.*/
// @include     /^https?:\/\/(www\.)?rarbg\.(to|com)\/top10$/
// @version     2.1
// @grant       none
// @require     http://momentjs.com/downloads/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.6/moment-timezone-with-data-2010-2020.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.6/jstz.min.js
// ==/UserScript==

/* global jstz, moment */

var localTimezone = jstz.determine().name();
var serverTimezone = 'Europe/Berlin';		// GMT+1

function convertDates() {
	var dates = document.querySelectorAll('tr.lista2 td:nth-child(3)');
	for (var i = 0; i < dates.length; i++) {
		// if (moment(dates[i].innerText, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {		// As of moment.js v2.3.0, you may specify a boolean for the last argument to make Moment use strict parsing. Strict parsing requires that the format and input match exactly, including delimeters.
		if (moment(dates[i].innerText, 'YYYY-MM-DD HH:mm:ss').isValid()) {

			var temp2 = moment.tz(dates[i].innerText, serverTimezone).tz(localTimezone);
			dates[i].innerText = temp2.fromNow();

			var format = 'MM/DD/YYYY HH:mm:ss';
			dates[i].title = temp2.format(format);
		}
	}
}

convertDates();