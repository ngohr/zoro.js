var zoomedElement = document.createElement('div');
var scaledElement = document.createElement('div');
var initialScale = 0;
var currentScale = 0;
var oldZoomedWidth = 0;
var oldScaledWidth = 0;
var oldHeight = 0;
var initialHeight = 0;
var portrait = false;
var oldAspectRatio = 0;
function controlResizeEvent() {
	var zoomedWidth = zoomedElement.clientWidth;
	var scaledWidth = scaledElement.clientWidth;
	var currentScale = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	var scaledHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0);
	var aspectRatio = currentScale / scaledHeight;

	// Wenn vorher die weite größer war als die höhe oder umgekehrt war es kein Zoom und zusätzlich wird onrotate getriggert
	if(portrait && currentScale > scaledHeight) {
		var resizeonlyEvent = new CustomEvent("resizeonly", {detail:{onlyheightchanged:false, height: scaledHeight, width: scaledWidth}});
		document.dispatchEvent(resizeonlyEvent);
		var rotateEvent = new CustomEvent("rotate", {height: scaledHeight, width: scaledWidth});
		document.dispatchEvent(rotateEvent);
		portrait = false;
	} else if(!portrait && currentScale < scaledHeight) {
		var resizeonlyEvent = new CustomEvent("resizeonly", {detail:{onlyheightchanged:false, height: scaledHeight, width: scaledWidth}});
		document.dispatchEvent(resizeonlyEvent);
		var rotateEvent = new CustomEvent("rotate", {detail:{height: scaledHeight, width: scaledWidth}});
		document.dispatchEvent(rotateEvent);
		portrait = true;
	// Wenn sich das Seitenverhätnis ändert war es kein Zoom
	} else if(Math.round(aspectRatio) != Math.round(oldAspectRatio)) {
		if(scaledHeight == oldHeight) {
			var resizeonlyEvent = new CustomEvent("resizeonly", {detail:{onlyheightchanged:false, height: scaledHeight, width: scaledWidth}});
		} else {
			if(scaledWidth == oldScaledWidth && zoomedWidth == oldZoomedWidth) {
				var resizeonlyEvent = new CustomEvent("resizeonly", {detail:{onlyheightchanged:true, height: scaledHeight, width: scaledWidth}});
			} else {
				var resizeonlyEvent = new CustomEvent("resizeonly", {detail:{onlyheightchanged:false, height: scaledHeight, width: scaledWidth}});
			}
		}
		document.dispatchEvent(resizeonlyEvent);
	} else {
		// Wenn das Element, dass minimal so groß ist wie der Viewport, größer wird sowie der Viewport größer wurde, wurde über die ursprungsgröße hinausgezoomt
		if(zoomedWidth > scaledWidth && zoomedWidth > oldZoomedWidth && zoomedWidth != initialScale && scaledWidth == oldScaledWidth) {
			var zoomOutEvent = new CustomEvent("zoomout", {detail:{height: scaledHeight, width: scaledWidth}});
			document.dispatchEvent(zoomOutEvent);
			var zoomEvent = new CustomEvent("zoom", {detail:{height: scaledHeight, width: scaledWidth}});
			document.dispatchEvent(zoomEvent);
		// Wenn das Element, das minimal so groß ist wie der Viewport, kleiner als der Viewport wird, das andere aber nicht, wurde unter die Ursprungsgröße herrausgezoomt
		} else if(zoomedWidth > scaledWidth && zoomedWidth == oldZoomedWidth && scaledWidth < oldScaledWidth) {
			var zoomInEvent = new CustomEvent("zoomin", { height: scaledHeight, width: scaledWidth });
			document.dispatchEvent(zoomInEvent);
			var zoomEvent = new CustomEvent("zoom", {detail:{ height: scaledHeight, width: scaledWidth }});
			document.dispatchEvent(zoomEvent);
		// Scaled width wird wieder größer wir zoomen raus
		} else if(scaledWidth > oldScaledWidth) {
			var zoomOutEvent = new CustomEvent("zoomout", {detail:{ height: scaledHeight, width: scaledWidth }});
			document.dispatchEvent(zoomOutEvent);
			var zoomEvent = new CustomEvent("zoom", {detail:{ height: scaledHeight, width: scaledWidth }});
			document.dispatchEvent(zoomEvent);
		// Zoom width wird wieder kleiner wir zoomen rein
		} else if(zoomedWidth < oldZoomedWidth) {
			var zoomInEvent = new CustomEvent("zoomin", {detail:{ height: scaledHeight, width: scaledWidth }});
			document.dispatchEvent(zoomInEvent);
			var zoomEvent = new CustomEvent("zoom", {detail:{ height: scaledHeight, width: scaledWidth }});
			document.dispatchEvent(zoomEvent);
		}
	}
	oldZoomedWidth = zoomedWidth;
	oldScaledWidth = scaledWidth;
	oldHeight = scaledHeight;
	oldAspectRatio = aspectRatio;
}

document.addEventListener("DOMContentLoaded", function(event) {
	initialScale = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	currentScale = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	oldScaledWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	oldZoomedWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0);
	zoomedElement.style.width = initialScale;
	zoomedElement.style.minWidth = '100%';
	document.body.appendChild(zoomedElement);
	initialHeight = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0);
	if(initialHeight > initialScale) {
		portrait = true;
	}
	oldHeight = initialHeight;
	oldAspectRatio = initialScale / initialHeight;

	scaledElement.style.width = '100%';
	scaledElement.style.maxWidth = initialScale;
	document.body.appendChild(scaledElement);
});

var onZoom = new Event('Event');
var onZoomIn = new Event('Event');
var onZoomOut = new Event('Event');
var resizeOnly = new Event('Event');
var onRotate = new Event('Event');
onZoom.initEvent('zoom', true, true);
onZoomIn.initEvent('zoomin', true, true);
onZoomOut.initEvent('zoomout', true, true);
resizeOnly.initEvent('resizeonly', true, true);
onRotate.initEvent('rotate', true, true);

var timeoutId = null;
addEventListener("resize", function(ev) {
	if(timeoutId) {
		clearTimeout(timeoutId);
	}
	timeoutId = setTimeout(controlResizeEvent, 1000);
});
