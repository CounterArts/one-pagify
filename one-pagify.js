
var onePagify = function() {
};

onePagify.currentSelector = "";

onePagify.historyObject = {};
onePagify.loadingBar = document.createElement("div");
onePagify.loadingBarProgress = 0.0;
onePagify.lastLoaded = null;
onePagify.loading = false;

onePagify.init = function(targetSelector) {
	this.currentSelector = targetSelector;
	this.startListening();
	this.initLoadingBar();
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
	this.startLoadingBar();
	r.addEventListener("load", function (e){
		that.handleNavigationLoad(this, newLocation, options);
	});
	r.onError = function () {
		that.loadErrorPage();
	};
	r.open("GET", newLocation, true);
	r.send();
};

onePagify.getSiteName= function(){
	return window.location.protocol + "//" + window.location.hostname;
};

onePagify.handleNavigationLoad= function(req, newLocation, options){
	var defaultOptions = {};
	var that = this;
	var effectiveOptions = Object.assign(defaultOptions, options)
	var newContent = req.responseXML.querySelector(onePagify.currentSelector);
	document.querySelector(onePagify.currentSelector).replaceWith(newContent);
	onePagify.historyObject.url = newLocation;
	if(!effectiveOptions.isBackAction) {
		window.history.pushState(onePagify.historyObject.url, null, newLocation);
	}
	this.stopLoadingBar();
};

onePagify.loadErrorPage= function(){
	document.querySelector(onePagify.currentSelector).replaceWith(`
		<h1>Oops!</h1>
		<div>We can't find that page.</div>
		`);
};

onePagify.initLoadingBar = function() {
	document.body.appendChild(this.loadingBar);
	this.loadingBar.classList.add("loading-bar");
	this.loadingBar.setAttribute("style", this.loadingBarBaseStyle);
};

onePagify.startLoadingBar = function (){
	this.lastLoaded = new Date();
	this.loadingBar.style.width = "0%";
	this.loadingBar.style.opacity = "1";
	this.loadingBar.style.transition = "0.1s width linear;";
	setTimeout(function(){
		onePagify.loadingBar.style.transition = "0.1s width linear;";
		setTimeout(onePagify.updateLoadingBar, 100);
	}, 5);
	
	this.loading = true;
};

onePagify.updateLoadingBar = function() {
	if(onePagify.loading){
		var timeElapsed =  Date.now() - onePagify.lastLoaded;
		var progress = Math.min(100, Math.sqrt(timeElapsed));
		onePagify.loadingBarProgress = progress;


		onePagify.loadingBar.style.width = "calc(" + onePagify.loadingBarProgress + "% - 70px)";
		
		setTimeout(onePagify.updateLoadingBar, 100);
	} else {
		onePagify.loadingBar.style.width = "100%";
		setTimeout(function(){
			onePagify.loadingBar.style.opacity = "0";;
		}, 1000);
	}
}

onePagify.stopLoadingBar = function () {

	this.loadingBar.style.transition = "0.1s width linear, 1s opacity linear";


	this.loading = false;
};


onePagify.loadingBarBaseStyle = `
	position: absolute;
	width: 0%;
	top: 0;
	left: 0;
	height: 5px;
	display: block;
	background-color: pink;
	opacity: 0;
	transition: 0.1s width linear, 1s opacity linear;
	z-index: 1;
`;