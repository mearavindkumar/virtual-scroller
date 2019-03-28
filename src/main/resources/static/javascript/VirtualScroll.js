(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
            typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.VirtualScroll = factory());
}(this, function () {
    'use strict';


    var DIV = document.createElement("div");

    var getDiv = function () {
        return DIV.cloneNode();
    };

    function getViewSize(el) {
        return {
            width: el.offsetWidth,
            height: el.offsetHeight
        };
    }

    function setHeight(el, height) {
        el.style.height = height + "px";
    }


    /*Need Cleanup*/

    function scroll(event, config) {
    	console.log(event);
        var parEl = config.containerParentEl;
        var containerEl = config.containerEl;
        var scrollTop = config.scrollEl.scrollTop;
        var scrollHeight = config.scrollEl.scrollHeight;
        var offsetHeight = config.scrollEl.offsetHeight;

        var height = config.height;
        var from = 0;
        var data = config.data;
        var els = config.els;

        var minTop = height;
        

        

        if (config.lastRepaintY == null || Math.abs(scrollTop - config.lastRepaintY) >= minTop) {
            var from = parseInt(scrollTop / height);
            if (from > (data.length - els.length)) {
                from = data.length - els.length;
            }
            config.lastRepaintY = scrollTop;
            if (containerEl.offsetHeight + scrollTop <= scrollHeight) {
                containerEl.style.transform = "translateY(" + (scrollTop) + "px)";
                containerEl.setAttribute("vs-scrollTop", scrollTop);
            } else {
                containerEl.style.transform = "translateY(" + (scrollHeight - containerEl.offsetHeight) + "px)";
                containerEl.setAttribute("vs-scrollTop", scrollHeight - containerEl.offsetHeight);
            }
            (from >= 0) && renderEls(config, from);
        }

    }
    


    /*Need Cleanup*/

    
    function debounce(func, wait, immediate) {
    	var timeout;
    	return function() {
    		var context = this, args = arguments;
    		var later = function() {
    			timeout = null;
    			if (!immediate) func.apply(context, args);
    		};
    		var callNow = immediate && !timeout;
    		clearTimeout(timeout);
    		timeout = setTimeout(later, wait);
    		if (callNow) func.apply(context, args);
    	};
    };


    function renderEls(config, from) {
        var containerEl = config.containerEl;
        var count = parseInt(config.size.height / config.height) + 20;
        var data = config.data;
        var cursor = from || 0;
        for (var i = 0; i < count; i++) {
            var node = config.els[i] || getDiv();
            node.innerHTML = "";
            var el = config.callback(node, data[cursor++]);
            if (el !== node && config.els[i] && el.getAttribute("vs-idx")) {
                el.setAttribute("vs-idx", i);
                containerEl.replaceChild(el, config.els[i]);
                config.els[i] = el;
            }
            if (!config.els[i]) {
                containerEl.appendChild(el);
                config.els.push(el);
            }
            el.setAttribute("vs-idx", i);
        }
    }

    var VirtualScroll = function (c) {
        var config;

        var event = function () {
        	var eff = debounce(scroll, 1000);
            config.scrollEl.addEventListener("scroll", function (event) {
            	scroll(event, config);
            });
//            config.scrollEl.addEventListener("mousewheel", function (event) {
//            	eff(event, config);
//            });
        };

        var init = function () {
            config = {};
            config.scrollEl = c.scrollEl;
            config.containerEl = c.container;
            config.containerParentEl = c.containerParent;
            config.callback = c.generatorFunc;
            config.data = c.data;
            //calculate dynamically
            config.height = c.itemHeight;
            //calculate dynamically


            config.size = getViewSize(config.scrollEl);
            config.els = [];
            setHeight(config.containerParentEl, config.data.length * config.height);
            event();
            renderEls(config);
        };

        init();

        return c;

    };

    return VirtualScroll;


}));


/*
 function scroll(event, config) {
 var parEl = config.containerParentEl;
 var containerEl = config.containerEl;
 var scrollTop = event.target.scrollTop;
 var scrollHeight = event.target.scrollHeight;
 var offsetHeight = event.target.offsetHeight;
 
 var height = config.height;
 var from = 0;
 var data = config.data;
 var els = config.els;
 
 if (config.lastRepaintY == null || Math.abs(scrollTop - config.lastRepaintY) >= (height + height / 2)) {
 var from = parseInt(scrollTop / height);
 if (scrollTop === 0) {
 from = 0;
 }
 if (offsetHeight + scrollTop >= scrollHeight || from >= data.length || from > (data.length - els.length)) {
 from = data.length - els.length;
 }
 config.lastRepaintY = scrollTop;
 if (containerEl.offsetHeight + scrollTop <= scrollHeight) {
 containerEl.style.transform = "translateY(" + (scrollTop) + "px)";
 } else {
 containerEl.style.transform = "translateY(" + (scrollHeight - containerEl.offsetHeight) + "px)";
 }
 (from >= 0) && renderEls(config, from);
 }
 
 }
 
 */