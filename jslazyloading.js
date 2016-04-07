
/*! JSLazyLoading JavaScript plugin - Version 1.2
-------------------------------------------------------------------------
Copyright (C) 2015 Addon Dev. All rights reserved.
Website: https://addondev.com
GitHub: github.com/addondev
Developer: Philip Sorokin
Location: Russia, Moscow
E-mail: philip.sorokin@gmail.com
Created: June 2015
License: GNU GPLv2 http://www.gnu.org/licenses/gpl-2.0.html
------------------------------------------------------------------------------ */


function JSLazyLoading(custom, pluginFolderURL) {
	
	"use strict";
	
	// STRING: Plugin folder URL
	pluginFolderURL = pluginFolderURL || function() {
		for (var i=0, scripts = document.getElementsByTagName('script'); i < scripts.length; i++) {
			var source = scripts[i].getAttribute('src');
			if (source) {
				var pos = source.search(/\/jslazyloading(?:\.min)?\.js(\?.*)?$/i);
				if (pos !== -1) {
					return source.substr(0, pos);		
				}
			}
		}
		return '';
	}();
	
	// OBJECT: the plugin parameters
	var params = {
		
		/** 
		* Boolean (true, false):
		* Determines whether to use a built-in docReady function. If the value is false, the plugin will start 
		* immediately after an instance is created; if true, the plugin will start when the DOM is ready.
		*/
		docReady: true,
		
		/** 
		* STRING: 
		* The name of the data-attribute that identify the image source.
		*/
		dataAttribute: "data-src",
		
		/**
		* ARGUMENTS: 
		* 
		*   BOOLEAN (FALSE) - disabled,
		*   BOOLEAN (TRUE) - enabled - manual multi-serving,
		*   STRING ("manual") - the same as TRUE - manual multi-serving, 
		*   STRING ("php") - automatic multi-serving - PHP handler, 
		*   STRING ("apache") - automatic multi-serving - apache handler.
		*
		* Enables or disables multi-serving of images.
		*/
		multiServing: false,
		
		/**
		* STRING ("width", "density"), NULL (the same as "width" value):
		* If "width" (or null) is selected, the plugin will check the viewport width,
		* If density is selected, the plugin will check the device pixel ratio or min-resulution.
		*
		* "width" MODE:
		*
		*    For small devices (e.g. phones, tablets), instead of large 
		*    images intended for desktops, you can set smaller analogue images to be displayed. This can reduce 
		*    network traffic and increase page load speed.
		*
		* "density" MODE:
		*
		*    Retina images will be loaded for high-density devices, if the device screen density is more than
		*    or equal to a breakpoint value.		
		*/
		multiServingType: "density",
		
		/** 
		* OBJECT:
		* Determines the breakpoints of multi-serving, if the “multiServing” parameter is enabled. This parameter 
		* must be initialized with an object. Use quotation marks around the object property names, which identify 
		* the data-attributes. There can be several breakpoints, in which case, the plugin will output the image 
		* that corresponds to the closest breakpoint.
		*/
		multiServingBreakpoints: {
			
			/**
			* STRING VALUE: 
			* The breakpoints of device screen max-width in pixels.
			* The values of these properties determine the screen max-width in pixels. 
			* If the screen width is less than or equal to a breakpoint, the plugin will output 
			* a smaller analogue. 
			*
			*	MANUAL MODE (ATTRIBUTE NAME):
			*
			*		"data-src-small": "420px",
			*		"data-src-medium": "768px"
			*
			*	AUTOMATIC MODE (FILE POSTFIX):
			*		
			*		"_small": "192dpi",
			*		"_medium": "288dpi"
			*/
			
			/**
			* STRING VALUE:
			* Retina breakpoint is specified with a string value in dpi. If the retina
			* breakpoint is set and the screen density is more than or equal to the density value, a retina image
			* will be loaded.
			*
			*	MANUAL MODE (ATTRIBUTE NAME):
			*
			*		"data-retina2x": "192dpi",
			*		"data-retina3x": "288dpi"
			*
			*	AUTOMATIC MODE (FILE POSTFIX):
			*		
			*		"_retina2x": "192dpi",
			*		"_retina3x": "288dpi"
			*/
			
		},
		
		/** 
		* NULL (disabled), INTEGER (positive or zero - the value in milliseconds):
		* This parameter determines whether to force the loading of images that are outside the viewport 
		* While a visitor is viewing the content, images can be loaded at an interval specified in this parameter. 
		* You may also set a zero interval, in which case, all the images will be loaded immediately one after another.
		*/
		sequentialLoading: null,
		
		/** 
		* String (base64 encoded image or the path to the file): 
		* According to the HTML standards, an image must have the “src” attribute. In lazy mode, this attribute must 
		* have a temporary placeholder image, which is changed to the original source when an image is in the 
		* viewport. The default value of this parameter is a transparent 1x1 base64 encoded image, but you can set 
		* a path to another image. Be aware that Internet Explorer 6-7 does not support base64 encoded images, so if
		* you need to support these versions, you may use a blank.gif file, which you can find in the plugin folder.
		*/
		placeholder: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
		
		/** 
		* NULL(disabled), String (the path of the loader image):
		* The path to a loader image that is shown untill the original image is loaded. You may use a loader.gif 
		* file, which you can find in the plugin folder.
		*/
		loaderImage: pluginFolderURL + "/loader.gif",
		
		/** 
		* STRING (CSS color, e.g. "#ededed", "rgb(232, 232, 232)", "grey"), NULL (inherit):
		* Background colour of the placeholder while the original image is being loaded.
		*/
		backgroundColor: null,
		
		/** 
		* BOOLEAN (true, false), STRING ("desktop"):
		* Determines whether to display images by fading them to opaque. You will enable or disable this setting 
		* for all kinds of devices if you set this parameter to true or false respectively. You will enable the 
		* effect only for desktop browsers if you set the parameter to a string "desktop". The fade-in effect 
		* is based on CSS3 transition and is available only for browsers that support CSS3. The main goal of lazy 
		* loading is to improve performance, so it is not reasonable to use decoration effects based on multiple 
		* JavaScript recursions or intervals. Therefore, it is disabled in older browsers.
		*/
		fadeInEffect: true,
		
		/** 
		* INTEGER (positive): 
		* This parameter refers to the fade-in effect and determines 
		* the number of milliseconds to run the animation.
		*/
		fadeInDuration: 400,
		
		/** 
		* BOOLEAN (true, false): 
		* This parameter refers to the fade-in effect and determines the final image opacity. If the the parameter 
		* is set to true, the opacity property will be set to the value corresponding to CSS rules, if it is 
		* set to false, the opacity will be set to the maximum value (1). If there are no transparent 
		* (semi-transparent) images on a page, you may disable this option to increase performance.
		*/
		fadeInPreserveOpacity: true,
		
		/** 
		* BOOLEAN (true, false):
		* As the images involved in lazy loading do not contain the original source, the client browser 
		* “does not know” the image height until the image is loaded. As a result, the content may “jump” as the 
		* image loads because the browser changes the placeholder to another image. To prevent this behaviour, you 
		* can specify the image height in CSS; however, this is not possible in some cases, e.g. if you have a 
		* responsive layout.
		*
		* With the soft mode enabled you do not have to set the height of your images; the height property will be 
		* set for images dynamically, according to the container width. The soft mode only works for images that have 
		* the “width” and “height” attributes (the plugin calculates the image dimensions according to the values of 
		* these attributes).
		*
		* In IE 6-7, the “width” and “height” attributes may return incorrect values, so, if you want the images to 
		* load in the soft mode in these browsers, you must also set “data-width” and “data-height” attributes with 
		* the values of the “width” and “height” attributes respectively. The plugin will get the image dimensions 
		* from these attributes. 
		*
		* In IE 6-7, the “width” and “height” attributes may return incorrect values, so, if you want the images to 
		* load in the soft mode in these browsers, you must also set “data-width” and “data-height” attributes with 
		* the values of the “width” and “height” attributes respectively. The plugin will get the image dimensions 
		* from these attributes.
		*/
		softMode: false,
		
		/** 
		* BOOLEAN (true, false):
		* Restart the plugin when the browser sends an HTTP request if you need the new images to load in lazy mode 
		* (only images with a data-attribute will be involved). Another way to include new images in the plugin scope 
		* is to use a public method “refresh” (see the manual on our website).
		*/
		ajaxListener: false,
		
		/** 
		* INTEGER (positive or zero): 
		* By changing this parameter, you change the number of images that are checked simultaneously if they are 
		* in the viewport. The default value (0) means that only one image is tested per operation. Once this image is 
		* in the viewport, the plugin loads it and switches to another image. The smaller the number, the better the 
		* performance; however, if you have complicated layout, image loading may fail. In this case, increase this 
		* parameter up to a number that does not cause any problems, or set a large value (e.g. 1000) if you need to 
		* remove the limit.
		*/
		limit: 0,
		
		/** 
		* BOOLEAN (true, false):
		* This setting determines the shape of the viewport. If this parameter is set to true, the top, bottom, 
		* left and right borders of the viewport are taken into account, so images are loaded only if they are inside 
		* the rectangular scope. When the value is false, the images are loaded once they are above the 
		* bottom border of the viewport. Note: using the “Rectangular Border” option can reduce the performance to 
		* some degree if there are a large number of images involved in lazy loading on a page, because the failure 
		* limit (previous parameter) is removed automatically.
		*/
		rectangularScope: false,
		
		/** 
		* INTEGER:
		* If you want images to load earlier, use the “rangeY” and “rangeX” parameters. Setting a threshold border 
		* to 300 causes an image to load 300 pixels before it appears in the viewport.
		*/
		rangeY: 0,
		
		/** 
		* The “rangeX” parameter is enabled only if the “rectangularScope” parameter is set to true.
		*/
		rangeX: 0
		
	};
	
	
	/** 
	* Overwrite default values of the parameters with custom values 
	* by the object properties passed as the function argument.
	*/
	if (typeof custom === 'object') {
		for (var i in custom) {
			params[i] = typeof(custom[i]) !== 'string' ? custom[i] : (Number(custom[i]) || custom[i]);
		}
	}
	
	// Properties
	this.started;
	
	// Global variables
	var	win = window, doc = win.document, images, root = doc.documentElement, sequentialLoadingTimeout, ajaxListenerInterval, 
		_this = this, match, remainder = 0, containerWidth, containerHeight, widthAttr = "width", heightAttr = "height", cssText = "";
		
	
	if ( match = navigator.userAgent.match(/(Chrome)|(?:(MSIE)|(iP(?:hone|od|ad).+?OS)) (\d+)/) ) {
		if (match[1]) {
			var is_chromium = true;
		} else if (match[2]) {
			var IE_below_9 = match[4] < 9,
				IE_below_8 = match[4] < 8;
		} else if (match[3]) {
			var IOS_below_5 = match[4] < 5;
		}
	}
	
	function log(e) {
		if (win.console && typeof console.log === 'function') {
			console.log(e);
		}
	}
	
	// Find the images with the data-attribute. Skip the images without the attribute.
	function search(callback, attribute) {
		for (var i=0, source, attribute = attribute || params.dataAttribute, collection = doc.images, len = collection.length; i<len; i++) {
			if (source = collection[i].getAttribute(attribute)) {
				callback(collection[i], i, source);
			}
		}
	}
	
	// Lighten some standard methods for our needs and make them available for older browsers.
	function some(array, callback) {
		try {
			for (var i=0, len = array.length; i<len; i++) {
				if ( array[i] && callback(array[i], i) ) {
					return true;
				}
			}
		} catch(e) {
			log(e);
			// There is a bug in IE 6-8 that may cause an occasional error while finding element coordinates, 
			// however this error does not break the process.
		}
	}
	
	function forEach(array, callback, convert) {
		if (convert && typeof array === 'string') {
			array = [array];
		}
		for (var i=0, len=array.length; i<len; i++) {
			if (array[i]) {
				callback(array[i], i);
			}
		}
	}
	
	
	if (IE_below_9) {
		// Initialize some functions for Internet Explorer 6-8
		var addListener = function(element, event, handler) {
			element.attachEvent("on"+event, handler);
		},
		removeListener = function(element, event, handler) {
			element.detachEvent("on"+event, handler);
		},
		docReady = function(handler) {
			try {
				root.doScroll("left"); 
				handler();
			}
			catch(e) {
				setTimeout(function(){ 
					docReady(handler);
				}, 10);
			}
		};
		if (IE_below_8) {
			// In IE 6-7, the width and height attributes may return wrong values, so we need to 
			// get the values from the other attributes "data-width" and "data-height", if they have been previously set.
			widthAttr = "data-width"; heightAttr = "data-height";
		}
	} else {
		// Initialize some functions for modern browsers.
		addListener = function(element, event, handler) {
			element.addEventListener(event, handler, false);
		};
		removeListener = function(element, event, handler) {
			element.removeEventListener(event, handler, false);
		};
		docReady = function(handler) {
			doc.readyState === "complete" ? handler() : doc.addEventListener("DOMContentLoaded", handler, false);
		};
	}
	

	// The function inViewPort() finds relative coordinates of images, and checks if the images are in the viewport.
	// A standard fast method getBoundingClientRect() in IOS < 5 returns not expected results, so, instead, in these 
	// devices we have to find image cumulative offsets. We find the offsets also in the browsers, that do not support 
	// getBoundingClientRect(). The function getRelCoords() we use for sorting the images in collection, according to their order.
	
	if (!root.getBoundingClientRect || IOS_below_5) {
	
		var getScrollOffsets = function() {
			return {
				top: win.pageYOffset || root.scrollTop || doc.body.scrollTop,
				left: win.pageXOffset || root.scrollLeft || doc.body.scrollLeft
			};
		},
		
		inViewPort = params.rectangularScope ? function(x, offsets) {
			var top = 0, left = 0, 
				width = x.offsetWidth, 
				height = x.offsetHeight;
			do {
				top += x.offsetTop  || 0;
				left += x.offsetLeft || 0;
			} while (x = x.offsetParent);
			return (top <= containerHeight + offsets.top + params.rangeY && 
					top + height >= offsets.top - params.rangeY && 
					left <= containerWidth + offsets.left + params.rangeX && 
					left + width >= offsets.left - params.rangeX);
		} : function(x, offsets) {
			var top = 0;
			do {
				top += x.offsetTop || 0;
			} while (x = x.offsetParent);
			return (top <= containerHeight + offsets.top);
		}, 
		
		getRelCoords = function(x) {
			var top  = root.clientTop || doc.body.clientTop, 
				left = root.clientLeft || doc.body.clientLeft;
			do {
				top  += x.offsetTop  || 0;
				left += x.offsetLeft || 0;
			} while (x = x.offsetParent);
			return {
				top: top,
				left: left
			};
		};
		
	} else {
		
		inViewPort = params.rectangularScope ? function(img) {
			var rect = img.getBoundingClientRect();
			return (rect.top <= containerHeight + params.rangeY && 
					rect.bottom >= 0 - params.rangeY && 
					rect.left <= containerWidth + params.rangeX && 
					rect.right >= 0 - params.rangeX);
		} : function(img) {
			return img.getBoundingClientRect().top <= containerHeight + params.rangeY;
		},
		
		getRelCoords = function(img) {
			return img.getBoundingClientRect();
		};
		
	}
	
	
	// Get an image source;
	var getSource = function(img) {
		return img.getAttribute(params.dataAttribute);
	};
	
	// manage multi-serving (if enabled)
	if (params.multiServing && params.multiServingBreakpoints instanceof Object) {
		
		params.multiServing = typeof params.multiServing === 'boolean' ? 'manual' : params.multiServing.toLowerCase();
		
		var getAttributes = function(callback) {
				var attrs = new Array(), result;
				for (var breakpointName in params.multiServingBreakpoints) {
					if (result = callback(breakpointName, params.multiServingBreakpoints[breakpointName].toLowerCase())) {
						attrs.push(result);
					}
				}
				if (attrs.length) {
					attrs.sort(function(a, b) {
						return a.value - b.value;
					});
					for (var i=0; i<attrs.length; i++) {
						multiServingSrcParams[i] = Math.abs(attrs[i].value);
						attrs[i] = attrs[i].name;
						if (params.multiServing !== 'manual') {
							attrs[i] = attrs[i].substr(1);
						}
					}
				}
				return attrs;
			},
		
		multiServingSrcParams = new Array(),
		supportsMinResolution = win.matchMedia && win.matchMedia("(min-resolution: 1dpi)").matches,
		
		multiServingAttributes = params.multiServingType.toLowerCase() === 'density' ? getAttributes(function(name, value) {
			if (typeof value === 'string' && value.substr(-3) === 'dpi') {
				delete params.multiServingBreakpoints[name];
				value = parseInt(value);
				if ((supportsMinResolution && win.matchMedia("(min-resolution: " + value + "dpi)").matches) || 
					(!supportsMinResolution && win.devicePixelRatio >= value / 96)) {
					return {name: name, value: -value};
				}
			}
		}) : getAttributes(function(name, value) {
			var width = parseInt(value);
			if (typeof value === 'string' && value.substr(-2) === 'px' && screen.width <= width) {
				return {name: name, value: width};
			}
		});
		
	}
	
	
	if (params.fadeInEffect) {
	
		// Check what kind of CSS transition properties is supported by the client's browser. Initialize the property.
		
		var transition = function() {
			for (var i=0; i<arguments.length; i++) {
				if (arguments[i] in root.style) { 
					return arguments[i];
				}
			}
		}('transition', '-webkit-transition', '-moz-transition', '-o-transition');
		
		// If the client's browser supports a property, enable fade-in effect.
		// Disable fade-in effect in not desktop browsers if required.
		
		if ( transition && ( params.fadeInEffect !== "desktop" || ( !('ontouchstart' in win || 'onmsgesturechange' in win) || win.screen.width > 768 ) ) ) {
			// There is a bug in Chromium browsers: changing the opacity of images with CSS transition can make them 
			// slightly move. For this reason, we should set transform style, so that the images appear correctly.
			if (is_chromium) {
				var style = doc.createElement("style");
					style.type = "text/css";
					style.appendChild( doc.createTextNode("img {-webkit-transform: translateZ(0)}") );
				doc.getElementsByTagName("head")[0].appendChild(style);
			}
		} else {
			params.fadeInEffect = false;
		}
		
	}
	
	
	// Set CSS text if required.

	if (params.backgroundColor) {
		cssText += "; background-color: " + params.backgroundColor + " !important";
	}
	
	if (params.loaderImage) {
		cssText += "; background-image: url('" + params.loaderImage + "') !important; background-position: center center; background-repeat: no-repeat !important";
	}
	
	
	var setCSSText = params.softMode ? function(img) {
		
		var width = img.getAttribute(widthAttr), 
			height = img.getAttribute(heightAttr);
		if (width && height) {
			// Find and store an image proportion.
			img.jsllProportion = width / height;
		}
		img.jsllCSSText = img.getAttribute("style") || '';
		img.style.cssText += cssText + "; height: " + (img.offsetWidth / img.jsllProportion) + "px";
		
	} : cssText ? function(img) {
		
		img.jsllCSSText = img.getAttribute("style") || '';
		img.style.cssText += "; " + cssText;
		
	} : false;
	
	
	// Get the container size. Check if the size has been changed.
	
	function getContainerSize() {
		var oldContainerWidth = containerWidth, 
			oldContainerHeight = containerHeight;
		containerWidth = win.innerWidth || root.clientWidth || doc.body.clientWidth;
		containerHeight = win.innerHeight || root.clientHeight || doc.body.clientHeight;
		return oldContainerWidth !== containerWidth || oldContainerHeight !== containerHeight;
	}
	

	// Update an image size in the soft mode when the document container size is changed. 
	// Sort the images, according to their order on a page; check if they are in the viewport on resize event.
	
	function update() {
		if ( getContainerSize() ) {
			if (params.softMode) {
				forEach(images, function(img) {
					if (img.jsllProportion) {
						img.style.height = img.offsetWidth / img.jsllProportion + "px";
					}
				});
			}
			arrange();
		} else {
			examine();
		}
	}
	
	
	function arrange() {
		try {
			images.sort(function(a, b) {
				var A = getRelCoords(a), 
					B = getRelCoords(b);
				if (A.top === B.top) {
					return A.left - B.left;
				} else {
					return A.top - B.top;
				}
			});
			examine();
		} catch(e) {
			log(e);
			// There is a bug in IE 6-8 that may cause an occasional error while finding element coordinates, 
			// however this error does not break the process.
		}
	}
	
	
	// Displaying method
	
	function appear(img, fadeIn) {
		var source = getSource(img);
		if (source) {
			img.removeAttribute(params.dataAttribute);
			if (fadeIn) {
				var mirror = img.cloneNode(),
					cssIni = img.jsllCSSText + "; ",
					oncomplete = function() {
						forEach(['load', 'error'], function(event) {
							removeListener(img, event, oncomplete);
						});
						if (params.fadeInPreserveOpacity) {
							var opacityLimit  = getComputedStyle(mirror, '').opacity,
								effectDuration = params.fadeInDuration * 1 / opacityLimit;
						} else {
							opacityLimit  = 1;
							effectDuration = params.fadeInDuration;
						}
						img.style.cssText = cssIni + "opacity: 0 !important; ";
						mirror.parentNode.replaceChild(img, mirror);
						setTimeout(function() {
							img.style.cssText = cssIni + transition + ": opacity " + effectDuration + "ms ease-in !important; opacity: " + opacityLimit + " !important; ";
							setTimeout(function() {
								img.style.cssText = cssIni;
							}, effectDuration + 100);
						}, 16);
					};
				img.parentNode.replaceChild(mirror, img);
			} else if (cssText) {
				oncomplete = function() {
					forEach(['load', 'error'], function(event) {
						removeListener(img, event, oncomplete);
					});
					img.style.cssText = img.jsllCSSText;
				};
			}
			if (oncomplete) {
				forEach(['load', 'error'], function(event) {
					addListener(img, event, oncomplete);
				});
			}
			img.src = source;
			remainder--;
		}
	}	
	
	
	// Check if the images are in the viewport. If positive, load the images.

	function examine(e, _break) {
		var last, cnt = 0;
		if (getScrollOffsets) {
			var offsets = getScrollOffsets();
		}
		_break = _break || !params.rectangularScope;
		some(images, function(img, i) {
			if ( inViewPort(img, offsets) ) {
				appear((last = img), params.fadeInEffect);
				delete images[i];
			} else if (cnt++ >= params.limit) {
				if (last) {
					forEach(['load', 'error'], function(event) {
						addListener(last, event, function() {
							examine(null, true);
						});
					});
					return true;
				}
				return _break;
			}
		});
	}

	
	// Sequential loading (if enabled).
	// Images are being loaded one after another with a delay specified in this parameter.

	function sequentialLoading() {
		clearTimeout(sequentialLoadingTimeout);
		some(images, function(img, i) {
			forEach(['load', 'error'], function(event) {
				addListener(img, event, function() {
					sequentialLoadingTimeout = setTimeout(sequentialLoading, params.sequentialLoading);
				});
			});
			appear(img, false);
			return delete images[i];
		});
	}
	

	// PUBLIC METHODS
	
	this.refresh = function() {
		
		if (this.started) {
			
			images = new Array();
			
			if (multiServingAttributes && multiServingAttributes.length) {
				
				if (params.multiServing !== 'manual') {
				
					var imageFractions = new Array(),
						collection = new Array(),
						analogues = 'analogues=' + multiServingAttributes.join('+') + '&srcp=' + multiServingSrcParams.join('+'),
						rex = new RegExp('^(?:(?:https?:)?//' + location.host + '/+|/+)([^\?]+?\\.[a-zA-Z]+)$', 'gm'),
						handler = params.multiServing === 'php' ? 'handler.php' : 'apache';
				
					search(function(img, i, url) {
						imageFractions.push(url);
						collection.push(img);
					});
					
					if (imageFractions.length) {
						imageFractions = imageFractions.join('\n').replace(rex, pluginFolderURL + "/mirror/" + handler + "/$1?" + analogues).split('\n');
						forEach(collection, function(img, i) {
							img.setAttribute(params.dataAttribute, imageFractions[i]);
						});
					}
					
				} else {
					
					search(function(img, i, source) {
						img.setAttribute(params.dataAttribute, source);
					}, multiServingAttributes[0]);
					
				}
				
			}
			
			getContainerSize();
			
			search(function(img) {
				images.push(img);
				if (params.placeholder) {
					img.src = params.placeholder;
				}
				if (setCSSText && !img.jsllCSSText) {
					setCSSText(img);
				}
			});
			
			remainder = images.length;
			
			if (typeof params.sequentialLoading === "number") {
				sequentialLoading();
			}
			
			if (doc.readyState !== "complete") {
				addListener(win, 'load', arrange);
				examine();
			} else {
				arrange();
			}
			
		}
		
		return true;
		
	};
	
	
	this.abort = function() {
		
		this.started = false;
		
		removeListener(win, 'scroll', examine);
		removeListener(win, 'resize', update);
		
		if (ajaxListenerInterval) {
			clearInterval(ajaxListenerInterval);
			JSLazyLoading.ajaxListenerEnabled = false;
		}
		
		forEach(images, appear);
		
		return true;
		
	};
	
	
	this.start = function() {
		
		if (!this.started) {
			
			if (win.operamini) {
				
				// Restore the sources of images and exit if the browser is Opera Mini, 
				// as this browser does not support scroll events.
				
				this.abort();
			
			} else {
				
				this.started = true;
				this.refresh();
				
				addListener(win, 'scroll', examine);
				addListener(win, 'resize', update);
				
				// AJAX listener.
				// If the image collection has been changed, and if there are new images on a page, restart 
				// the plugin and check the order of images. Another way to include new images in the plugin 
				// scope is to use a public method "refresh" (see below).
				
				if (params.ajaxListener && !JSLazyLoading.ajaxListenerEnabled) {
					JSLazyLoading.ajaxListenerEnabled = true;
					ajaxListenerInterval = setInterval(function() {
						var cnt = 0;
						search(function(img) {
							cnt++;
						});
						if (cnt !== remainder) {
							_this.refresh();
						}
					}, 100);
				}
				
			}
			
		}
		
		return true;
		
	};
	
	
	// Execute
	params.docReady ? docReady(function() {
		_this.start.call(_this);
	}) : this.start();

}
