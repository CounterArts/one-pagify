
var onePagify = function() {
};

onePagify.currentSelector = "";

onePagify.historyObject = {};

onePagify.init = function(targetSelector) {
	this.currentSelector = targetSelector;
	this.startListening();
};

onePagify.startListening= function(){
		var that = this;
		document.addEventListener('click', function (event) {
			var closestMatch = event.target.closest('a');
			if (!closestMatch) return true;
			if (closestMatch.href == location) {
				event.preventDefault();
				return false;
			}
			if (!closestMatch.href.replace(/\/$/, "").startsWith(that.getSiteName())) return true;
			event.preventDefault();

			onePagify.navigateTo(closestMatch.href);
		}, false);

		window.onpopstate = function (event) {
		  	if (event.state ) {
				onePagify.navigateTo(event.state, {isBackAction: true});
			};
		};
		onePagify.historyObject.url = String(window.location);
		window.history.replaceState(onePagify.historyObject.url, null, onePagify.historyObject.url);
	};

onePagify.navigateTo= function(newLocation, options){
	var r = new XMLHttpRequest()
	r.responseType = "document";
	var that = this;
	r.addEventListener("load", function (e){
		that.handleNavigationLoad(this, newLocation, options);
	});
	r.onError = function () {
		that.loadErrorPage();
	};
	r.open("GET", newLocation, true);
	r.send();
}

onePagify.getSiteName= function(){
	return window.location.protocol + "//" + window.location.hostname;
}

onePagify.handleNavigationLoad= function(req, newLocation, options){
	var defaultOptions = {};
	var effectiveOptions = Object.assign(defaultOptions, options)
	var newContent = req.responseXML.querySelector(onePagify.currentSelector);
	document.querySelector(onePagify.currentSelector).replaceWith(newContent);
	onePagify.historyObject.url = newLocation;
	if(!effectiveOptions.isBackAction) {
		window.history.pushState(onePagify.historyObject.url, null, newLocation);
	}
}

onePagify.loadErrorPage= function(){
	document.querySelector(onePagify.currentSelector).replaceWith(`
		<h1>Oops!</h1>
		<div>We can't find that page.</div>
		`);
}
