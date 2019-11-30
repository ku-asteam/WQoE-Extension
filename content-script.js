// 전역 변수
const VERBOSITY='OUTPUT';      //DEBUG, WARNING, OUTPUT (default)
const version = "1.0";

let tabId = 0;

let navigationStart;
let URL;
let pageKey = "";

let last_known_scroll_position = 0;
let ticking = false;

let myPort; // background와 연결
let isPortConnected = false;
let portBuffer = [];

let screenRect = {};
let stats = {};
var executed = false;
var output = "";

let generateSurveyDone = false;
let longtasks = [];
const longtaskObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        longtasks.push(entry.toJSON());
    }
});

const savePageProfile = 0; //0:Nothing, 1:Save statistics, 2:Stats + Page profile, 3:Stats + Page profile + Timing, 4:Full log

// tti-polyfill.js
(function(){var h="undefined"!=typeof window&&window===this?this:"undefined"!=typeof global&&null!=global?global:this,k="function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};function l(){l=function(){};h.Symbol||(h.Symbol=m)}var n=0;function m(a){return"jscomp_symbol_"+(a||"")+n++}
function p(){l();var a=h.Symbol.iterator;a||(a=h.Symbol.iterator=h.Symbol("iterator"));"function"!=typeof Array.prototype[a]&&k(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return q(this)}});p=function(){}}function q(a){var b=0;return r(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function r(a){p();a={next:a};a[h.Symbol.iterator]=function(){return this};return a}function t(a){p();var b=a[Symbol.iterator];return b?b.call(a):q(a)}
function u(a){if(!(a instanceof Array)){a=t(a);for(var b,c=[];!(b=a.next()).done;)c.push(b.value);a=c}return a}var v=0;function w(a,b){var c=XMLHttpRequest.prototype.send,d=v++;XMLHttpRequest.prototype.send=function(f){for(var e=[],g=0;g<arguments.length;++g)e[g-0]=arguments[g];var E=this;a(d);this.addEventListener("readystatechange",function(){4===E.readyState&&b(d)});return c.apply(this,e)}}
function x(a,b){var c=fetch;fetch=function(d){for(var f=[],e=0;e<arguments.length;++e)f[e-0]=arguments[e];return new Promise(function(d,e){var g=v++;a(g);c.apply(null,[].concat(u(f))).then(function(a){b(g);d(a)},function(a){b(a);e(a)})})}}var y="img script iframe link audio video source".split(" ");function z(a,b){a=t(a);for(var c=a.next();!c.done;c=a.next())if(c=c.value,b.includes(c.nodeName.toLowerCase())||z(c.children,b))return!0;return!1}
function A(a){var b=new MutationObserver(function(c){c=t(c);for(var b=c.next();!b.done;b=c.next())b=b.value,"childList"==b.type&&z(b.addedNodes,y)?a(b):"attributes"==b.type&&y.includes(b.target.tagName.toLowerCase())&&a(b)});b.observe(document,{attributes:!0,childList:!0,subtree:!0,attributeFilter:["href","src"]});return b}
function B(a,b){if(2<a.length)return performance.now();var c=[];b=t(b);for(var d=b.next();!d.done;d=b.next())d=d.value,c.push({timestamp:d.start,type:"requestStart"}),c.push({timestamp:d.end,type:"requestEnd"});b=t(a);for(d=b.next();!d.done;d=b.next())c.push({timestamp:d.value,type:"requestStart"});c.sort(function(a,b){return a.timestamp-b.timestamp});a=a.length;for(b=c.length-1;0<=b;b--)switch(d=c[b],d.type){case "requestStart":a--;break;case "requestEnd":a++;if(2<a)return d.timestamp;break;default:throw Error("Internal Error: This should never happen");
}return 0}function C(a){a=a?a:{};this.w=!!a.useMutationObserver;this.u=a.minValue||null;a=window.__tti&&window.__tti.e;var b=window.__tti&&window.__tti.o;this.a=a?a.map(function(a){return{start:a.startTime,end:a.startTime+a.duration}}):[];b&&b.disconnect();this.b=[];this.f=new Map;this.j=null;this.v=-Infinity;this.i=!1;this.h=this.c=this.s=null;w(this.m.bind(this),this.l.bind(this));x(this.m.bind(this),this.l.bind(this));D(this);this.w&&(this.h=A(this.B.bind(this)))}
C.prototype.getFirstConsistentlyInteractive=function(){var a=this;return new Promise(function(b){a.s=b;"complete"==document.readyState?F(a):window.addEventListener("load",function(){F(a)})})};function F(a){a.i=!0;var b=0<a.a.length?a.a[a.a.length-1].end:0,c=B(a.g,a.b);G(a,Math.max(c+5E3,b))}
function G(a,b){!a.i||a.v>b||(clearTimeout(a.j),a.j=setTimeout(function(){var b=performance.timing.navigationStart,d=B(a.g,a.b),b=(window.a&&window.a.A?1E3*window.a.A().C-b:0)||performance.timing.domContentLoadedEventEnd-b;if(a.u)var f=a.u;else performance.timing.domContentLoadedEventEnd?(f=performance.timing,f=f.domContentLoadedEventEnd-f.navigationStart):f=null;var e=performance.now();null===f&&G(a,Math.max(d+5E3,e+1E3));var g=a.a;5E3>e-d?d=null:(d=g.length?g[g.length-1].end:b,d=5E3>e-d?null:Math.max(d,
f));d&&(a.s(d),clearTimeout(a.j),a.i=!1,a.c&&a.c.disconnect(),a.h&&a.h.disconnect());G(a,performance.now()+1E3)},b-performance.now()),a.v=b)}
function D(a){a.c=new PerformanceObserver(function(b){b=t(b.getEntries());for(var c=b.next();!c.done;c=b.next())if(c=c.value,"resource"===c.entryType&&(a.b.push({start:c.fetchStart,end:c.responseEnd}),G(a,B(a.g,a.b)+5E3)),"longtask"===c.entryType){var d=c.startTime+c.duration;a.a.push({start:c.startTime,end:d});G(a,d+5E3)}});a.c.observe({entryTypes:["longtask","resource"]})}C.prototype.m=function(a){this.f.set(a,performance.now())};C.prototype.l=function(a){this.f.delete(a)};
C.prototype.B=function(){G(this,performance.now()+5E3)};h.Object.defineProperties(C.prototype,{g:{configurable:!0,enumerable:!0,get:function(){return[].concat(u(this.f.values()))}}});var H={getFirstConsistentlyInteractive:function(a){a=a?a:{};return"PerformanceLongTaskTiming"in window?(new C(a)).getFirstConsistentlyInteractive():Promise.resolve(null)}};
"undefined"!=typeof module&&module.exports?module.exports=H:"function"===typeof define&&define.amd?define("ttiPolyfill",[],function(){return H}):window.ttiPolyfill=H;})();
//# sourceMappingURL=tti-polyfill.js.map

// 함수
function log(str, out="OUTPUT") {
    if (VERBOSITY == 'DEBUG') {
        console.log(str);
    }

    //console.log(str);
    /*
    if (out=="DEBUG" && VERBOSITY=="DEBUG"){
        // console.log(str);
    } else if (out == "WARNING" && (VERBOSITY=="WARNING" || VERBOSITY=="DEBUG")) {
        output = output + "WARNING: " + str + "\n";
    } else if (out == "OUTPUT"){
        output = output + str + "\n";
    } else {
        //Suppress output
    }
    */
}

function getRectangles(timings){
    var rects = []
    //Walk through all DOM elements
    var elements = document.getElementsByTagName('*');
    var re = /url\(.*(http.*)\)/ig;

    var addRectangle = function(el, url){
        rectObj = el.getBoundingClientRect();
        rect = {}
        rect.x           = rectObj.x
        rect.y           = rectObj.y
        rect.top         = rectObj.top
        rect.bottom      = rectObj.bottom
        rect.left        = rectObj.left
        rect.right       = rectObj.right
        rect.width       = rectObj.width
        rect.height      = rectObj.height
        rect.src = url;
        rect.tagName = el.tagName;
        rect.onscreen = intersectRect(rect, screenRect);
        rect.screen_area = overlapRect(screenRect, rect);
        key = geturlkey(rect.src)
        if (key in timings){
            rect.load_time = timings[key];
        } else {
            rect.load_time = 0.0;
        }
        rects.push(rect)
    }

    for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var style = window.getComputedStyle(el);

        // check for Images
        if (el.tagName == 'IMG') {
            addRectangle(el, el.src);
            continue;
        } 
        // Check for background images
        if (style['background-image']) {
            re.lastIndex = 0;
            //Background images have this set to 'url("http://(something)")'
            var matches = re.exec(style['background-image']); 
            if (matches && matches.length > 1){
                addRectangle(el, matches[1].replace('"', ''));
            }
        }
    }
    return rects;
}

function calculateATF(){
    if (executed) {
        return; 
    }
    executed = true;
    var script_start_time = performance.now();

    var imgs = document.getElementsByTagName("img");
    log("Version:          " + version);

    var hashImgs = {};
    var countATF = 0;
    var img_pixels = 0;

    for (i = 0; i < imgs.length; i++) {
        var rect = imgs[i].getBoundingClientRect()
        
        imgs[i].onscreen = intersectRect(rect, screenRect);

        if (imgs[i].onscreen) {
            imgs[i].screen_area = overlapRect(screenRect, rect);
            if (imgs[i].screen_area > 0) countATF+=1;
            img_pixels += imgs[i].screen_area;
        }

        var key = geturlkey(imgs[i].src);
        if ( !(key in hashImgs) ) {
            hashImgs[ key ] = imgs[i];
        } else {
            //log("Repeated img <" + i + ">: "+ imgs[i].src, 'WARNING');
        }
    }

    var [imgResource,jsResource,cssResource] = getResources();

    //Setting load time on page imgs
    for (i = 0; i < imgResource.length; i++) {
        var load_time = imgResource[i].responseEnd;

        var imgsrc = geturlkey(imgResource[i].name);
        if (imgsrc in hashImgs){
            hashImgs[ imgsrc ].loadtime = load_time;
        } 
    }

    //ATF pixel img loaded 
    img_pixels = 0; 
    var screenimgs = [];
    stats.last_img = 0.0;
   
    for (i = 0; i < imgs.length; i++){
        if ('loadtime' in imgs[i])
            if (imgs[i].onscreen && (imgs[i].screen_area > 0) ) {
                screenimgs.push(imgs[i]);
                img_pixels += imgs[i].screen_area;
                if (imgs[i].loadtime > stats.last_img) stats.last_img = imgs[i].loadtime;
            }
    }
    
    screenimgs.sort(function(a,b){
        return a.loadtime - b.loadtime;
    });

    jsResource.sort(function(a,b){
        return a.responseEnd - b.responseEnd;
    });

    /*
    for (i = 0; i < screenimgs.length; i++){
        log("Img["+i+"] loaded at " + screenimgs[i].loadtime.toFixed(2) + " ms: ", "DEBUG");
        log(screenimgs[i], "DEBUG")
    }

    for (i = 0; i < jsResource.length; i++){
        log("JS["+i+"] loaded at " + jsResource[i].responseEnd.toFixed(2) + " ms: ", "DEBUG");
        log(jsResource[i], "DEBUG")
    }
    */

    //log("---- CALCULATING ATF ----", "DEBUG");
    calcWebMetrics(jsResource, cssResource, stats);

    var t = performance.timing;

    var page_img_ratio = 1.0*img_pixels / (screenRect.right * screenRect.bottom);
    var resources = window.performance.getEntriesByType("resource");

    
    var total_bytes = 0.0;
    var hash_tld = {};
    for (i=0; i<resources.length; i++){
        total_bytes += resources[i].transferSize / 1024.0;
        hash_tld[ getRootDomain(resources[i].name) ] = true;
    }
    stats.total_bytes    = total_bytes;
    stats.num_origins    = Object.keys(hash_tld).length;
    
    stats.version        = version;
    stats.right          = screenRect.right;
    stats.bottom         = screenRect.bottom;
    stats.num_img        = imgResource.length;
    stats.num_js         = jsResource.length;
    stats.num_css        = cssResource.length;
    stats.num_res        = resources.length;
    stats.first_paint    = GetFirstPaint(window);
    stats.ii_plt         = index_metric(resources, stats.dom, stats.plt, metric='image');
    stats.ii_atf         = index_metric(resources, stats.dom, stats.atf, metric='image');
    stats.oi_plt         = index_metric(resources, stats.dom, stats.plt, metric='object');
    stats.oi_atf         = index_metric(resources, stats.dom, stats.atf, metric='object');
    stats.bi_plt         = index_metric(resources, stats.dom, stats.plt, metric='bytes');
    stats.bi_atf         = index_metric(resources, stats.dom, stats.atf, metric='bytes');
    stats.si_rum         = RUMSpeedIndex();

    var body = document.body;
    var html = document.documentElement;
    stats.page_height   = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
    stats.page_width    = Math.max( body.scrollWidth, body.offsetWidth, 
                       html.clientWidth, html.scrollWidth, html.offsetWidth );

    var tags = ['img', 'map', 'area', 'canvas', 'figcaption', 'figure', 'picture', 'audio', 'source', 'track', 'video', 'object', 'a']

    /*
    if(savePageProfile>=2) stats.timing = t;
    if(savePageProfile>=1) {
        imageProfile(imgs, stats); 
        var timings = {};
        var resources = window.performance.getEntriesByType("resource");
        for (i =0; i<resources.length; i++){
            key = geturlkey(resources[i].name);
            timings[key] = resources[i].responseEnd;
        }
        stats.rects = getRectangles(timings);
    }
    if(savePageProfile>=3) stats.resources      = window.performance.getEntries();
    */

    //Printing results    
    /*
    log("Img pixels:       " + img_pixels, "DEBUG");
    log("distinct_imgs:    " + Object.keys(hashImgs).length);
    log("num_atf_img:      " + screenimgs.length)
    log("image-page ratio: " + page_img_ratio.toFixed(2));
    log("page_width        " + stats.page_width.toFixed(2) )
    log("page_height       " + stats.page_height.toFixed(2) )
    log("right             " + stats.right.toFixed(2) )
    log("bottom            " + stats.bottom.toFixed(2) )
    log("total_kbytes      " + stats.total_bytes.toFixed(2) )
    log("num_origins       " + stats.total_bytes.toFixed(2) )
    log("first_paint:      " + stats.first_paint.toFixed(2))
    log("II_plt:           " + stats.ii_plt.toFixed(2))
    log("II_atf:           " + stats.ii_atf.toFixed(2))
    log("OI_plt:           " + stats.oi_plt.toFixed(2))
    log("OI_atf:           " + stats.oi_atf.toFixed(2))
    log("BI_plt:           " + stats.bi_plt.toFixed(2))
    log("BI_atf:           " + stats.bi_atf.toFixed(2))
    log("SI_rum:           " + stats.si_rum.toFixed(2))
    log("ATF_img:          " + stats.last_img.toFixed(2) )
    log("JS:               " + stats.last_js.toFixed(2) )
    log("CSS:              " + stats.last_css.toFixed(2) )
    log("ATF:              " + stats.atf.toFixed(2) )
    log("PLT:              " + stats.plt.toFixed(2) )
    */

    var pageurl = geturlkey(window.location.toString());
    //var filename  = "profile_"+pageurl+".json";
        
    var obj = {}
    obj[pageurl] = stats;

    stats.runtime      = performance.now() - script_start_time;

    if (savePageProfile > 0){
        //writeObjToFile(obj, filename)
    }

    runtime = performance.now() - script_start_time;
    log("Runtime:  " + runtime.toFixed(2) + " ms")
    log(output)
}

function index_metric(objects, min_time, max_time, metric='bytes'){
    //types = img, css, link , script
    var total_cost = 0.0;
    var index      = 0.0;

    for (var i=0; i<objects.length; i++){
        var loadtime = objects[i]['responseEnd'];
        var obj_type = objects[i]['initiatorType'];
        var obj_size = objects[i]['decodedBodySize'];

        var weight = 1.0;
        if (metric == 'images' && obj_type != 'img') weight = 0.0; 

        if (loadtime < min_time) loadtime = min_time;
        if (loadtime > max_time) continue;

        if (metric == 'object')
            cost_metric = 1.0
        else
            cost_metric = obj_size;

        cost   = weight*cost_metric
        index += loadtime * cost

        total_cost+= cost
    }

    if (total_cost > 0.0){
        index /= total_cost;
    }

    return index 
}

function getRootDomain(url) {
    if (url.indexOf("//") > -1) {
        domain = url.split('/')[2].split(':')[0].split('?')[0];
    } else {
        domain = url.split('/')[0].split(':')[0].split('?')[0];
    }

    var splitArr = domain.split('.');
    var arrLen = splitArr.length;

    if (splitArr.length > 2) {
        domain = splitArr[splitArr.length - 2] + '.' + splitArr[splitArr.length - 1];
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function intersectRect(r1, r2) {
  return !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

function overlapRect(r1, r2){
    x11 = r1.left;
    y11 = r1.top;
    x12 = r1.right;
    y12 = r1.bottom;
    x21 = r2.left;
    y21 = r2.top;
    x22 = r2.right;
    y22 = r2.bottom;

    x_overlap = Math.max(0, Math.min(x12,x22) - Math.max(x11,x21));
    y_overlap = Math.max(0, Math.min(y12,y22) - Math.max(y11,y21));
    return x_overlap * y_overlap;
}

function geturlkey(url){
    return url.trim().replace(/^https:/,'http:').replace(/\/$/,'').toLowerCase();
}

//Return: IMG, JS, CSS;
function getResources(){
    var resourceList = window.performance.getEntriesByType("resource");
    var imgResource = [];
    var jsResource  = [];
    var cssResource = [];
    var neither     = []
    var not_added = 0

    for (i = 0; i < resourceList.length; i++) {
        var added = false;

        if ( (resourceList[i].initiatorType == "img") && 
        !(resourceList[i].name.match(/[.](css|js)$/)) &&
        !(resourceList[i].name.match(/[.](css|js)[?].*$/))){
            added = true;
            imgResource.push( resourceList[i] );
        }

        //CSS detection
        if ( (resourceList[i].initiatorType == "link") || 
            ((resourceList[i].initiatorType == "css")) ||
            (resourceList[i].name.match(/[.](css)/)) ) { 
            if (added) log("Re-added as CSS "+i+": " + resourceList[i].initiatorType + ": " + resourceList[i].name);
            added = true;
            cssResource.push( resourceList[i] );
        }

        if ((resourceList[i].initiatorType == "script")) //|| (resourceList[i].name.match(/[.](js)$/))
        {
            if (added) log("Re-added as JS "+i+": " + resourceList[i].initiatorType + ": " + resourceList[i].name);
            added = true;
            jsResource.push( resourceList[i] );
        }

        if (added == false){
            //log("Not added: " + resourceList[i].initiatorType + ": " + resourceList[i].name);
            not_added+=1;
            neither.push ( resourceList[i] )
        }
    }
    
    log("num_res:          " + resourceList.length)
    log("num_img:          " + imgResource.length);
    log("num_css:          " + jsResource.length);
    log("num_js:           " + cssResource.length);
    log("num_others:       " + not_added);

    return [imgResource, jsResource, cssResource, neither];
}


//MIT LICENSE
/*
function writeObjToFile(object, filename){
    log("Saving object to file: " + filename, "DEBUG");
    var blob = new Blob([JSON.stringify(object)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filename);
}
*/

// Get the first paint time.
var firstPaint;
var win = window;
var doc = document;
var navStart = win.performance.timing.navigationStart;
function GetFirstPaint(win) {
    // Try the standardized paint timing api
    try {
        var entries = performance.getEntriesByType('paint');
        for (var i = 0; i < entries.length; i++) {
            if (entries[i]['name'] == 'first-paint') {
                navStart = performance.getEntriesByType("navigation")[0].startTime;
                firstPaint = entries[i].startTime - navStart;
                break;
            }
        }
    } catch(e) {
    }
    // If the browser supports a first paint event, just use what the browser reports
    if (firstPaint === undefined && 'msFirstPaint' in win.performance.timing)
        firstPaint = win.performance.timing.msFirstPaint - navStart;
    if (firstPaint === undefined && 'chrome' in win && 'loadTimes' in win.chrome) {
        var chromeTimes = win.chrome.loadTimes();
        if ('firstPaintTime' in chromeTimes && chromeTimes.firstPaintTime > 0) {
            var startTime = chromeTimes.startLoadTime;
            if ('requestTime' in chromeTimes)
                startTime = chromeTimes.requestTime;
            if (chromeTimes.firstPaintTime >= startTime)
                firstPaint = (chromeTimes.firstPaintTime - startTime) * 1000.0;
        }
    }
    // For browsers that don't support first-paint or where we get insane values,
    // use the time of the last non-async script or css from the head.
    if (firstPaint === undefined || firstPaint < 0 || firstPaint > 120000) {
        firstPaint = win.performance.timing.responseStart - navStart;
        var headURLs = {};
        var headElements = doc.getElementsByTagName('head')[0].children;
        for (var i = 0; i < headElements.length; i++) {
            var el = headElements[i];
            if (el.tagName == 'SCRIPT' && el.src && !el.async)
                headURLs[el.src] = true;
            if (el.tagName == 'LINK' && el.rel == 'stylesheet' && el.href)
                headURLs[el.href] = true;
        }
        var requests = win.performance.getEntriesByType("resource");
        var doneCritical = false;
        for (var j = 0; j < requests.length; j++) {
            if (!doneCritical && headURLs[requests[j].name] &&
               (requests[j].initiatorType == 'script' || requests[j].initiatorType == 'link')) {
                var requestEnd = requests[j].responseEnd;
                if (firstPaint === undefined || requestEnd > firstPaint)
                    firstPaint = requestEnd;
            } else {
                doneCritical = true;
            }
        }
    }
    firstPaint = Math.max(firstPaint, 0);
    return firstPaint;
}

//RUM SPEED INDEX
var RUMSpeedIndex = function(win) {
    win = win || window;
    var doc = win.document;
    
    /****************************************************************************
      Support Routines
    ****************************************************************************/
    // Get the rect for the visible portion of the provided DOM element
    var GetElementViewportRect = function(el) {
        var intersect = false;
        if (el.getBoundingClientRect) {
            var elRect = el.getBoundingClientRect();
            intersect = {'top': Math.max(elRect.top, 0),
                        'left': Math.max(elRect.left, 0),
                        'bottom': Math.min(elRect.bottom, (win.innerHeight || doc.documentElement.clientHeight)),
                        'right': Math.min(elRect.right, (win.innerWidth || doc.documentElement.clientWidth))};
            if (intersect.bottom <= intersect.top || intersect.right <= intersect.left) {
                intersect = false;
            } else {
                intersect.area = (intersect.bottom - intersect.top) * (intersect.right - intersect.left);
            }
        }
        return intersect;
    };
  
    // Check a given element to see if it is visible
    var CheckElement = function(el, url) {
        if (url) {
            var rect = GetElementViewportRect(el);
            if (rect) {
            rects.push({'url': url,
                        'area': rect.area,
                        'rect': rect});
            }
        }
    };
  
    // Get the visible rectangles for elements that we care about
    var GetRects = function() {
      // Walk all of the elements in the DOM (try to only do this once)
      var elements = doc.getElementsByTagName('*');
      var re = /url\(.*(http.*)\)/ig;
      for (var i = 0; i < elements.length; i++) {
        var el = elements[i];
        var style = win.getComputedStyle(el);
  
        // check for Images
        if (el.tagName == 'IMG') {
          CheckElement(el, el.src);
        }
        // Check for background images
        if (style['background-image']) {
          re.lastIndex = 0;
          var matches = re.exec(style['background-image']);
          if (matches && matches.length > 1)
            CheckElement(el, matches[1].replace('"', ''));
        }
        // recursively walk any iFrames
        if (el.tagName == 'IFRAME') {
          try {
            var rect = GetElementViewportRect(el);
            if (rect) {
              var tm = RUMSpeedIndex(el.contentWindow);
              if (tm) {
                rects.push({'tm': tm,
                            'area': rect.area,
                            'rect': rect});
              }
            }
          } catch(e) {
          }
        }
      }
    };
  
    // Get the time at which each external resource loaded
    var GetRectTimings = function() {
      var timings = {};
      var requests = win.performance.getEntriesByType("resource");
      for (var i = 0; i < requests.length; i++)
        timings[requests[i].name] = requests[i].responseEnd;
      for (var j = 0; j < rects.length; j++) {
        if (!('tm' in rects[j]))
          rects[j].tm = timings[rects[j].url] !== undefined ? timings[rects[j].url] : 0;
      }
    };
  
    // Sort and group all of the paint rects by time and use them to
    // calculate the visual progress
    var CalculateVisualProgress = function() {
      var paints = {'0':0};
      var total = 0;
      for (var i = 0; i < rects.length; i++) {
        var tm = firstPaint;
        if ('tm' in rects[i] && rects[i].tm > firstPaint)
          tm = rects[i].tm;
        if (paints[tm] === undefined)
          paints[tm] = 0;
        paints[tm] += rects[i].area;
        total += rects[i].area;
      }

      // Add a paint area for the page background (count 10% of the pixels not
      // covered by existing paint rects.
      var pixels = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0) *
                   Math.max(doc.documentElement.clientHeight, win.innerHeight || 0);
      if (pixels > 0 ) {
        pixels = Math.max(pixels - total, 0) * pageBackgroundWeight;
        if (paints[firstPaint] === undefined)
          paints[firstPaint] = 0;
        paints[firstPaint] += pixels;
        total += pixels;
      }

      // Calculate the visual progress
      if (total) {
        for (var time in paints) {
          if (paints.hasOwnProperty(time)) {
            progress.push({'tm': time, 'area': paints[time]});
          }
        }
        progress.sort(function(a,b){return a.tm - b.tm;});
        var accumulated = 0;
        for (var j = 0; j < progress.length; j++) {
          accumulated += progress[j].area;
          progress[j].progress = accumulated / total;
        }
      }
    };
  
    // Given the visual progress information, Calculate the speed index.
    var CalculateSpeedIndex = function() {
      if (progress.length) {
        SpeedIndex = 0;
        var lastTime = 0;
        var lastProgress = 0;
        for (var i = 0; i < progress.length; i++) {
          var elapsed = progress[i].tm - lastTime;
          if (elapsed > 0 && lastProgress < 1)
            SpeedIndex += (1 - lastProgress) * elapsed;
          lastTime = progress[i].tm;
          lastProgress = progress[i].progress;
        }
      } else {
        SpeedIndex = firstPaint;
      }
    };
  
    /****************************************************************************
      Main flow
    ****************************************************************************/
    var rects = [];
    var progress = [];
    var firstPaint;
    var SpeedIndex;
    var pageBackgroundWeight = 0.1;
    try {
        GetRects();
        GetRectTimings();
        firstPaint = GetFirstPaint(win);
        CalculateVisualProgress();
        CalculateSpeedIndex();
    } catch(e) {
    }
    return SpeedIndex;
};

function initContentScript() {
    console.log("WebMythBusters content-script.js starts!");

    screenRect.left   = 0;
    screenRect.top    = 0;
    screenRect.right  = document.documentElement.clientWidth;
    screenRect.bottom = document.documentElement.clientHeight;
    
    if (!screenRect.right)  screenRect.right = 1024;
    if (!screenRect.bottom) screenRect.bottom = 768;

    var perfData = window.performance.timing;
    navigationStart = perfData.navigationStart;
    URL = document.URL;
    //storageKey = pageData.URL + "," + pageData.navigationStart;
    pageKey = URL + "," + navigationStart;
}


function calcWebMetrics(jsResource, cssResource, stats){
    var t = performance.timing;

    stats.domstart = t.domContentLoadedEventStart - t.navigationStart;
    stats.dom      = t.domContentLoadedEventEnd   - t.navigationStart;
    if (t.loadEventEnd> 1000){
        stats.plt      = t.loadEventEnd - t.navigationStart;
    } else {
        stats.plt      = Date.now() - t.navigationStart;
    }
    stats.last_js  = 0.0;
    stats.last_css = 0.0;

    for (var i=0; i < jsResource.length; i++){
        var loadtime = jsResource[i].responseEnd;
        if (loadtime > stats.last_js) stats.last_js = loadtime;
    }

    for (var i=0; i < cssResource.length; i++){
        var loadtime = cssResource[i].responseEnd;
        if (loadtime > stats.last_css) stats.last_css = loadtime;
    }

    stats.atf = Math.max(stats.last_img, stats.last_css); //Not including JS times for now
}

function getParameterOrNull(obj, parameter){
    if (parameter in obj){
        return obj[parameter];
    } else {
        return 'null';
    }
}

function imageProfile(imgs, stats){
    var imglist = [];
    for (var i = 0; i<imgs.length; i++) {
        imgd = {}
        
        imgd.src         = imgs[i].src;
        imgd.name        = geturlkey(imgs[i].src);
        
        rect             = imgs[i].getBoundingClientRect();
        imgd.x           = rect.x
        imgd.y           = rect.y
        imgd.top         = rect.top
        imgd.bottom      = rect.bottom
        imgd.left        = rect.left
        imgd.right       = rect.right
        imgd.width       = rect.width
        imgd.height      = rect.height

        imgd.loadtime    = getParameterOrNull(imgs[i],'loadtime');
        imgd.onscreen    = getParameterOrNull(imgs[i],'onscreen');
        imgd.screen_area = getParameterOrNull(imgs[i],'screen_area');
        
        imglist.push(imgd);
    }
    
    stats.imgs = imglist;
}

// 주관적 사용자 만족도 조사
function generateSurvey(prob) {
    if (generateSurveyDone) {
        return;
    }

    if (!('head' in document) || document.head == null) {
        return;
    }

    generateSurveyDone = true;
    
    let survey_start_time = performance.now();

    let randomNumber = Math.random();
    log("RandomNumber: " + randomNumber);
    if (randomNumber < prob) {
        let dialog = document.createElement('dialog');
        dialog.id = "hoon-dialog";

        let dialog_style = document.createElement('style');
        let dialog_css = "#hoon-dialog {width: 80%; margin: 0px auto; z-index: 1; position: fixed; overflow: auto}";

        document.head.appendChild(dialog_style);
        dialog_style.type = 'text/css';
        dialog_style.appendChild(document.createTextNode(dialog_css));
        
        let dialog_buttons = [
            "<button class='hoon-dialog-button' value='yes' style='font-family: sans-serif; border: none; background: #CCC; color: #000; font-size: 16px; padding: 20px 15px; margin-bottom: 10px; width: 100%; box-shadow: none;'>Yes</button><br>\n",
            "<button class='hoon-dialog-button' value='notsure' style='font-family: sans-serif; border: none; background: #CCC; color: #000; font-size: 16px; padding: 20px 15px; margin-bottom: 10px; width: 100%; box-shadow: none;'>Not sure</button><br>\n",
            "<button class='hoon-dialog-button' value='no' style='font-family: sans-serif; border: none; background: #CCC; color: #000; font-size: 16px; padding: 20px 15px; margin-bottom: 10px; width: 100%; box-shadow: none;'>No</button><br>\n"
        ];

        let dialog_sequences = [
            [0, 1, 2],
            [0, 2, 1],
            [1, 0, 2],
            [1, 2, 0],
            [2, 0, 1],
            [2, 1, 0]
        ];

        let dialog_random_index = Math.floor(Math.random() * 6);

        let dialog_html = "<form class='hoon-dialog-form' method='dialog'>\n";
        dialog_html += "<p style='font-family: sans-serif; font-size: 16px; padding: 10px 10px; text-align: center;'> Is this page loaded quick enough?<br>";
        dialog_html += "Are you satisfied?</p>\n";
        dialog_html += "<menu style='padding: 0; margin: 0px auto'>\n"
        for (var i = 0; i < 3; ++i) {
            dialog_html += dialog_buttons[dialog_sequences[dialog_random_index][i]];
        }
        dialog_html += "</menu></form></dialog>\n";

        document.body.appendChild(dialog);
        dialog.innerHTML = dialog_html;

        if (typeof dialog.showModal == "function") {
            dialog.showModal();
        } else {
            alert("The dialog API is not supported by this browser");
        }

        dialog.addEventListener('close', function onClose() {
            dialog_value = dialog.returnValue;
            let survey_time = performance.now(); - survey_start_time;
            try {
                var thisData = {
                    pageKey: pageKey,
                    func: "handleSurvey",
                    surveyValue: dialog_value,
                    surveyProb: prob,
                    surveyTime: survey_time,
                    surveyIndex: dialog_random_index
                };

                if (isPortConnected) {
                    myPort.postMessage(thisData);
                } else {
                    portBuffer.push(thisData);
                }
            } catch (err) {

            }
        })
        log("dialog 삽입 성공");
    } else {
        log("dialog 삽입 패스");
    }
}

function askWorkerID() {
    let workerID = prompt("[WebMythBusters]\n\nPlease enter your workerID!");

    if (workerID != null) {
        try {
            var thisData = {
                func: "setWorkerID",
                workerID: workerID
            };

            myPort.postMessage(thisData);
        } catch {

        }
    }
}

// **************** Main Start ******************
// 초기화
initContentScript();

// tti-polyfill
!function(){if('PerformanceLongTaskTiming' in window){var g=window.__tti={e:[]};
g.o=new PerformanceObserver(function(l){g.e=g.e.concat(l.getEntries())});
g.o.observe({entryTypes:['longtask']})}}();

// longtasks observer
longtaskObserver.observe({entryTypes: ['longtask']});

// background와 연결
myPort = chrome.runtime.connect({name:"port-from-cs"});
myPort.postMessage({greeting: "hello from content script! " + URL});
myPort.onMessage.addListener(function(m) {
    log("In content script, received message from background script");
    if (m.msg == "Hi there content script!") {
        myPort.postMessage({
            func: "initStart"
        });

        // 버퍼 처리 이전
        for (var d of portBuffer) {
            try {
                myPort.postMessage(d);
            } catch (e) {
                console.log(e);
            }
        }

        // 버퍼 처리 이후
        myPort.postMessage({
            func: "initDone"
        });
    } else if (m.msg == "initDone") {
        portBuffer = [];
        isPortConnected = true; // If another messages add, this line should be changed.
    } else if (m.msg == "initStart") {
        if (m.isNeededWorkerID) {
            askWorkerID();
        }
    }
});

// background 연결 후 동작
portBuffer.push({
    version: version,
    pageKey: pageKey,
    func: "afterBackgroundConnection",
    URL: URL,
    referrer: document.referrer,
    navigationStart: window.performance.timing.navigationStart,
    outerHeight: window.outerHeight,
    outerWidth: window.outerWidth,
    timeOrigin: performance.timeOrigin
});

window.addEventListener('click', function(e) {
    let thisMessage = {
        pageKey: pageKey,
        func: "handleClick",
        click: {
            clientX: e.clientX,
            clientY: e.clientY,
            screenX: e.screenX,
            screenY: e.screenY,
            pNow: performance.now(),
            timeStamp: e.timeStamp
        }
    };

    if (isPortConnected) {
        myPort.postMessage(thisMessage);
    } else {
        portBuffer.push(thisMessage);
    }
});

window.addEventListener('scroll', function(e) {
    last_known_scroll_position = window.scrollY;

    if (!ticking) {
        window.requestAnimationFrame(function() {
            let thisMessage = {
                pageKey: pageKey,
                func: "handleScroll",
                scroll: {
                    y: last_known_scroll_position,
                    pNow: performance.now(),
                    timeStamp: e.timeStamp
                }
            };

            if (isPortConnected) {
                myPort.postMessage(thisMessage);
            } else {
                portBuffer.push(thisMessage);
            }
            ticking = false;
        });
        ticking = true;
    }
});

// 로딩 완료 후!
window.addEventListener('load', function(e) {
    log("onLoad finisned");
    try {
        let thisTime = new Date().getTime();
        let thisData = {
            pageKey: pageKey,
            func: "handleLoad1",
            loadEventEnd: thisTime,
            loadTimeStamp: e.timeStamp
        };

        if (isPortConnected) {
            myPort.postMessage(thisData);
        } else {
            portBuffer.push(thisData);
        }
    } catch (err) {
        console.log(err);
    }
    
    // 아래 부분은 0.5초 후에 실행 (비동기적)
    setTimeout (function() {
        // 각종 PLT 지표 정보
        try {
            calculateATF();
            var navigationTimingObject = window.performance.timing.toJSON();
    
            var thisData = {
                pageKey: pageKey,
                func: "handleLoad3",
                navigationTiming: navigationTimingObject,
                stats: stats
            };
    
            if (isPortConnected) {
                myPort.postMessage(thisData);
            } else {
                portBuffer.push(thisData);
            }
        } catch (err) {
            console.log(err);
        }

        // 추가 정보 (네트워크, CPU, GPU, 메모리 등등)
        // 네트워크 외의 정보는 백그라운드에서 처리
        try {
            let networkType = "";
            if (navigator.connection.type != undefined) {
                networkType = navigator.connection.type;
            }

            let thisNetworkInformation = {
                effectiveType: navigator.connection.effectiveType,
                rtt: navigator.connection.rtt,
                downlink: navigator.connection.downlink,
                type: networkType
            };

            let thisPerformanceMemory = {
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                usedJSHeapSize: performance.memory.usedJSHeapSize
            }

            var thisData = {
                pageKey: pageKey,
                func: "handleExtraInfo",
                networkInformation: thisNetworkInformation,
                performanceMemory: thisPerformanceMemory,
                navigationType: performance.navigation.type,
                documentOffsetHeight: document.body.offsetHeight,
                documentClientHeight: document.body.clientHeight
            };
            if (isPortConnected) {
                myPort.postMessage(thisData);
            } else {
                portBuffer.push(thisData);
            }
        } catch (err) {
            console.log(err);
        }

        // 각종 오브젝트 관련 정보
        try {
            //var tagClientRects = [...document.getElementsByTagName("*")].map(x => x.getBoundingClientRect().toJSON());
            //var tagNames = [...document.getElementsByTagName("*")].map(x => x.tagName);
            //var tagSrcs = [...document.getElementsByTagName("*")].map(x => x.src);
            //var tagStylesBackgroundImage = [...document.getElementsByTagName("*")].map(x => window.getComputedStyle(x)['background-image']);
            var resources = window.performance.getEntries().map(x => x.toJSON());
            
            var thisData = {
                pageKey: pageKey,
                func: "handleLoad2",
                resources: resources
            };
    
            if (isPortConnected) {
                myPort.postMessage(thisData);
            } else {
                portBuffer.push(thisData);
            }
        } catch (err) {
            console.log(err);
        }
    }, 500);

    // longTask와 TTI 확인 (1초 후)
    setTimeout(function() {
        ttiPolyfill.getFirstConsistentlyInteractive().then((tti) => {
            try {
                var thisData = {
                    pageKey: pageKey,
                    func: "handleTTI",
                    longtasks: longtasks,
                    tti: tti
                }
    
                if (isPortConnected) {
                    myPort.postMessage(thisData);
                } else {
                    portBuffer.push(thisData);
                }
            } catch (err) {
                console.log(err);
            }
        });
    }, 1000);
    
    // 아래 부분은 로드 후 1초 이내에 실행 (33%), 또는 전체에서 3초 이내에 실행 (50%)
    setTimeout(generateSurvey, 1000, 0.33);
});

// 시각적을 보이는지 아닌지 확인 TODO check 페이지 변환 시?
document.addEventListener("visibilitychange", function(e) {
    let thisMessage = {
        pageKey: pageKey,
        func: "handleVisibilitychange",
        visibilitychange: {
            pNow: performance.now(),
            timeStamp: e.timeStamp,
            state: document.visibilityState
        }
    };

    if (isPortConnected) {
        myPort.postMessage(thisMessage);
    } else {
        portBuffer.push(thisMessage);
    }
});

/*
chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
*/

// 1초에 한번씩 데이터 쓰기
/*
updateData();
setInterval(updateData, 1000);
*/

// 아래 부분은 로드 후 1초 이내에 실행 (33%), 또는 전체에서 3초 이내에 실행 (50%)
setTimeout(generateSurvey, 3000, 0.50);

