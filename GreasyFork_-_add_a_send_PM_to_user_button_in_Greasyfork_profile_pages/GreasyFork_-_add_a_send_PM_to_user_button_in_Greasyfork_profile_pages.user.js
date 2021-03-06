// ==UserScript==
// @name        GreasyFork - add a 'send PM to user' button in Greasyfork profile pages
// @namespace   darkred
// @version     2021.1.22
// @description Adds a 'send PM to user' button in Greasyfork profile pages (also compatible with Citrus GFork).
// @author      darkred
// @license     MIT
// @include     https://greasyfork.org/*/users/*
// @include     https://greasyfork.org/*/forum/messages/add
// @include     https://sleazyfork.org/*/users/*
// @include     https://sleazyfork.org/*/forum/messages/add
// @run-at      document-idle
// @grant       none
// @supportURL  https://github.com/darkred/Userscripts/issues
// ==/UserScript==


var yourProfileNameElement = document.querySelector('.user-profile-link > a:nth-child(1)');
if (yourProfileNameElement !== null) {
	var yourProfileName = yourProfileNameElement.innerHTML;
	var yourProfileURL = yourProfileNameElement.href;
	// https://greasyfork.org/en/users/2160-darkred
	// https://greasyfork.org/en/users/2160-darkred/conversations/new
	// https://greasyfork.org/en/users/2160-darkred/conversations/new?other_user=JasonBarnabe
	var yourCreateNewConversationURL = yourProfileURL + '/conversations/new' ;
}

var targetProfileNameElement = document.querySelector('.text-content > h2');
if (targetProfileNameElement !== null) {
	// var targetProfileName = targetProfileNameElement.firstChild.textContent.replace('\'s Profile', '');   // the .firstChild is for mods profile pages, e.g. https://greasyfork.org/en/users/1-jasonbarnabe , https://greasyfork.org/en/users/2159-woxxom
	var targetProfileName = targetProfileNameElement.firstChild.textContent;   // the .firstChild is for mods profile pages, e.g. https://greasyfork.org/en/users/1-jasonbarnabe , https://greasyfork.org/en/users/2159-woxxom
}


if (window.location.href.indexOf('users') !== -1 // if current URL is a profile page
	&& yourProfileName !== targetProfileName // ... and this profile page is not yours
	&& window.location.href !== yourProfileURL + '/conversations'  //  ... and this profile page is not your conversations page
	&& window.location.href.indexOf('conversations/new') === -1) {  // .. and this page is not a 'Create a new conversation' page
	sessionStorage.setItem('recipient', targetProfileName); // store in sessionStorage the profileName (it will be inserted in the 'Recipients' textbox ) -after you press the button-
	var a = document.createElement('a');
	targetProfileNameElement.appendChild(a);
	a.style.padding = '0px 12px';
	var img = document.createElement('img');
	a.appendChild(img);
	// http://i.imgur.com/ZU0xS0c.jpg
	img.setAttribute('src', 'data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAATABcDAREAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABwAICf/EACgQAAEEAQMCBQUAAAAAAAAAAAECAwQFEQAGEgcIEyEiMUEUNmGl4//EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDof1i6ryOlkCHIi0YvlvJdccjpl+A4203x5OAcFFQHMZx7A59skAMDvnyfsj9t/DQPnS/fUnqDtxyxmVQpJbb5YdgGT462jxSoBZ4p4qIWDxIyMjPn5ADTuZg3ibzZN1R0c+7kVf1q0twoy3gh1QZDZcCQfTkFWD5K4lPzoAqDXblqLJq7r+kVoxuFDiXA85AkOQ0KBBKm43h+lR/KylOfSkYGA0f2x0s6m2demdVz6gzLt+W1Gsm1oeCFNM+/IAqwQpPL5450DBoLQWg//9k=');
	a.id = 'pmButton';
	a.title = 'Send PM to ' + targetProfileName;
	// var yourCreateNewConversationURL = yourProfileURL + '/conversations/new' ;
	// https://greasyfork.org/en/users/2160-darkred/conversations/new?other_user=JasonBarnabe
	a.href = yourCreateNewConversationURL + '?other_user=' + targetProfileName;
}
