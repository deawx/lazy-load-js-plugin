
/*! JSLazyLoading JavaScript plugin - Version 1.0
-------------------------------------------------------------------------
	Copyright (C) 2015 Addon Dev. All rights reserved.
	Website: www.addondev.com
	GitHub: github.com/addondev
	Developer: Philip Sorokin
	Location: Russia, Moscow
	E-mail: philip.sorokin@gmail.com
	Created: June 2015
	License: GNU GPLv2 http://www.gnu.org/licenses/gpl-2.0.html
------------------------------------------------------------------------------ */


function JSLazyLoading(custom){
	
	"use strict";
	
	// Initialize the parameters.
	
	var params = {
		
		
		
		// Boolean (true, false):
		// Whether to use a built-in docReady function and start when the document is ready.
		// If false, the plugin will start immediately after an instance is created.
		
		docReady: true,
		
		
		
		// Object (window), string (the id of an HTML element inside the body section):
		// The container of involved images. The element id has to be set without a hash symbol.
		
		container: window,
	
	
	
		// String: 
		// The name of the data-attribute that holds the image source.
		
		dataAttribute: "data-src",
		
		
		
		// Boolean (true, false):
		// Enable or disable multi-serving of images. For small devices (e.g. phones, tablets), instead of large images intended for desktops, 
		// you can set smaller analogue images. For this purpose, you need to set one or more 
		// additional attributes that holds the analogue sources (see next parameter).
		
		multiServe: false,
		
		
		
		// Object:
		// Breakpoints of multi-serving, if the parameter multiServe is enabled.
		// Property names - the attributes that hold different images, according to the screen width;
		// Property values (integer) - the max-width of the screen in pixels.
		
		multiServeBreakpoints: {
			"data-src-extra-small": 220,
			"data-src-small": 420,
			"data-src-medium": 768
		},
		
		
		
		// NULL, Integer (positive or zero - the value in milliseconds):
		// To allow or not to allow the images to load with an interval when they are outside the viewport. 
		// While the visitor is viewing the content, images are being loaded with an interval specified in 
		// this parameter. You may set also a zero interval; in this case, all the images will be loaded immediately 
		// one after another. 
		
		sequentialLoading: null,
		
		
		
		// String (base64 encoded image or the path to the file): 
		// Note: Internet Explorer < 8 doesn't support base64 encoded images.
		// For these browsers you should use a blank.gif file, that you can find in the plugin folder.
		
		placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
		
		
		
		// NULL (disabled), String (the path of the loader image):
		// If this parameter is set, the loader will be shown until the original image is loaded.
		
		loaderImage: null, //"/jslazyloading/loader.gif",
		
		
		
		// String (CSS color, e.g. "#ededed", "rgb(232, 232, 232)", "grey"), NULL (inherit):
		// Background color of the placeholder while the original image is being loaded.
		
		backgroundColor: null,
		
		
		
		// Boolean (true, false): enable or disable fade-in effect for all devices; String ("desktop") - enable the effect only for desktop browsers:
		// Fade-in effect is based on CSS3 transition and available only for the browsers that support CSS3. The main goal of lazy loading is to improve 
		// performance, so it's not reasonable to use decoration effects based on multiple JavaScript recursions or intervals. 
		// Therefore, it is disabled in the older browsers.
		
		fadeInEffect: true,
		
		
		
		// Integer (positive): 
		// Fade-in effect parameter - effect duration in milliseconds.
		
		fadeInDuration: 400,
		
		
		
		// Boolean (true, false): 
		// Fade-in effect parameter - whether or not to preserve the original image opacity. 
		// If false, the opacity property will be set to the maximum value (1) when an image appears (works faster). 
		// If true, the opacity will be set to the value, according to CSS rules. If there is no transparent (semi-transparent) 
		// images on a page, you may disable this option to increase performance.
		
		fadeInPreserveOpacity: true,
		
		

		// Boolean (true, false):
		// As the images involved in lazy loading do not contain the original source, the client browser “does not know“
		// the image height, until the image is loaded. As a result, the content may “jump“ on the image load, because the
		// browser changes the placeholder to another image.
		// To prevent this behaviour, you can specify the height of the images in CSS, however 
		// it is not possible in some cases, e.g. if you have a responsive layout.
		// With the soft mode enabled you do not have to set the height of your images, this style
		// will be added to the images dynamically, according to the container width. The soft mode works only for the images, 
		// that have the "width" and "height" attributes set (the plugin calculates the image dimensions according to the values 
		// of these attributes). 
		// In IE 6-7, the "width" and "height" attributes may return wrong values, so, additionally, if you want the images to load 
		// in the soft mode in these browsers, you have to set "data-width" and "data-height" attributes with the values of the 
		// "width" and "height" attributes accordingly - the plugin will get the image dimensions from these attributes.
	
		softMode: false,
		
		
		
		// Boolean (true, false):
		// Restart the plugin when the browser sends a HTTP request if you would like the new images to load 
		// in lazy mode (only the images with a data-attribute will be involved). Another way to include new
		// images in the plugin scope is to use a public method "refresh" (see below).
		
		ajaxListener: false,
		
		
		
		// Integer (positive or zero): 
		// By changing this parameter, you change the number of images that are checked 
		// simultaneously if they are in the viewport. The default value (0) means that only one image is tested 
		// per operation. Once this image in the viewport, the plugin loads it and switches to another image. 
		// The less the number - the better performance, however if you have complicated layout, it may fail image 
		// loading. In this case, increase this parameter up to the number, that doesn't cause any problems, 
		// or set a large value (e.g. 1000) if you would like to remove the limit.
		
		limit: 0,
		
		
		
		// Boolean (true, false):
		// The shape of viewport. If this parameter is set to true, the top, bottom, left and right borders 
		// of the viewport are taken into account, so images are loaded only if they are inside the rectangular
		// scope. If false, the images are loaded once they are above the bottom border of the viewport.
		// Note: using this option can reduce performance to some degree in case there are a large number of
		// images involved in lazy loading on a page, because the failure limit (previous parameter) 
		// is getting removed automatically.
		
		rectangularScope: false,
		
		
		
		// Integer:
		// Viewport threshold borders (X and Y axes). If you want images to load earlier, use these parameters. 
		// Setting a threshold border to 300 causes an image to load 300 pixels before it appears in the viewport.
		
		rangeY: 0,
		
		
		
		// The parameter rangeX is enabled only if the parameter rectangularScope is set to true.
		
		rangeX: 0
		
		

	};
	
	
	
	// Overwrite default values of the parameters with custom values 
	// by the object properties passed as the function argument.
	
	if(typeof custom === "object"){
		for(var i in custom)
			params[i] = custom[i]
	}
	
	
	// Initialize other global variables.
	
	var	win = window, doc = win.document, container, ancestor, images, root = doc.documentElement, sequentialLoadingTimeout, ajaxListenerInterval, 
			_this = this, remainder, containerWidth, containerHeight, widthAttr = "width", heightAttr = "height", cssText = "";

	
	// Find the images with the data-attribute. Skip the images without the attribute.
	
	function search(callback){
		for(var i=0, collection = ancestor.getElementsByTagName("img"), len = collection.length; i<len; i++){
			if(collection[i].getAttribute(params.dataAttribute)){
				callback(collection[i])
			}
		}
	}
	
	
	// Lighten some standard methods for our needs and make them available for old browsers.
	
	function some(array, callback){
		try{
			for(var i=0, len = array.length; i<len; i++){
				if(array[i] && callback(array[i], i)) return true
			}
		}catch(e){
			// There is a bug in IE 6-8 that may cause an occasional error while finding element coordinates, 
			// however this error doesn't break the process.
		}
	}
	
	function forEach(array, callback){
		for(var i=0, len=array.length; i<len; i++){
			if(array[i]) callback(array[i], i)
		}
	}
	
	
	if(/MSIE ([\d.]+)/.test(navigator.userAgent) && RegExp.$1 < 9){
		
		// Initialize some functions for Internet Explorer 6-8
	
		var addListener = function(element, event, handler){
			element.attachEvent("on"+event, handler)
		},
		removeListener = function(element, event, handler){
			element.detachEvent("on"+event, handler)
		},
		docReady = function(handler){
			try{root.doScroll("left"); handler()}
			catch(e){setTimeout(function(){docReady(handler)}, 10)}
		};
		if(RegExp.$1 < 8){
			// In IE 6-7, the width and height attributes may return wrong values, so we need to 
			// get the values from the other attributes "data-width" and "data-height", if they have been previously set.
			widthAttr = "data-width"; heightAttr = "data-height";
		}
		
	}else{
	
		// Initialize some functions for modern browsers.
	
		addListener = function(element, event, handler){
			element.addEventListener(event, handler, false)
		};
		removeListener = function(element, event, handler){
			element.removeEventListener(event, handler, false)
		};
		docReady = function(handler){
			doc.readyState !== "loading" ? handler() : doc.addEventListener("DOMContentLoaded", handler, false)
		};
		
	}
	

	// The function inViewPort() finds relative coordinates of images, and checks if the images are in the viewport.
	// A standard fast method getBoundingClientRect() in IOS < 5 returns not expected results, so, instead, in these 
	// devices we have to find image cumulative offsets. We find the offsets also in the browsers, that don't support 
	// getBoundingClientRect(), and if the container of images is not a window.
	// The function getRelCoords() we use for sorting the images in collection, according to their order.
	
	if(params.container !== win || !root.getBoundingClientRect || /iP(hone|od|ad).+? OS (\d+)/.test(navigator.platform) && RegExp.$1 < 5){

		var getScrollOffsets = function(){
			if(params.container === win){
				var top = win.pageYOffset || root.scrollTop, left = win.pageXOffset || root.scrollLeft;
			}else{
				top = container.scrollTop; left = container.scrollLeft;
			}
			return{
				top: top,
				left: left
			}
		};
		
		var inViewPort = params.rectangularScope ? function(x, offsets){
			var top = 0, left = 0, width = x.offsetWidth, height = x.offsetHeight;
				do{
					top += x.offsetTop  || 0;
					left += x.offsetLeft || 0;
					x = x.offsetParent;
				}while(x && x != container);
				return top <= containerHeight + offsets.top + params.rangeY && top + height >= offsets.top - params.rangeY
								&& left <= containerWidth + offsets.left + params.rangeX && left + width >= offsets.left - params.rangeX
		} : function(x, offsets){
			var top = 0;
			do{
				top += x.offsetTop || 0
				x = x.offsetParent;
			}while(x && x != container);
			return top <= containerHeight + offsets.top;
		}, 
		
		getRelCoords = function(x){
			var top = 0, left = 0;
			do{
				top += x.offsetTop  || 0;
				left += x.offsetLeft || 0;
				x = x.offsetParent
			}while(x && x != container);
			return{
				top: top,
				left: left
			}
		}
		
	}else{
		
		inViewPort = params.rectangularScope ? function(img){
			var rect = img.getBoundingClientRect();
			return rect.top <= containerHeight + params.rangeY && rect.bottom >= 0 - params.rangeY
							&& rect.left <= containerWidth + params.rangeX && rect.right >= 0 - params.rangeX
		} : function(img){
			return img.getBoundingClientRect().top <= containerHeight + params.rangeY
		};
		
		getRelCoords = function(img){
			return img.getBoundingClientRect()
		}
		
	}
	
	
	// Get an image source; manage multi-serving (if enabled).
	
	var getSource = function(img){
		return img.getAttribute(params.dataAttribute)
	};
	
	if(params.multiServe && typeof params.multiServeBreakpoints === "object"){
		
		var sourceAttributes = new Array();
		
		for(var name in params.multiServeBreakpoints){
			if(win.screen.width <= params.multiServeBreakpoints[name]){
				sourceAttributes.push({name: name, value: params.multiServeBreakpoints[name]});
			}
		}
		
		if(sourceAttributes.length){
			
			sourceAttributes.sort(function(a, b){
				return a.value > b.value
			});
			
			for(var i=0; i<sourceAttributes.length; i++){
				sourceAttributes[i] = sourceAttributes[i].name
			}
		
			getSource = function(img){
				for(var i=0, source; i<sourceAttributes.length; i++){
					if(source = img.getAttribute(sourceAttributes[i])){
						return source
					}
				} 
				return img.getAttribute(params.dataAttribute)
			}
			
		}
		
	}
	
	
	// Displaying methods.
	
	var appear = function(img){
		var source = getSource(img);
		if(source){
			if(typeof img.jsllCSSText !== "undefined"){
				addListener(img, 'load', function(){
					img.style.cssText = img.jsllCSSText;
				})
			}
			load(img, source)
		}
	};
	
	function load(img, source, mirror){
		var _img = mirror || img;
		_img.onerror = function(){
			if(typeof img.jsllCSSText !== "undefined"){
				img.style.cssText = img.jsllCSSText;
			}
			if(mirror){
				img.setAttribute("data-error-src", mirror.src.replace(/images.php\?.+?&url=(.*?)/, "$1"));
				img.src = "about:blank";
			}
			setTimeout(examine, 100);
		}
		_img.src = source;
		img.removeAttribute(params.dataAttribute);
		remainder--
	}
	
	
	if(params.fadeInEffect){
	
		// Check what kind of CSS transition properties is supported by the client's browser. Initialize the property.
		
		var transition = function(){
			for(var i=0; i<arguments.length; i++){
				if(arguments[i] in root.style){ 
					return arguments[i]
				}
			}
		}('transition', '-webkit-transition', '-moz-transition', '-o-transition');
		
		// If the client's browser supports a property, enable fade-in effect.
		// Disable fade-in effect for not desktop browsers if required.
		
		if(transition && (params.fadeInEffect !== "desktop" || (!('ontouchstart' in win || 'onmsgesturechange' in win) || win.screen.width > 768))){
		
			if(/Chrome/.test(navigator.userAgent)){
			
				// There is a bug in Chromium browsers: changing the opacity of images with CSS transition can make them 
				// slightly move. For this reason, we should set transform style, so that the images appear correctly.
				
				var style = doc.createElement("style");
				style.type = "text/css";
				style.appendChild(doc.createTextNode("img {-webkit-transform: translateZ(0px)}"));
				doc.getElementsByTagName("head")[0].appendChild(style)
				
			}
			
			// Overwrite the displaying method.
			
			appear = function(img){
				
				var source = getSource(img);
				
				if(source){
					
					var mirror = new Image();
				
					addListener(mirror, 'load', function(){
						
						img.style.cssText = img.jsllCSSText || "";
						
						// Find the opacity margin if the option Preserve Opacity has been set.
						
						if(params.fadeInPreserveOpacity){
							var opacityMargin = getComputedStyle(img, '').opacity,
							effectDuration = params.fadeInDuration * 1 / opacityMargin;
						}else{
							opacityMargin = 1;
							effectDuration = params.fadeInDuration;
						}
						
						img.style.cssText += "; opacity: 0 !important; ";
						img.src = mirror.src;

						setTimeout(function(){
							img.style.cssText += transition + ": opacity " + effectDuration + "ms ease-in !important; opacity: " + opacityMargin + " !important; ";
							setTimeout(function(){
								img.style.cssText = img.jsllCSSText || "";
							}, effectDuration + 200)
						}, 16)
						
					});
					
					load(img, source, mirror);
					
				}

			}
			
		}
		
	}
	
	
	// Set CSS text if required.

	if(params.backgroundColor){
		cssText += "; background-color: " + params.backgroundColor + " !important"
	}
	
	if(params.loaderImage){
		cssText += "; background-image: url('" + params.loaderImage + "') !important; background-position: center center !important; background-repeat: no-repeat !important";
	}
	
	
	if(params.softMode){
		
		var setCSSText = function(img){
			var width = img.getAttribute(widthAttr), height = img.getAttribute(heightAttr);
			if(width && height){
				// Find and store the image proportion.
				img.jsllProportion = width / height;
				var height = img.offsetWidth / img.jsllProportion;
			}
			img.jsllCSSText = img.getAttribute("style") || "";
			img.style.cssText += cssText + "; height: " + height + "px"
		}
		
	}else if(cssText){
		
		setCSSText = function(img){
			img.jsllCSSText = img.getAttribute("style") || "";
			img.style.cssText += cssText;
		}
		
	}
	
	
	// Get the container size. Check if the size has been changed.
	
	function getContainerSize(){
		var oldContainerWidth = containerWidth, oldContainerHeight = containerHeight;
		containerWidth = params.container === win ? (container.innerWidth || root.clientWidth || doc.body.clientWidth) : container.clientWidth;
		containerHeight = params.container === win ? (container.innerHeight || root.clientHeight || doc.body.clientHeight) : container.clientHeight;
		return oldContainerWidth !== containerWidth || oldContainerHeight !== containerHeight
	}
	

	// Update the image size in the soft mode when the document container size is changed. 
	// Sort the images, according to their order on a page; check if they are in the viewport on resize event.
	
	function update(){
		if(getContainerSize()){
			if(params.softMode){
				forEach(images, function(img){
					if(img.jsllProportion){
						img.style.height = img.offsetWidth / img.jsllProportion + "px"
					}
				})
			}
			arrange()
		}else{
			examine()
		}
	}
	
	
	function arrange(){
		try{
			images.sort(function(a, b){
				var A = getRelCoords(a), 
				B = getRelCoords(b);
				if(A.top === B.top){
					return A.left - B.left;
				}else{
					return A.top - B.top
				}
			})
			examine()
		}catch(e){
			// There is a bug in IE 6-8 that may cause an occasional error while finding element coordinates, 
			// however this error doesn't break the process.
		}
	}
	
	
	// Check if the images are in the viewport. If positive, load the images.

	function examine(e, _break){
		var last, cnt = 0;
		if(getScrollOffsets){
			var offsets = getScrollOffsets()
		}
		_break = _break || !params.rectangularScope;
		some(images, function(img, i){
			if(inViewPort(img, offsets)){
				appear(last = img);
				delete images[i]
			}else if(cnt++ >= params.limit){
				if(last){
					addListener(last, 'load', function(){
						examine(null, true)
					});
					return true
				}
				return _break
			}
		})
	}

	
	// Sequential loading (if enabled).
	// Images are being loaded one after another with a delay specified in this parameter.

	function sequentialLoading(){
		clearTimeout(sequentialLoadingTimeout);
		some(images, function(img, i){
			appear(img);
			addListener(img, 'load', function(){
				sequentialLoadingTimeout = setTimeout(sequentialLoading, params.sequentialLoading)
			});
			return delete images[i]
		})
	}
	
	
	// Ajax listener. 
	// If the image collection has been changed, and if there are new images on a page, restart 
	// the plugin and check the order of images. Another way to include new images in the plugin 
	// scope is to use a public method "refresh" (see below).

	function ajaxListener(){
		ajaxListenerInterval = setInterval(function(){
			var cnt = 0;
			search(function(img){
				cnt++
			});
			if(cnt !== remainder){
				_this.refresh();
			}
		}, 100)
	}
	
	
	// PUBLIC METHODS
	
	
	this.refresh = function(){
		
		if(_this.started){
			
			getContainerSize();
			images = new Array();
			
			search(function(img){
				
				images.push(img);
				
				// The placeholder is set on the server side				
				// img.src = params.placeholder;

				if(setCSSText && typeof img.jsllCSSText === "undefined"){
					setCSSText(img)
				}
				
			});
			
			remainder = images.length;
			
			if(typeof params.sequentialLoading === "number"){
				sequentialLoading()
			}
			
			if(doc.readyState !== "complete"){
				addListener(win, 'load', arrange);
				examine()
			}else{
				arrange()
			}
			
		}
		
	}
	
	
	this.abort = function(){
		
		_this.started = false;
		
		removeListener(container, 'scroll', examine);
		removeListener(container, 'resize', update);
		
		if(ajaxListenerInterval){
			clearInterval(ajaxListenerInterval);
			JSLazyLoading.ajaxListenerEnabled = false
		}
		
		search(function(img){
			var source = getSource(img);
			if(source){
				img.src = source
			}
		})
		
	};
	
	
	this.start = function(){
		
		if(!_this.started){
			
			if(params.container === win){
				container = win;
				ancestor = doc
			}else{
				container = doc.getElementById(params.container);
				ancestor = container
			}
			
			if(win.operamini){
				
				// Restore the sources of images and exit if the browser is Opera Mini, 
				// as this browser doesn't support scroll events.
				
				_this.abort()
			
			}else if(container){
				
				_this.started = true;
				_this.refresh();
				
				addListener(container, 'scroll', examine);
				addListener(container, 'resize', update);
				
				// AJAX listener.
				
				if(params.ajaxListener && !JSLazyLoading.ajaxListenerEnabled){
					JSLazyLoading.ajaxListenerEnabled = true;
					ajaxListener()
				}
				
			}
			
		}
		
	};
	
	
	// Execute.
	
	params.docReady ? docReady(this.start) : this.start();

}
