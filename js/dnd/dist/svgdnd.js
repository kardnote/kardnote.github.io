(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SVGDnD"] = factory();
	else
		root["SVGDnD"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.create = exports.support = undefined;

	var _from = __webpack_require__(1);

	var _from2 = _interopRequireDefault(_from);

	var _toConsumableArray2 = __webpack_require__(54);

	var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

	var _svgjs = __webpack_require__(55);

	var _svgjs2 = _interopRequireDefault(_svgjs);

	var _subscription = __webpack_require__(56);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// const directions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
	var r = 5;
	var drag_detection = 100;
	var user_dblclick = 200;
	var mouse = new _subscription.MouseMonitor();

	var support = exports.support = function support() {
	    if (!_svgjs2.default.supported) {
	        alert('SVGJS not supported');
	    }
	};

	var create = exports.create = function create() {
	    var Host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#svg';
	    var Canvas = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#surface1';
	    var Component = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.selectable';
	    var Container = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.selectable-group';

	    var svg = (0, _svgjs2.default)(document.querySelector(Host));
	    var canvas = document.querySelector(Canvas);
	    var selected = svg.set();
	    var selectables = [].concat((0, _toConsumableArray3.default)(svg.select(Component).members));
	    var selectableGroups = [].concat((0, _toConsumableArray3.default)(svg.select(Container).members));
	    var selectableNodes = selectables.map(function (selectable) {
	        return selectable.native();
	    });

	    var _canvas$getBoundingCl = canvas.getBoundingClientRect(),
	        pw = _canvas$getBoundingCl.width,
	        top = _canvas$getBoundingCl.top,
	        left = _canvas$getBoundingCl.left;

	    var _canvas$getBBox = canvas.getBBox(),
	        sw = _canvas$getBBox.width,
	        sh = _canvas$getBBox.height;

	    var ratio = sw / pw;

	    var selector = void 0,
	        groupSelector = void 0,
	        dragging = void 0,
	        resizing = void 0,
	        grouping = void 0,
	        clickStack = [];

	    var canvasBox = function canvasBox(box) {
	        var _box$getBoundingClien = box.getBoundingClientRect(),
	            t = _box$getBoundingClien.top,
	            l = _box$getBoundingClien.left,
	            width = _box$getBoundingClien.width,
	            height = _box$getBoundingClien.height;

	        var w = parseInt(width * ratio),
	            h = parseInt(height * ratio),
	            x = (l + window.pageXOffset - left) * ratio,
	            x2 = x + w,
	            y = (t + window.pageYOffset - top) * ratio,
	            y2 = y + h;
	        return { x: x, y: y, w: w, h: h, x2: x2, y2: y2 };
	    };

	    var merge = function merge(a, b) {
	        var x = Math.min(a.x, b.x),
	            y = Math.min(a.y, b.y),
	            w = Math.max(a.x + a.w, b.x + b.w) - x,
	            h = Math.max(a.y + a.h, b.y + b.h) - y;
	        return { x: x, y: y, w: w, h: h, x2: x + w, y2: y + h };
	    };

	    var bbox = function bbox(set) {
	        var box = canvasBox(set.members[0].node);
	        set.members.forEach(function (member) {
	            box = merge(box, canvasBox(member.node));
	        });
	        return box;
	    };

	    var inside = function inside(box, tx, ty, tx2, ty2) {
	        var x = box.x,
	            x2 = box.x2,
	            y = box.y,
	            y2 = box.y2;

	        return tx < x && ty < y && tx2 > x2 && ty2 > y2 ? true : false;
	    };

	    var overlap = function overlap(target, tx, ty, tx2, ty2) {
	        var _canvasBox = canvasBox(target.node),
	            x = _canvasBox.x,
	            x2 = _canvasBox.x2,
	            y = _canvasBox.y,
	            y2 = _canvasBox.y2;

	        return x2 >= tx && y2 >= ty && tx2 >= x && ty2 >= y ? true : false;
	    };

	    var groupStart = function groupStart() {
	        return setTimeout(function () {
	            var _mouse$curr = mouse.curr(),
	                cx = _mouse$curr.cx,
	                cy = _mouse$curr.cy;

	            groupSelector = svg.rect(1, 1).addClass('drag-select');
	            var updateDragSelection = function updateDragSelection(mx, my) {
	                var w = (mx - cx) * ratio;
	                var h = (my - cy) * ratio;
	                if (w < 0) {
	                    if (h < 0) {
	                        groupSelector.translate((mx - left) * ratio, (my - top) * ratio).size(-w, -h);
	                    } else {
	                        groupSelector.translate((mx - left) * ratio, (my - top) * ratio - h).size(-w, h);
	                    }
	                } else {
	                    if (h < 0) {
	                        groupSelector.translate((mx - left) * ratio - w, (my - top) * ratio).size(w, -h);
	                    } else {
	                        groupSelector.translate((mx - left) * ratio - w, (my - top) * ratio - h).size(w, h);
	                    }
	                }
	            };
	            mouse.subscribe(function (x, y) {
	                return updateDragSelection(x, y);
	            });
	        }, drag_detection * 2);
	    };

	    var groupEnd = function groupEnd() {
	        if (groupSelector) {
	            (function () {
	                var _canvasBox2 = canvasBox(groupSelector.node),
	                    x = _canvasBox2.x,
	                    y = _canvasBox2.y,
	                    x2 = _canvasBox2.x2,
	                    y2 = _canvasBox2.y2;

	                select(selectableGroups.filter(function (selectableGroup) {
	                    return overlap(selectableGroup, x, y, x2, y2);
	                }));
	                groupSelector.remove();
	                groupSelector = null;
	            })();
	        }
	    };

	    var dragStart = function dragStart() {
	        return setTimeout(function () {
	            var _mouse$curr2 = mouse.curr(),
	                prev_x = _mouse$curr2.cx,
	                prev_y = _mouse$curr2.cy;

	            var min_x = -r,
	                max_x = sw + r,
	                min_y = -r,
	                max_y = sh + r;
	            if (selected.members.length === 2) {
	                var target = selected.members[0];
	                if ((0, _from2.default)(target.node.classList).includes('restricted')) {
	                    console.log('restricting');
	                    var parents = target.parents();
	                    for (var i in parents) {
	                        if ((0, _from2.default)(parents[i].node.classList).includes('selectable-group')) {
	                            var _canvasBox3 = canvasBox(parents[i].node),
	                                x = _canvasBox3.x,
	                                y = _canvasBox3.y,
	                                w = _canvasBox3.w,
	                                h = _canvasBox3.h;

	                            min_x = x - r, min_y = y - r, max_x = x + w + r, max_y = y + h + r;
	                            break;
	                        }
	                    }
	                }
	            }
	            var drag = function drag(_x, _y) {
	                var _bbox = bbox(selected),
	                    x = _bbox.x,
	                    y = _bbox.y,
	                    w = _bbox.w,
	                    h = _bbox.h,
	                    x2 = _bbox.x2,
	                    y2 = _bbox.y2;

	                var dx = (_x - prev_x) * ratio,
	                    dy = (_y - prev_y) * ratio;
	                var nextBox = { x: x + dx, y: y + dy, x2: x2 + dx, y2: y2 + dx };
	                if (inside(nextBox, min_x, max_x, min_y, max_y)) {
	                    selected.dmove(dx, dy);
	                    prev_x = _x, prev_y = _y;
	                } else {
	                    var update_x = true,
	                        update_y = true;
	                    if (x + dx < min_x) {
	                        dx = min_x - x;
	                        update_x = false;
	                    } else if (x2 + dx > max_x) {
	                        dx = max_x - x2;
	                        update_x = false;
	                    }
	                    if (y + dy < min_y) {
	                        dy = min_y - y;
	                        update_y = false;
	                    } else if (y2 + dy > max_y) {
	                        dy = max_y - y2;
	                        update_y = false;
	                    }
	                    selected.dmove(dx, dy);
	                    if (update_x) prev_x = _x;
	                    if (update_y) prev_y = _y;
	                }
	            };
	            mouse.subscribe(function (x, y) {
	                return drag(x, y);
	            });
	        }, drag_detection);
	    };

	    var select = function select(willSelect) {
	        if (willSelect.length === 0) return;
	        willSelect.forEach(function (selectable) {
	            return selected.add(selectable);
	        });

	        // console.log(selected.members.select('rect'))
	        var rects = [];
	        selected.members.forEach(function (member) {
	            if (member.node.nodeName === 'g') rects = rects.concat(member.select('rect').members);
	        });

	        var _bbox2 = bbox(selected),
	            x = _bbox2.x,
	            y = _bbox2.y,
	            w = _bbox2.w,
	            h = _bbox2.h;

	        // Prep for click-n-drag


	        dragging = dragStart();

	        // Draw Selector
	        selector = svg.group().addClass('selection').translate(x, y);
	        selector.rect(w, h).addClass('svg_select_boundingRect');
	        resizorFactory(selector, 0, 0, w, h, rects, ratio);

	        // Bind Selector
	        selected.add(selector);
	        selectables.push(selector);
	        selectableNodes.push(selector.native());
	    };

	    var unselect = function unselect() {
	        selected.clear();
	        // Unbind && remove selector
	        if (selector) {
	            selector.remove();
	            selector = null;
	            selectables.pop();
	            selectableNodes.pop();
	        }
	    };

	    svg.on('mouseup', function (e) {
	        clearTimeout(grouping);
	        groupEnd();
	        clearTimeout(dragging);
	        mouse.clear();
	    });

	    svg.on('mousedown', function (e) {
	        var path = e.path,
	            clientX = e.clientX,
	            clientY = e.clientY;

	        var target = [];
	        for (var j in path) {
	            var i = selectableNodes.indexOf(path[j]);
	            if (i !== -1) {
	                target = [selectables[i]];
	                break;
	            }
	        }

	        if (target.length === 0) {
	            // Target is not selectable
	            unselect();
	            // Set for grouping
	            grouping = groupStart();
	        } else {
	            // Target is selectable
	            if (clickStack.length > 0) {
	                clearTimeout(clickStack.pop());
	                // Double clicked
	                unselect();
	                try {
	                    select(clickStack.pop().siblings());
	                } catch (e) {
	                    return;
	                }
	            } else {
	                // Single clicked
	                clickStack = [].concat((0, _toConsumableArray3.default)(target), [setTimeout(function () {
	                    return clickStack = [];
	                }, user_dblclick)]);
	                var isSelected = selected.has.apply(selected, (0, _toConsumableArray3.default)(target));
	                if (isSelected) {
	                    // Apply group drag
	                    dragging = dragStart();
	                } else {
	                    // Select new target
	                    unselect();
	                    select(target);
	                }
	            }
	        }
	    });
	};

	function resizorFactory(selector, x, y, w, h, rects, ratio) {
	    var directions = ['lt', 't', 'rt', 'r', 'rb', 'b', 'lb', 'l'];
	    directions.forEach(function (direction) {
	        var resizor = selector.circle(r * 2).addClass('svg_select_points').addClass('svg_select_points_' + direction).data('direction', direction);
	        updateResizer(resizor, direction, x, y, w, h);
	        resizor.on('mousedown', function (e) {
	            e.stopPropagation();
	            rects.forEach(function (rect) {
	                return resizeStart(rect, direction, ratio);
	            });
	            resizeStart(selector.first(), direction, ratio, selector.select('.svg_select_points').members);
	        });
	    });
	    selector.addClass('active');
	}

	function updateResizer(resizor, direction, x, y, w, h) {
	    switch (direction) {
	        case 'lt':
	            resizor.translate(x - r, y - r);
	            break;
	        case 't':
	            resizor.translate(x + 0.5 * w - r, y - r);
	            break;
	        case 'rt':
	            resizor.translate(x + w - r, y - r);
	            break;
	        case 'r':
	            resizor.translate(x + w - r, y + 0.5 * h - r);
	            break;
	        case 'rb':
	            resizor.translate(x + w - r, y + h - r);
	            break;
	        case 'b':
	            resizor.translate(x + 0.5 * w - r, y + h - r);
	            break;
	        case 'lb':
	            resizor.translate(x - r, y + h - r);
	            break;
	        case 'l':
	            resizor.translate(x - r, y + 0.5 * h - r);
	            break;
	    }
	}

	function resizeStart(rect, direction, ratio) {
	    var resizors = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

	    var _rect$transform = rect.transform(),
	        x = _rect$transform.x,
	        y = _rect$transform.y;

	    var _mouse$curr3 = mouse.curr(),
	        cx = _mouse$curr3.cx,
	        cy = _mouse$curr3.cy;

	    var w = rect.width(),
	        h = rect.height(),
	        r = w / h;

	    var resize = function resize(mouseX, mouseY) {
	        var dx = direction.includes('l') ? (mouseX - cx) * ratio : (cx - mouseX) * ratio,
	            dy = direction.includes('t') ? (mouseY - cy) * ratio : (cy - mouseY) * ratio;
	        var newHeight = void 0,
	            newWidth = void 0,
	            newX = void 0,
	            newY = void 0;
	        if (Math.abs(dx / w) <= Math.abs(dy / h)) {
	            newWidth = w - dx;
	            newHeight = newWidth / r;
	            newX = direction.includes('r') ? null : x + dx;
	            newY = direction.includes('b') ? null : y + dx / r;
	        } else {
	            newHeight = h - dy;
	            newWidth = newHeight * r;
	            newX = direction.includes('r') ? null : x + dy * r;
	            newY = direction.includes('b') ? null : y + dy;
	        }
	        if (newHeight < 10) return;
	        rect.translate(newX, newY).size(newWidth, newHeight);
	        if (resizors) resizors.forEach(function (resizor) {
	            return updateResizer(resizor, resizor.data('direction'), newX, newY, newWidth, newHeight);
	        });
	    };
	    mouse.subscribe(function (x, y) {
	        return resize(x, y);
	    });
	}

	exports.default = 'SVGDnD';

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	__webpack_require__(47);
	module.exports = __webpack_require__(11).Array.from;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(4)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(7)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(5)
	  , defined   = __webpack_require__(6);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(8)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(24)
	  , hide           = __webpack_require__(14)
	  , has            = __webpack_require__(25)
	  , Iterators      = __webpack_require__(26)
	  , $iterCreate    = __webpack_require__(27)
	  , setToStringTag = __webpack_require__(43)
	  , getPrototypeOf = __webpack_require__(45)
	  , ITERATOR       = __webpack_require__(44)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(10)
	  , core      = __webpack_require__(11)
	  , ctx       = __webpack_require__(12)
	  , hide      = __webpack_require__(14)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 10 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(13);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(15)
	  , createDesc = __webpack_require__(23);
	module.exports = __webpack_require__(19) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(16)
	  , IE8_DOM_DEFINE = __webpack_require__(18)
	  , toPrimitive    = __webpack_require__(22)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(19) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(17);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(19) && !__webpack_require__(20)(function(){
	  return Object.defineProperty(__webpack_require__(21)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(20)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(17)
	  , document = __webpack_require__(10).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(17);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);

/***/ },
/* 25 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(28)
	  , descriptor     = __webpack_require__(23)
	  , setToStringTag = __webpack_require__(43)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(14)(IteratorPrototype, __webpack_require__(44)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(16)
	  , dPs         = __webpack_require__(29)
	  , enumBugKeys = __webpack_require__(41)
	  , IE_PROTO    = __webpack_require__(38)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(21)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(42).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(15)
	  , anObject = __webpack_require__(16)
	  , getKeys  = __webpack_require__(30);

	module.exports = __webpack_require__(19) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(31)
	  , enumBugKeys = __webpack_require__(41);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(25)
	  , toIObject    = __webpack_require__(32)
	  , arrayIndexOf = __webpack_require__(35)(false)
	  , IE_PROTO     = __webpack_require__(38)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(33)
	  , defined = __webpack_require__(6);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(34);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(32)
	  , toLength  = __webpack_require__(36)
	  , toIndex   = __webpack_require__(37);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(5)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(5)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(39)('keys')
	  , uid    = __webpack_require__(40);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(10)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10).document && document.documentElement;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(15).f
	  , has = __webpack_require__(25)
	  , TAG = __webpack_require__(44)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(39)('wks')
	  , uid        = __webpack_require__(40)
	  , Symbol     = __webpack_require__(10).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(25)
	  , toObject    = __webpack_require__(46)
	  , IE_PROTO    = __webpack_require__(38)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(6);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(12)
	  , $export        = __webpack_require__(9)
	  , toObject       = __webpack_require__(46)
	  , call           = __webpack_require__(48)
	  , isArrayIter    = __webpack_require__(49)
	  , toLength       = __webpack_require__(36)
	  , createProperty = __webpack_require__(50)
	  , getIterFn      = __webpack_require__(51);

	$export($export.S + $export.F * !__webpack_require__(53)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(16);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(26)
	  , ITERATOR   = __webpack_require__(44)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(15)
	  , createDesc      = __webpack_require__(23);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(52)
	  , ITERATOR  = __webpack_require__(44)('iterator')
	  , Iterators = __webpack_require__(26);
	module.exports = __webpack_require__(11).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(34)
	  , TAG = __webpack_require__(44)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(44)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _from = __webpack_require__(1);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }

	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/*!
	* svg.js - A lightweight library for manipulating and animating SVG.
	* @version 2.3.5
	* http://www.svgjs.com
	*
	* @copyright Wout Fierens <wout@woutfierens.com>
	* @license MIT
	*
	* BUILT: Fri Oct 21 2016 13:38:14 GMT-0200 (WGST)
	*/;
	(function(root, factory) {
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function(){
	      return factory(root, root.document)
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  } else if (typeof exports === 'object') {
	    module.exports = root.document ? factory(root, root.document) : function(w){ return factory(w, w.document) }
	  } else {
	    root.SVG = factory(root, root.document)
	  }
	}(typeof window !== "undefined" ? window : this, function(window, document) {

	// The main wrapping element
	var SVG = this.SVG = function(element) {
	  if (SVG.supported) {
	    element = new SVG.Doc(element)

	    if(!SVG.parser.draw)
	      SVG.prepare()

	    return element
	  }
	}

	// Default namespaces
	SVG.ns    = 'http://www.w3.org/2000/svg'
	SVG.xmlns = 'http://www.w3.org/2000/xmlns/'
	SVG.xlink = 'http://www.w3.org/1999/xlink'
	SVG.svgjs = 'http://svgjs.com/svgjs'

	// Svg support test
	SVG.supported = (function() {
	  return !! document.createElementNS &&
	         !! document.createElementNS(SVG.ns,'svg').createSVGRect
	})()

	// Don't bother to continue if SVG is not supported
	if (!SVG.supported) return false

	// Element id sequence
	SVG.did  = 1000

	// Get next named element id
	SVG.eid = function(name) {
	  return 'Svgjs' + capitalize(name) + (SVG.did++)
	}

	// Method for element creation
	SVG.create = function(name) {
	  // create element
	  var element = document.createElementNS(this.ns, name)

	  // apply unique id
	  element.setAttribute('id', this.eid(name))

	  return element
	}

	// Method for extending objects
	SVG.extend = function() {
	  var modules, methods, key, i

	  // Get list of modules
	  modules = [].slice.call(arguments)

	  // Get object with extensions
	  methods = modules.pop()

	  for (i = modules.length - 1; i >= 0; i--)
	    if (modules[i])
	      for (key in methods)
	        modules[i].prototype[key] = methods[key]

	  // Make sure SVG.Set inherits any newly added methods
	  if (SVG.Set && SVG.Set.inherit)
	    SVG.Set.inherit()
	}

	// Invent new element
	SVG.invent = function(config) {
	  // Create element initializer
	  var initializer = typeof config.create == 'function' ?
	    config.create :
	    function() {
	      this.constructor.call(this, SVG.create(config.create))
	    }

	  // Inherit prototype
	  if (config.inherit)
	    initializer.prototype = new config.inherit

	  // Extend with methods
	  if (config.extend)
	    SVG.extend(initializer, config.extend)

	  // Attach construct method to parent
	  if (config.construct)
	    SVG.extend(config.parent || SVG.Container, config.construct)

	  return initializer
	}

	// Adopt existing svg elements
	SVG.adopt = function(node) {
	  // check for presence of node
	  if (!node) return null

	  // make sure a node isn't already adopted
	  if (node.instance) return node.instance

	  // initialize variables
	  var element

	  // adopt with element-specific settings
	  if (node.nodeName == 'svg')
	    element = node.parentNode instanceof SVGElement ? new SVG.Nested : new SVG.Doc
	  else if (node.nodeName == 'linearGradient')
	    element = new SVG.Gradient('linear')
	  else if (node.nodeName == 'radialGradient')
	    element = new SVG.Gradient('radial')
	  else if (SVG[capitalize(node.nodeName)])
	    element = new SVG[capitalize(node.nodeName)]
	  else
	    element = new SVG.Element(node)

	  // ensure references
	  element.type  = node.nodeName
	  element.node  = node
	  node.instance = element

	  // SVG.Class specific preparations
	  if (element instanceof SVG.Doc)
	    element.namespace().defs()

	  // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
	  element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {})

	  return element
	}

	// Initialize parsing element
	SVG.prepare = function() {
	  // Select document body and create invisible svg element
	  var body = document.getElementsByTagName('body')[0]
	    , draw = (body ? new SVG.Doc(body) :  new SVG.Doc(document.documentElement).nested()).size(2, 0)

	  // Create parser object
	  SVG.parser = {
	    body: body || document.documentElement
	  , draw: draw.style('opacity:0;position:fixed;left:100%;top:100%;overflow:hidden')
	  , poly: draw.polyline().node
	  , path: draw.path().node
	  , native: SVG.create('svg')
	  }
	}

	SVG.parser = {
	  native: SVG.create('svg')
	}

	document.addEventListener('DOMContentLoaded', function() {
	  if(!SVG.parser.draw)
	    SVG.prepare()
	}, false)

	// Storage for regular expressions
	SVG.regex = {
	  // Parse unit value
	  numberAndUnit:    /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

	  // Parse hex value
	, hex:              /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

	  // Parse rgb value
	, rgb:              /rgb\((\d+),(\d+),(\d+)\)/

	  // Parse reference id
	, reference:        /#([a-z0-9\-_]+)/i

	  // Parse matrix wrapper
	, matrix:           /matrix\(|\)/g

	  // Elements of a matrix
	, matrixElements:   /,*\s+|,/

	  // Whitespace
	, whitespace:       /\s/g

	  // Test hex value
	, isHex:            /^#[a-f0-9]{3,6}$/i

	  // Test rgb value
	, isRgb:            /^rgb\(/

	  // Test css declaration
	, isCss:            /[^:]+:[^;]+;?/

	  // Test for blank string
	, isBlank:          /^(\s+)?$/

	  // Test for numeric string
	, isNumber:         /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

	  // Test for percent value
	, isPercent:        /^-?[\d\.]+%$/

	  // Test for image url
	, isImage:          /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

	  // The following regex are used to parse the d attribute of a path

	  // Replaces all negative exponents
	, negExp:           /e\-/gi

	  // Replaces all comma
	, comma:            /,/g

	  // Replaces all hyphens
	, hyphen:           /\-/g

	  // Replaces and tests for all path letters
	, pathLetters:      /[MLHVCSQTAZ]/gi

	  // yes we need this one, too
	, isPathLetter:     /[MLHVCSQTAZ]/i

	  // split at whitespaces
	, whitespaces:      /\s+/

	  // matches X
	, X:                /X/g
	}

	SVG.utils = {
	  // Map function
	  map: function(array, block) {
	    var i
	      , il = array.length
	      , result = []

	    for (i = 0; i < il; i++)
	      result.push(block(array[i]))

	    return result
	  }

	  // Filter function
	, filter: function(array, block) {
	    var i
	      , il = array.length
	      , result = []

	    for (i = 0; i < il; i++)
	      if (block(array[i]))
	        result.push(array[i])

	    return result
	  }

	  // Degrees to radians
	, radians: function(d) {
	    return d % 360 * Math.PI / 180
	  }

	  // Radians to degrees
	, degrees: function(r) {
	    return r * 180 / Math.PI % 360
	  }

	, filterSVGElements: function(nodes) {
	    return this.filter( nodes, function(el) { return el instanceof SVGElement })
	  }

	}

	SVG.defaults = {
	  // Default attribute values
	  attrs: {
	    // fill and stroke
	    'fill-opacity':     1
	  , 'stroke-opacity':   1
	  , 'stroke-width':     0
	  , 'stroke-linejoin':  'miter'
	  , 'stroke-linecap':   'butt'
	  , fill:               '#000000'
	  , stroke:             '#000000'
	  , opacity:            1
	    // position
	  , x:                  0
	  , y:                  0
	  , cx:                 0
	  , cy:                 0
	    // size
	  , width:              0
	  , height:             0
	    // radius
	  , r:                  0
	  , rx:                 0
	  , ry:                 0
	    // gradient
	  , offset:             0
	  , 'stop-opacity':     1
	  , 'stop-color':       '#000000'
	    // text
	  , 'font-size':        16
	  , 'font-family':      'Helvetica, Arial, sans-serif'
	  , 'text-anchor':      'start'
	  }

	}
	// Module for color convertions
	SVG.Color = function(color) {
	  var match

	  // initialize defaults
	  this.r = 0
	  this.g = 0
	  this.b = 0

	  if(!color) return

	  // parse color
	  if (typeof color === 'string') {
	    if (SVG.regex.isRgb.test(color)) {
	      // get rgb values
	      match = SVG.regex.rgb.exec(color.replace(/\s/g,''))

	      // parse numeric values
	      this.r = parseInt(match[1])
	      this.g = parseInt(match[2])
	      this.b = parseInt(match[3])

	    } else if (SVG.regex.isHex.test(color)) {
	      // get hex values
	      match = SVG.regex.hex.exec(fullHex(color))

	      // parse numeric values
	      this.r = parseInt(match[1], 16)
	      this.g = parseInt(match[2], 16)
	      this.b = parseInt(match[3], 16)

	    }

	  } else if (typeof color === 'object') {
	    this.r = color.r
	    this.g = color.g
	    this.b = color.b

	  }

	}

	SVG.extend(SVG.Color, {
	  // Default to hex conversion
	  toString: function() {
	    return this.toHex()
	  }
	  // Build hex value
	, toHex: function() {
	    return '#'
	      + compToHex(this.r)
	      + compToHex(this.g)
	      + compToHex(this.b)
	  }
	  // Build rgb value
	, toRgb: function() {
	    return 'rgb(' + [this.r, this.g, this.b].join() + ')'
	  }
	  // Calculate true brightness
	, brightness: function() {
	    return (this.r / 255 * 0.30)
	         + (this.g / 255 * 0.59)
	         + (this.b / 255 * 0.11)
	  }
	  // Make color morphable
	, morph: function(color) {
	    this.destination = new SVG.Color(color)

	    return this
	  }
	  // Get morphed color at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this

	    // normalise pos
	    pos = pos < 0 ? 0 : pos > 1 ? 1 : pos

	    // generate morphed color
	    return new SVG.Color({
	      r: ~~(this.r + (this.destination.r - this.r) * pos)
	    , g: ~~(this.g + (this.destination.g - this.g) * pos)
	    , b: ~~(this.b + (this.destination.b - this.b) * pos)
	    })
	  }

	})

	// Testers

	// Test if given value is a color string
	SVG.Color.test = function(color) {
	  color += ''
	  return SVG.regex.isHex.test(color)
	      || SVG.regex.isRgb.test(color)
	}

	// Test if given value is a rgb object
	SVG.Color.isRgb = function(color) {
	  return color && typeof color.r == 'number'
	               && typeof color.g == 'number'
	               && typeof color.b == 'number'
	}

	// Test if given value is a color
	SVG.Color.isColor = function(color) {
	  return SVG.Color.isRgb(color) || SVG.Color.test(color)
	}
	// Module for array conversion
	SVG.Array = function(array, fallback) {
	  array = (array || []).valueOf()

	  // if array is empty and fallback is provided, use fallback
	  if (array.length == 0 && fallback)
	    array = fallback.valueOf()

	  // parse array
	  this.value = this.parse(array)
	}

	SVG.extend(SVG.Array, {
	  // Make array morphable
	  morph: function(array) {
	    this.destination = this.parse(array)

	    // normalize length of arrays
	    if (this.value.length != this.destination.length) {
	      var lastValue       = this.value[this.value.length - 1]
	        , lastDestination = this.destination[this.destination.length - 1]

	      while(this.value.length > this.destination.length)
	        this.destination.push(lastDestination)
	      while(this.value.length < this.destination.length)
	        this.value.push(lastValue)
	    }

	    return this
	  }
	  // Clean up any duplicate points
	, settle: function() {
	    // find all unique values
	    for (var i = 0, il = this.value.length, seen = []; i < il; i++)
	      if (seen.indexOf(this.value[i]) == -1)
	        seen.push(this.value[i])

	    // set new value
	    return this.value = seen
	  }
	  // Get morphed array at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this

	    // generate morphed array
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos)

	    return new SVG.Array(array)
	  }
	  // Convert array to string
	, toString: function() {
	    return this.value.join(' ')
	  }
	  // Real value
	, valueOf: function() {
	    return this.value
	  }
	  // Parse whitespace separated string
	, parse: function(array) {
	    array = array.valueOf()

	    // if already is an array, no need to parse it
	    if (Array.isArray(array)) return array

	    return this.split(array)
	  }
	  // Strip unnecessary whitespace
	, split: function(string) {
	    return string.trim().split(/\s+/)
	  }
	  // Reverse array
	, reverse: function() {
	    this.value.reverse()

	    return this
	  }

	})
	// Poly points array
	SVG.PointArray = function(array, fallback) {
	  this.constructor.call(this, array, fallback || [[0,0]])
	}

	// Inherit from SVG.Array
	SVG.PointArray.prototype = new SVG.Array

	SVG.extend(SVG.PointArray, {
	  // Convert array to string
	  toString: function() {
	    // convert to a poly point string
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push(this.value[i].join(','))

	    return array.join(' ')
	  }
	  // Convert array to line object
	, toLine: function() {
	    return {
	      x1: this.value[0][0]
	    , y1: this.value[0][1]
	    , x2: this.value[1][0]
	    , y2: this.value[1][1]
	    }
	  }
	  // Get morphed array at given position
	, at: function(pos) {
	    // make sure a destination is defined
	    if (!this.destination) return this

	    // generate morphed point string
	    for (var i = 0, il = this.value.length, array = []; i < il; i++)
	      array.push([
	        this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos
	      , this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos
	      ])

	    return new SVG.PointArray(array)
	  }
	  // Parse point string
	, parse: function(array) {
	    var points = []

	    array = array.valueOf()

	    // if already is an array, no need to parse it
	    if (Array.isArray(array)) return array

	    // parse points
	    array = array.trim().split(/\s+|,/)

	    // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
	    // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
	    if (array.length % 2 !== 0) array.pop()

	    // wrap points in two-tuples and parse points as floats
	    for(var i = 0, len = array.length; i < len; i = i + 2)
	      points.push([ parseFloat(array[i]), parseFloat(array[i+1]) ])

	    return points
	  }
	  // Move point string
	, move: function(x, y) {
	    var box = this.bbox()

	    // get relative offset
	    x -= box.x
	    y -= box.y

	    // move every point
	    if (!isNaN(x) && !isNaN(y))
	      for (var i = this.value.length - 1; i >= 0; i--)
	        this.value[i] = [this.value[i][0] + x, this.value[i][1] + y]

	    return this
	  }
	  // Resize poly string
	, size: function(width, height) {
	    var i, box = this.bbox()

	    // recalculate position of all points according to new size
	    for (i = this.value.length - 1; i >= 0; i--) {
	      this.value[i][0] = ((this.value[i][0] - box.x) * width)  / box.width  + box.x
	      this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y
	    }

	    return this
	  }
	  // Get bounding box of points
	, bbox: function() {
	    SVG.parser.poly.setAttribute('points', this.toString())

	    return SVG.parser.poly.getBBox()
	  }

	})
	// Path points array
	SVG.PathArray = function(array, fallback) {
	  this.constructor.call(this, array, fallback || [['M', 0, 0]])
	}

	// Inherit from SVG.Array
	SVG.PathArray.prototype = new SVG.Array

	SVG.extend(SVG.PathArray, {
	  // Convert array to string
	  toString: function() {
	    return arrayToString(this.value)
	  }
	  // Move path string
	, move: function(x, y) {
	    // get bounding box of current situation
	    var box = this.bbox()

	    // get relative offset
	    x -= box.x
	    y -= box.y

	    if (!isNaN(x) && !isNaN(y)) {
	      // move every point
	      for (var l, i = this.value.length - 1; i >= 0; i--) {
	        l = this.value[i][0]

	        if (l == 'M' || l == 'L' || l == 'T')  {
	          this.value[i][1] += x
	          this.value[i][2] += y

	        } else if (l == 'H')  {
	          this.value[i][1] += x

	        } else if (l == 'V')  {
	          this.value[i][1] += y

	        } else if (l == 'C' || l == 'S' || l == 'Q')  {
	          this.value[i][1] += x
	          this.value[i][2] += y
	          this.value[i][3] += x
	          this.value[i][4] += y

	          if (l == 'C')  {
	            this.value[i][5] += x
	            this.value[i][6] += y
	          }

	        } else if (l == 'A')  {
	          this.value[i][6] += x
	          this.value[i][7] += y
	        }

	      }
	    }

	    return this
	  }
	  // Resize path string
	, size: function(width, height) {
	    // get bounding box of current situation
	    var i, l, box = this.bbox()

	    // recalculate position of all points according to new size
	    for (i = this.value.length - 1; i >= 0; i--) {
	      l = this.value[i][0]

	      if (l == 'M' || l == 'L' || l == 'T')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
	        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y

	      } else if (l == 'H')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x

	      } else if (l == 'V')  {
	        this.value[i][1] = ((this.value[i][1] - box.y) * height) / box.height + box.y

	      } else if (l == 'C' || l == 'S' || l == 'Q')  {
	        this.value[i][1] = ((this.value[i][1] - box.x) * width)  / box.width  + box.x
	        this.value[i][2] = ((this.value[i][2] - box.y) * height) / box.height + box.y
	        this.value[i][3] = ((this.value[i][3] - box.x) * width)  / box.width  + box.x
	        this.value[i][4] = ((this.value[i][4] - box.y) * height) / box.height + box.y

	        if (l == 'C')  {
	          this.value[i][5] = ((this.value[i][5] - box.x) * width)  / box.width  + box.x
	          this.value[i][6] = ((this.value[i][6] - box.y) * height) / box.height + box.y
	        }

	      } else if (l == 'A')  {
	        // resize radii
	        this.value[i][1] = (this.value[i][1] * width)  / box.width
	        this.value[i][2] = (this.value[i][2] * height) / box.height

	        // move position values
	        this.value[i][6] = ((this.value[i][6] - box.x) * width)  / box.width  + box.x
	        this.value[i][7] = ((this.value[i][7] - box.y) * height) / box.height + box.y
	      }

	    }

	    return this
	  }
	  // Absolutize and parse path to array
	, parse: function(array) {
	    // if it's already a patharray, no need to parse it
	    if (array instanceof SVG.PathArray) return array.valueOf()

	    // prepare for parsing
	    var i, x0, y0, s, seg, arr
	      , x = 0
	      , y = 0
	      , paramCnt = { 'M':2, 'L':2, 'H':1, 'V':1, 'C':6, 'S':4, 'Q':4, 'T':2, 'A':7 }

	    if(typeof array == 'string'){

	      array = array
	        .replace(SVG.regex.negExp, 'X')         // replace all negative exponents with certain char
	        .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
	        .replace(SVG.regex.hyphen, ' -')        // add space before hyphen
	        .replace(SVG.regex.comma, ' ')          // unify all spaces
	        .replace(SVG.regex.X, 'e-')             // add back the expoent
	        .trim()                                 // trim
	        .split(SVG.regex.whitespaces)           // split into array

	      // at this place there could be parts like ['3.124.854.32'] because we could not determine the point as seperator till now
	      // we fix this elements in the next loop
	      for(i = array.length; --i;){
	        if(array[i].indexOf('.') != array[i].lastIndexOf('.')){
	          var split = array[i].split('.') // split at the point
	          var first = [split.shift(), split.shift()].join('.') // join the first number together
	          array.splice.apply(array, [i, 1].concat(first, split.map(function(el){ return '.'+el }))) // add first and all other entries back to array
	        }
	      }

	    }else{
	      array = array.reduce(function(prev, curr){
	        return [].concat.apply(prev, curr)
	      }, [])
	    }

	    // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]

	    var arr = []

	    do{

	      // Test if we have a path letter
	      if(SVG.regex.isPathLetter.test(array[0])){
	        s = array[0]
	        array.shift()
	      // If last letter was a move command and we got no new, it defaults to [L]ine
	      }else if(s == 'M'){
	        s = 'L'
	      }else if(s == 'm'){
	        s = 'l'
	      }

	      // add path letter as first element
	      seg = [s.toUpperCase()]

	      // push all necessary parameters to segment
	      for(i = 0; i < paramCnt[seg[0]]; ++i){
	        seg.push(parseFloat(array.shift()))
	      }

	      // upper case
	      if(s == seg[0]){

	        if(s == 'M' || s == 'L' || s == 'C' || s == 'Q' || s == 'S' || s == 'T'){
	          x = seg[paramCnt[seg[0]]-1]
	          y = seg[paramCnt[seg[0]]]
	        }else if(s == 'V'){
	          y = seg[1]
	        }else if(s == 'H'){
	          x = seg[1]
	        }else if(s == 'A'){
	          x = seg[6]
	          y = seg[7]
	        }

	      // lower case
	      }else{

	        // convert relative to absolute values
	        if(s == 'm' || s == 'l' || s == 'c' || s == 's' || s == 'q' || s == 't'){

	          seg[1] += x
	          seg[2] += y

	          if(seg[3] != null){
	            seg[3] += x
	            seg[4] += y
	          }

	          if(seg[5] != null){
	            seg[5] += x
	            seg[6] += y
	          }

	          // move pointer
	          x = seg[paramCnt[seg[0]]-1]
	          y = seg[paramCnt[seg[0]]]

	        }else if(s == 'v'){
	          seg[1] += y
	          y = seg[1]
	        }else if(s == 'h'){
	          seg[1] += x
	          x = seg[1]
	        }else if(s == 'a'){
	          seg[6] += x
	          seg[7] += y
	          x = seg[6]
	          y = seg[7]
	        }

	      }

	      if(seg[0] == 'M'){
	        x0 = x
	        y0 = y
	      }

	      if(seg[0] == 'Z'){
	        x = x0
	        y = y0
	      }

	      arr.push(seg)

	    }while(array.length)

	    return arr

	  }
	  // Get bounding box of path
	, bbox: function() {
	    SVG.parser.path.setAttribute('d', this.toString())

	    return SVG.parser.path.getBBox()
	  }

	})
	// Module for unit convertions
	SVG.Number = SVG.invent({
	  // Initialize
	  create: function(value, unit) {
	    // initialize defaults
	    this.value = 0
	    this.unit  = unit || ''

	    // parse value
	    if (typeof value === 'number') {
	      // ensure a valid numeric value
	      this.value = isNaN(value) ? 0 : !isFinite(value) ? (value < 0 ? -3.4e+38 : +3.4e+38) : value

	    } else if (typeof value === 'string') {
	      unit = value.match(SVG.regex.numberAndUnit)

	      if (unit) {
	        // make value numeric
	        this.value = parseFloat(unit[1])

	        // normalize
	        if (unit[5] == '%')
	          this.value /= 100
	        else if (unit[5] == 's')
	          this.value *= 1000

	        // store unit
	        this.unit = unit[5]
	      }

	    } else {
	      if (value instanceof SVG.Number) {
	        this.value = value.valueOf()
	        this.unit  = value.unit
	      }
	    }

	  }
	  // Add methods
	, extend: {
	    // Stringalize
	    toString: function() {
	      return (
	        this.unit == '%' ?
	          ~~(this.value * 1e8) / 1e6:
	        this.unit == 's' ?
	          this.value / 1e3 :
	          this.value
	      ) + this.unit
	    }
	  , toJSON: function() {
	      return this.toString()
	    }
	  , // Convert to primitive
	    valueOf: function() {
	      return this.value
	    }
	    // Add number
	  , plus: function(number) {
	      return new SVG.Number(this + new SVG.Number(number), this.unit)
	    }
	    // Subtract number
	  , minus: function(number) {
	      return this.plus(-new SVG.Number(number))
	    }
	    // Multiply number
	  , times: function(number) {
	      return new SVG.Number(this * new SVG.Number(number), this.unit)
	    }
	    // Divide number
	  , divide: function(number) {
	      return new SVG.Number(this / new SVG.Number(number), this.unit)
	    }
	    // Convert to different unit
	  , to: function(unit) {
	      var number = new SVG.Number(this)

	      if (typeof unit === 'string')
	        number.unit = unit

	      return number
	    }
	    // Make number morphable
	  , morph: function(number) {
	      this.destination = new SVG.Number(number)

	      return this
	    }
	    // Get morphed number at given position
	  , at: function(pos) {
	      // Make sure a destination is defined
	      if (!this.destination) return this

	      // Generate new morphed number
	      return new SVG.Number(this.destination)
	          .minus(this)
	          .times(pos)
	          .plus(this)
	    }

	  }
	})

	SVG.Element = SVG.invent({
	  // Initialize node
	  create: function(node) {
	    // make stroke value accessible dynamically
	    this._stroke = SVG.defaults.attrs.stroke

	    // initialize data object
	    this.dom = {}

	    // create circular reference
	    if (this.node = node) {
	      this.type = node.nodeName
	      this.node.instance = this

	      // store current attribute value
	      this._stroke = node.getAttribute('stroke') || this._stroke
	    }
	  }

	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      return this.attr('x', x)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return this.attr('y', y)
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2)
	    }
	    // Move element to given x and y values
	  , move: function(x, y) {
	      return this.x(x).y(y)
	    }
	    // Move element by its center
	  , center: function(x, y) {
	      return this.cx(x).cy(y)
	    }
	    // Set width of element
	  , width: function(width) {
	      return this.attr('width', width)
	    }
	    // Set height of element
	  , height: function(height) {
	      return this.attr('height', height)
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)

	      return this
	        .width(new SVG.Number(p.width))
	        .height(new SVG.Number(p.height))
	    }
	    // Clone element
	  , clone: function(parent) {
	      // clone element and assign new id
	      var clone = assignNewId(this.node.cloneNode(true))

	      // insert the clone in the given parent or after myself
	      if(parent) parent.add(clone)
	      else this.after(clone)

	      return clone
	    }
	    // Remove element
	  , remove: function() {
	      if (this.parent())
	        this.parent().removeElement(this)

	      return this
	    }
	    // Replace element
	  , replace: function(element) {
	      this.after(element).remove()

	      return element
	    }
	    // Add element to given container and return self
	  , addTo: function(parent) {
	      return parent.put(this)
	    }
	    // Add element to given container and return container
	  , putIn: function(parent) {
	      return parent.add(this)
	    }
	    // Get / set id
	  , id: function(id) {
	      return this.attr('id', id)
	    }
	    // Checks whether the given point inside the bounding box of the element
	  , inside: function(x, y) {
	      var box = this.bbox()

	      return x > box.x
	          && y > box.y
	          && x < box.x + box.width
	          && y < box.y + box.height
	    }
	    // Show element
	  , show: function() {
	      return this.style('display', '')
	    }
	    // Hide element
	  , hide: function() {
	      return this.style('display', 'none')
	    }
	    // Is element visible?
	  , visible: function() {
	      return this.style('display') != 'none'
	    }
	    // Return id on string conversion
	  , toString: function() {
	      return this.attr('id')
	    }
	    // Return array of classes on the node
	  , classes: function() {
	      var attr = this.attr('class')

	      return attr == null ? [] : attr.trim().split(/\s+/)
	    }
	    // Return true if class exists on the node, false otherwise
	  , hasClass: function(name) {
	      return this.classes().indexOf(name) != -1
	    }
	    // Add class to the node
	  , addClass: function(name) {
	      if (!this.hasClass(name)) {
	        var array = this.classes()
	        array.push(name)
	        this.attr('class', array.join(' '))
	      }

	      return this
	    }
	    // Remove class from the node
	  , removeClass: function(name) {
	      if (this.hasClass(name)) {
	        this.attr('class', this.classes().filter(function(c) {
	          return c != name
	        }).join(' '))
	      }

	      return this
	    }
	    // Toggle the presence of a class on the node
	  , toggleClass: function(name) {
	      return this.hasClass(name) ? this.removeClass(name) : this.addClass(name)
	    }
	    // Get referenced element form attribute value
	  , reference: function(attr) {
	      return SVG.get(this.attr(attr))
	    }
	    // Returns the parent element instance
	  , parent: function(type) {
	      var parent = this

	      // check for parent
	      if(!parent.node.parentNode) return null

	      // get parent element
	      parent = SVG.adopt(parent.node.parentNode)

	      if(!type) return parent

	      // loop trough ancestors if type is given
	      while(parent && parent.node instanceof SVGElement){
	        if(typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent
	        parent = SVG.adopt(parent.node.parentNode)
	      }
	    }
	    // Get parent document
	  , doc: function() {
	      return this instanceof SVG.Doc ? this : this.parent(SVG.Doc)
	    }
	    // return array of all ancestors of given type up to the root svg
	  , parents: function(type) {
	      var parents = [], parent = this

	      do{
	        parent = parent.parent(type)
	        if(!parent || !parent.node) break

	        parents.push(parent)
	      } while(parent.parent)

	      return parents
	    }
	    // matches the element vs a css selector
	  , matches: function(selector){
	      return matches(this.node, selector)
	    }
	    // Returns the svg node to call native svg methods on it
	  , native: function() {
	      return this.node
	    }
	    // Import raw svg
	  , svg: function(svg) {
	      // create temporary holder
	      var well = document.createElement('svg')

	      // act as a setter if svg is given
	      if (svg && this instanceof SVG.Parent) {
	        // dump raw svg
	        well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<(\w+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>'

	        // transplant nodes
	        for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++)
	          this.node.appendChild(well.firstChild.firstChild)

	      // otherwise act as a getter
	      } else {
	        // create a wrapping svg element in case of partial content
	        well.appendChild(svg = document.createElement('svg'))

	        // write svgjs data to the dom
	        this.writeDataToDom()

	        // insert a copy of this node
	        svg.appendChild(this.node.cloneNode(true))

	        // return target element
	        return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '')
	      }

	      return this
	    }
	  // write svgjs data to the dom
	  , writeDataToDom: function() {

	      // dump variables recursively
	      if(this.each || this.lines){
	        var fn = this.each ? this : this.lines();
	        fn.each(function(){
	          this.writeDataToDom()
	        })
	      }

	      // remove previously set data
	      this.node.removeAttribute('svgjs:data')

	      if(Object.keys(this.dom).length)
	        this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)) // see #428

	      return this
	    }
	  // set given data to the elements data property
	  , setData: function(o){
	      this.dom = o
	      return this
	    }
	  , is: function(obj){
	      return is(this, obj)
	    }
	  }
	})

	SVG.easing = {
	  '-': function(pos){return pos}
	, '<>':function(pos){return -Math.cos(pos * Math.PI) / 2 + 0.5}
	, '>': function(pos){return  Math.sin(pos * Math.PI / 2)}
	, '<': function(pos){return -Math.cos(pos * Math.PI / 2) + 1}
	}

	SVG.morph = function(pos){
	  return function(from, to) {
	    return new SVG.MorphObj(from, to).at(pos)
	  }
	}

	SVG.Situation = SVG.invent({

	  create: function(o){
	    this.init = false
	    this.reversed = false
	    this.reversing = false

	    this.duration = new SVG.Number(o.duration).valueOf()
	    this.delay = new SVG.Number(o.delay).valueOf()

	    this.start = +new Date() + this.delay
	    this.finish = this.start + this.duration
	    this.ease = o.ease

	    this.loop = false
	    this.loops = false

	    this.animations = {
	      // functionToCall: [list of morphable objects]
	      // e.g. move: [SVG.Number, SVG.Number]
	    }

	    this.attrs = {
	      // holds all attributes which are not represented from a function svg.js provides
	      // e.g. someAttr: SVG.Number
	    }

	    this.styles = {
	      // holds all styles which should be animated
	      // e.g. fill-color: SVG.Color
	    }

	    this.transforms = [
	      // holds all transformations as transformation objects
	      // e.g. [SVG.Rotate, SVG.Translate, SVG.Matrix]
	    ]

	    this.once = {
	      // functions to fire at a specific position
	      // e.g. "0.5": function foo(){}
	    }

	  }

	})

	SVG.Delay = function(delay){
	  this.delay = new SVG.Number(delay).valueOf()
	}

	SVG.FX = SVG.invent({

	  create: function(element) {
	    this._target = element
	    this.situations = []
	    this.active = false
	    this.situation = null
	    this.paused = false
	    this.lastPos = 0
	    this.pos = 0
	    this._speed = 1
	  }

	, extend: {

	    /**
	     * sets or returns the target of this animation
	     * @param o object || number In case of Object it holds all parameters. In case of number its the duration of the animation
	     * @param ease function || string Function which should be used for easing or easing keyword
	     * @param delay Number indicating the delay before the animation starts
	     * @return target || this
	     */
	    animate: function(o, ease, delay){

	      if(typeof o == 'object'){
	        ease = o.ease
	        delay = o.delay
	        o = o.duration
	      }

	      var situation = new SVG.Situation({
	        duration: o || 1000,
	        delay: delay || 0,
	        ease: SVG.easing[ease || '-'] || ease
	      })

	      this.queue(situation)

	      return this
	    }

	    /**
	     * sets a delay before the next element of the queue is called
	     * @param delay Duration of delay in milliseconds
	     * @return this.target()
	     */
	  , delay: function(delay){
	      var delay = new SVG.Delay(delay)

	      return this.queue(delay)
	    }

	    /**
	     * sets or returns the target of this animation
	     * @param null || target SVG.Element which should be set as new target
	     * @return target || this
	     */
	  , target: function(target){
	      if(target && target instanceof SVG.Element){
	        this._target = target
	        return this
	      }

	      return this._target
	    }

	    // returns the position at a given time
	  , timeToPos: function(timestamp){
	      return (timestamp - this.situation.start) / (this.situation.duration/this._speed)
	    }

	    // returns the timestamp from a given positon
	  , posToTime: function(pos){
	      return this.situation.duration/this._speed * pos + this.situation.start
	    }

	    // starts the animationloop
	  , startAnimFrame: function(){
	      this.stopAnimFrame()
	      this.animationFrame = requestAnimationFrame(function(){ this.step() }.bind(this))
	    }

	    // cancels the animationframe
	  , stopAnimFrame: function(){
	      cancelAnimationFrame(this.animationFrame)
	    }

	    // kicks off the animation - only does something when the queue is curretly not active and at least one situation is set
	  , start: function(){
	      // dont start if already started
	      if(!this.active && this.situation){
	        this.situation.start = +new Date + this.situation.delay
	        this.situation.finish = this.situation.start + this.situation.duration/this._speed

	        this.initAnimations()
	        this.active = true
	        this.startAnimFrame()
	      }

	      return this
	    }

	    /**
	     * adds a function / Situation to the animation queue
	     * @param fn function / situation to add
	     * @return this
	     */
	  , queue: function(fn){
	      if(typeof fn == 'function' || fn instanceof SVG.Situation || fn instanceof SVG.Delay)
	        this.situations.push(fn)

	      if(!this.situation) this.situation = this.situations.shift()

	      return this
	    }

	    /**
	     * pulls next element from the queue and execute it
	     * @return this
	     */
	  , dequeue: function(){
	      // stop current animation
	      this.situation && this.situation.stop && this.situation.stop()

	      // get next animation from queue
	      this.situation = this.situations.shift()

	      if(this.situation){

	        var fn = function(){
	          if(this.situation instanceof SVG.Situation)
	            this.initAnimations().at(0)
	          else if(this.situation instanceof SVG.Delay)
	            this.dequeue()
	          else
	            this.situation.call(this)
	        }.bind(this)

	        // start next animation
	        if(this.situation.delay){
	          setTimeout(function(){fn()}, this.situation.delay)
	        }else{
	          fn()
	        }

	      }

	      return this
	    }

	    // updates all animations to the current state of the element
	    // this is important when one property could be changed from another property
	  , initAnimations: function() {
	      var i
	      var s = this.situation

	      if(s.init) return this

	      for(i in s.animations){

	        if(i == 'viewbox'){
	          s.animations[i] = this.target().viewbox().morph(s.animations[i])
	        }else{

	          // TODO: this is not a clean clone of the array. We may have some unchecked references
	          s.animations[i].value = (i == 'plot' ? this.target().array().value : this.target()[i]())

	          // sometimes we get back an object and not the real value, fix this
	          if(s.animations[i].value.value){
	            s.animations[i].value = s.animations[i].value.value
	          }

	          if(s.animations[i].relative)
	            s.animations[i].destination.value = s.animations[i].destination.value + s.animations[i].value

	        }

	      }

	      for(i in s.attrs){
	        if(s.attrs[i] instanceof SVG.Color){
	          var color = new SVG.Color(this.target().attr(i))
	          s.attrs[i].r = color.r
	          s.attrs[i].g = color.g
	          s.attrs[i].b = color.b
	        }else{
	          s.attrs[i].value = this.target().attr(i)// + s.attrs[i].value
	        }
	      }

	      for(i in s.styles){
	        s.styles[i].value = this.target().style(i)
	      }

	      s.initialTransformation = this.target().matrixify()

	      s.init = true
	      return this
	    }
	  , clearQueue: function(){
	      this.situations = []
	      return this
	    }
	  , clearCurrent: function(){
	      this.situation = null
	      return this
	    }
	    /** stops the animation immediately
	     * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately.
	     * @param clearQueue A Boolean indicating whether to remove queued animation as well.
	     * @return this
	     */
	  , stop: function(jumpToEnd, clearQueue){
	      if(!this.active) this.start()

	      if(clearQueue){
	        this.clearQueue()
	      }

	      this.active = false

	      if(jumpToEnd && this.situation){

	        this.situation.loop = false

	        if(this.situation.loops % 2 == 0 && this.situation.reversing){
	          this.situation.reversed = true
	        }

	        this.at(1)

	      }

	      this.stopAnimFrame()
	      clearTimeout(this.timeout)

	      return this.clearCurrent()
	    }

	    /** resets the element to the state where the current element has started
	     * @return this
	     */
	  , reset: function(){
	      if(this.situation){
	        var temp = this.situation
	        this.stop()
	        this.situation = temp
	        this.at(0)
	      }
	      return this
	    }

	    // Stop the currently-running animation, remove all queued animations, and complete all animations for the element.
	  , finish: function(){

	      this.stop(true, false)

	      while(this.dequeue().situation && this.stop(true, false));

	      this.clearQueue().clearCurrent()

	      return this
	    }

	    // set the internal animation pointer to the specified position and updates the visualisation
	  , at: function(pos){
	      var durDivSpd = this.situation.duration/this._speed

	      this.pos = pos
	      this.situation.start = +new Date - pos * durDivSpd
	      this.situation.finish = this.situation.start + durDivSpd
	      return this.step(true)
	    }

	    /**
	     * sets or returns the speed of the animations
	     * @param speed null || Number The new speed of the animations
	     * @return Number || this
	     */
	  , speed: function(speed){
	      if (speed === 0) return this.pause()

	      if (speed) {
	        this._speed = speed
	        return this.at(this.situation.reversed ? 1-this.pos : this.pos)
	      } else return this._speed
	    }

	    // Make loopable
	  , loop: function(times, reverse) {
	      var c = this.last()

	      // store current loop and total loops
	      c.loop = c.loops = times || true

	      if(reverse) c.reversing = true
	      return this
	    }

	    // pauses the animation
	  , pause: function(){
	      this.paused = true
	      this.stopAnimFrame()
	      clearTimeout(this.timeout)
	      return this
	    }

	    // unpause the animation
	  , play: function(){
	      if(!this.paused) return this
	      this.paused = false
	      return this.at(this.pos)
	    }

	    /**
	     * toggle or set the direction of the animation
	     * true sets direction to backwards while false sets it to forwards
	     * @param reversed Boolean indicating whether to reverse the animation or not (default: toggle the reverse status)
	     * @return this
	     */
	  , reverse: function(reversed){
	      var c = this.last()

	      if(typeof reversed == 'undefined') c.reversed = !c.reversed
	      else c.reversed = reversed

	      return this
	    }


	    /**
	     * returns a float from 0-1 indicating the progress of the current animation
	     * @param eased Boolean indicating whether the returned position should be eased or not
	     * @return number
	     */
	  , progress: function(easeIt){
	      return easeIt ? this.situation.ease(this.pos) : this.pos
	    }

	    /**
	     * adds a callback function which is called when the current animation is finished
	     * @param fn Function which should be executed as callback
	     * @return number
	     */
	  , after: function(fn){
	      var c = this.last()
	        , wrapper = function wrapper(e){
	            if(e.detail.situation == c){
	              fn.call(this, c)
	              this.off('finished.fx', wrapper) // prevent memory leak
	            }
	          }

	      this.target().on('finished.fx', wrapper)
	      return this
	    }

	    // adds a callback which is called whenever one animation step is performed
	  , during: function(fn){
	      var c = this.last()
	        , wrapper = function(e){
	            if(e.detail.situation == c){
	              fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, c)
	            }
	          }

	      // see above
	      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

	      return this.after(function(){
	        this.off('during.fx', wrapper)
	      })
	    }

	    // calls after ALL animations in the queue are finished
	  , afterAll: function(fn){
	      var wrapper = function wrapper(e){
	            fn.call(this)
	            this.off('allfinished.fx', wrapper)
	          }

	      // see above
	      this.target().off('allfinished.fx', wrapper).on('allfinished.fx', wrapper)
	      return this
	    }

	    // calls on every animation step for all animations
	  , duringAll: function(fn){
	      var wrapper = function(e){
	            fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, e.detail.situation)
	          }

	      this.target().off('during.fx', wrapper).on('during.fx', wrapper)

	      return this.afterAll(function(){
	        this.off('during.fx', wrapper)
	      })
	    }

	  , last: function(){
	      return this.situations.length ? this.situations[this.situations.length-1] : this.situation
	    }

	    // adds one property to the animations
	  , add: function(method, args, type){
	      this.last()[type || 'animations'][method] = args
	      setTimeout(function(){this.start()}.bind(this), 0)
	      return this
	    }

	    /** perform one step of the animation
	     *  @param ignoreTime Boolean indicating whether to ignore time and use position directly or recalculate position based on time
	     *  @return this
	     */
	  , step: function(ignoreTime){

	      // convert current time to position
	      if(!ignoreTime) this.pos = this.timeToPos(+new Date)

	      if(this.pos >= 1 && (this.situation.loop === true || (typeof this.situation.loop == 'number' && --this.situation.loop))){

	        if(this.situation.reversing){
	          this.situation.reversed = !this.situation.reversed
	        }
	        return this.at(this.pos-1)
	      }

	      if(this.situation.reversed) this.pos = 1 - this.pos

	      // correct position
	      if(this.pos > 1)this.pos = 1
	      if(this.pos < 0)this.pos = 0

	      // apply easing
	      var eased = this.situation.ease(this.pos)

	      // call once-callbacks
	      for(var i in this.situation.once){
	        if(i > this.lastPos && i <= eased){
	          this.situation.once[i].call(this.target(), this.pos, eased)
	          delete this.situation.once[i]
	        }
	      }

	      // fire during callback with position, eased position and current situation as parameter
	      if(this.active) this.target().fire('during', {pos: this.pos, eased: eased, fx: this, situation: this.situation})

	      // the user may call stop or finish in the during callback
	      // so make sure that we still have a valid situation
	      if(!this.situation){
	        return this
	      }

	      // apply the actual animation to every property
	      this.eachAt()

	      // do final code when situation is finished
	      if((this.pos == 1 && !this.situation.reversed) || (this.situation.reversed && this.pos == 0)){

	        // stop animation callback
	        this.stopAnimFrame()

	        // fire finished callback with current situation as parameter
	        this.target().fire('finished', {fx:this, situation: this.situation})

	        if(!this.situations.length){
	          this.target().fire('allfinished')
	          this.target().off('.fx') // there shouldnt be any binding left, but to make sure...
	          this.active = false
	        }

	        // start next animation
	        if(this.active) this.dequeue()
	        else this.clearCurrent()

	      }else if(!this.paused && this.active){
	        // we continue animating when we are not at the end
	        this.startAnimFrame()
	      }

	      // save last eased position for once callback triggering
	      this.lastPos = eased
	      return this

	    }

	    // calculates the step for every property and calls block with it
	  , eachAt: function(){
	      var i, at, self = this, target = this.target(), s = this.situation

	      // apply animations which can be called trough a method
	      for(i in s.animations){

	        at = [].concat(s.animations[i]).map(function(el){
	          return el.at ? el.at(s.ease(self.pos), self.pos) : el
	        })

	        target[i].apply(target, at)

	      }

	      // apply animation which has to be applied with attr()
	      for(i in s.attrs){

	        at = [i].concat(s.attrs[i]).map(function(el){
	          return el.at ? el.at(s.ease(self.pos), self.pos) : el
	        })

	        target.attr.apply(target, at)

	      }

	      // apply animation which has to be applied with style()
	      for(i in s.styles){

	        at = [i].concat(s.styles[i]).map(function(el){
	          return el.at ? el.at(s.ease(self.pos), self.pos) : el
	        })

	        target.style.apply(target, at)

	      }

	      // animate initialTransformation which has to be chained
	      if(s.transforms.length){

	        // get inital initialTransformation
	        at = s.initialTransformation
	        for(i in s.transforms){

	          // get next transformation in chain
	          var a = s.transforms[i]

	          // multiply matrix directly
	          if(a instanceof SVG.Matrix){

	            if(a.relative){
	              at = at.multiply(a.at(s.ease(this.pos)))
	            }else{
	              at = at.morph(a).at(s.ease(this.pos))
	            }
	            continue
	          }

	          // when transformation is absolute we have to reset the needed transformation first
	          if(!a.relative)
	            a.undo(at.extract())

	          // and reapply it after
	          at = at.multiply(a.at(s.ease(this.pos)))

	        }

	        // set new matrix on element
	        target.matrix(at)
	      }

	      return this

	    }


	    // adds an once-callback which is called at a specific position and never again
	  , once: function(pos, fn, isEased){

	      if(!isEased)pos = this.situation.ease(pos)

	      this.situation.once[pos] = fn

	      return this
	    }

	  }

	, parent: SVG.Element

	  // Add method to parent elements
	, construct: {
	    // Get fx module or create a new one, then animate with given duration and ease
	    animate: function(o, ease, delay) {
	      return (this.fx || (this.fx = new SVG.FX(this))).animate(o, ease, delay)
	    }
	  , delay: function(delay){
	      return (this.fx || (this.fx = new SVG.FX(this))).delay(delay)
	    }
	  , stop: function(jumpToEnd, clearQueue) {
	      if (this.fx)
	        this.fx.stop(jumpToEnd, clearQueue)

	      return this
	    }
	  , finish: function() {
	      if (this.fx)
	        this.fx.finish()

	      return this
	    }
	    // Pause current animation
	  , pause: function() {
	      if (this.fx)
	        this.fx.pause()

	      return this
	    }
	    // Play paused current animation
	  , play: function() {
	      if (this.fx)
	        this.fx.play()

	      return this
	    }
	    // Set/Get the speed of the animations
	  , speed: function(speed) {
	      if (this.fx)
	        if (speed == null)
	          return this.fx.speed()
	        else
	          this.fx.speed(speed)

	      return this
	    }
	  }

	})

	// MorphObj is used whenever no morphable object is given
	SVG.MorphObj = SVG.invent({

	  create: function(from, to){
	    // prepare color for morphing
	    if(SVG.Color.isColor(to)) return new SVG.Color(from).morph(to)
	    // prepare number for morphing
	    if(SVG.regex.numberAndUnit.test(to)) return new SVG.Number(from).morph(to)

	    // prepare for plain morphing
	    this.value = 0
	    this.destination = to
	  }

	, extend: {
	    at: function(pos, real){
	      return real < 1 ? this.value : this.destination
	    },

	    valueOf: function(){
	      return this.value
	    }
	  }

	})

	SVG.extend(SVG.FX, {
	  // Add animatable attributes
	  attr: function(a, v, relative) {
	    // apply attributes individually
	    if (typeof a == 'object') {
	      for (var key in a)
	        this.attr(key, a[key])

	    } else {
	      // the MorphObj takes care about the right function used
	      this.add(a, new SVG.MorphObj(null, v), 'attrs')
	    }

	    return this
	  }
	  // Add animatable styles
	, style: function(s, v) {
	    if (typeof s == 'object')
	      for (var key in s)
	        this.style(key, s[key])

	    else
	      this.add(s, new SVG.MorphObj(null, v), 'styles')

	    return this
	  }
	  // Animatable x-axis
	, x: function(x, relative) {
	    if(this.target() instanceof SVG.G){
	      this.transform({x:x}, relative)
	      return this
	    }

	    var num = new SVG.Number().morph(x)
	    num.relative = relative
	    return this.add('x', num)
	  }
	  // Animatable y-axis
	, y: function(y, relative) {
	    if(this.target() instanceof SVG.G){
	      this.transform({y:y}, relative)
	      return this
	    }

	    var num = new SVG.Number().morph(y)
	    num.relative = relative
	    return this.add('y', num)
	  }
	  // Animatable center x-axis
	, cx: function(x) {
	    return this.add('cx', new SVG.Number().morph(x))
	  }
	  // Animatable center y-axis
	, cy: function(y) {
	    return this.add('cy', new SVG.Number().morph(y))
	  }
	  // Add animatable move
	, move: function(x, y) {
	    return this.x(x).y(y)
	  }
	  // Add animatable center
	, center: function(x, y) {
	    return this.cx(x).cy(y)
	  }
	  // Add animatable size
	, size: function(width, height) {
	    if (this.target() instanceof SVG.Text) {
	      // animate font size for Text elements
	      this.attr('font-size', width)

	    } else {
	      // animate bbox based size for all other elements
	      var box

	      if(!width || !height){
	        box = this.target().bbox()
	      }

	      if(!width){
	        width = box.width / box.height  * height
	      }

	      if(!height){
	        height = box.height / box.width  * width
	      }

	      this.add('width' , new SVG.Number().morph(width))
	          .add('height', new SVG.Number().morph(height))

	    }

	    return this
	  }
	  // Add animatable plot
	, plot: function(p) {
	    return this.add('plot', this.target().array().morph(p))
	  }
	  // Add leading method
	, leading: function(value) {
	    return this.target().leading ?
	      this.add('leading', new SVG.Number().morph(value)) :
	      this
	  }
	  // Add animatable viewbox
	, viewbox: function(x, y, width, height) {
	    if (this.target() instanceof SVG.Container) {
	      this.add('viewbox', new SVG.ViewBox(x, y, width, height))
	    }

	    return this
	  }
	, update: function(o) {
	    if (this.target() instanceof SVG.Stop) {
	      if (typeof o == 'number' || o instanceof SVG.Number) {
	        return this.update({
	          offset:  arguments[0]
	        , color:   arguments[1]
	        , opacity: arguments[2]
	        })
	      }

	      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
	      if (o.color   != null) this.attr('stop-color', o.color)
	      if (o.offset  != null) this.attr('offset', o.offset)
	    }

	    return this
	  }
	})

	SVG.BBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    // get values if element is given
	    if (element) {
	      var box

	      // yes this is ugly, but Firefox can be a bitch when it comes to elements that are not yet rendered
	      try {

	        // the element is NOT in the dom, throw error
	        if(!document.documentElement.contains(element.node)) throw new Exception('Element not in the dom')

	        // find native bbox
	        box = element.node.getBBox()
	      } catch(e) {
	        if(element instanceof SVG.Shape){
	          var clone = element.clone(SVG.parser.draw).show()
	          box = clone.bbox()
	          clone.remove()
	        }else{
	          box = {
	            x:      element.node.clientLeft
	          , y:      element.node.clientTop
	          , width:  element.node.clientWidth
	          , height: element.node.clientHeight
	          }
	        }
	      }

	      // plain x and y
	      this.x = box.x
	      this.y = box.y

	      // plain width and height
	      this.width  = box.width
	      this.height = box.height
	    }

	    // add center, right and bottom
	    fullBox(this)
	  }

	  // Define Parent
	, parent: SVG.Element

	  // Constructor
	, construct: {
	    // Get bounding box
	    bbox: function() {
	      return new SVG.BBox(this)
	    }
	  }

	})

	SVG.TBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    // get values if element is given
	    if (element) {
	      var t   = element.ctm().extract()
	        , box = element.bbox()

	      // width and height including transformations
	      this.width  = box.width  * t.scaleX
	      this.height = box.height * t.scaleY

	      // x and y including transformations
	      this.x = box.x + t.x
	      this.y = box.y + t.y
	    }

	    // add center, right and bottom
	    fullBox(this)
	  }

	  // Define Parent
	, parent: SVG.Element

	  // Constructor
	, construct: {
	    // Get transformed bounding box
	    tbox: function() {
	      return new SVG.TBox(this)
	    }
	  }

	})


	SVG.RBox = SVG.invent({
	  // Initialize
	  create: function(element) {
	    if (element) {
	      var e    = element.doc().parent()
	        , box  = element.node.getBoundingClientRect()
	        , zoom = 1

	      // get screen offset
	      this.x = box.left
	      this.y = box.top

	      // subtract parent offset
	      this.x -= e.offsetLeft
	      this.y -= e.offsetTop

	      while (e = e.offsetParent) {
	        this.x -= e.offsetLeft
	        this.y -= e.offsetTop
	      }

	      // calculate cumulative zoom from svg documents
	      e = element
	      while (e.parent && (e = e.parent())) {
	        if (e.viewbox) {
	          zoom *= e.viewbox().zoom
	          this.x -= e.x() || 0
	          this.y -= e.y() || 0
	        }
	      }

	      // recalculate viewbox distortion
	      this.width  = box.width  /= zoom
	      this.height = box.height /= zoom
	    }

	    // add center, right and bottom
	    fullBox(this)

	    // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
	    this.x += window.pageXOffset
	    this.y += window.pageYOffset
	  }

	  // define Parent
	, parent: SVG.Element

	  // Constructor
	, construct: {
	    // Get rect box
	    rbox: function() {
	      return new SVG.RBox(this)
	    }
	  }

	})

	// Add universal merge method
	;[SVG.BBox, SVG.TBox, SVG.RBox].forEach(function(c) {

	  SVG.extend(c, {
	    // Merge rect box with another, return a new instance
	    merge: function(box) {
	      var b = new c()

	      // merge boxes
	      b.x      = Math.min(this.x, box.x)
	      b.y      = Math.min(this.y, box.y)
	      b.width  = Math.max(this.x + this.width,  box.x + box.width)  - b.x
	      b.height = Math.max(this.y + this.height, box.y + box.height) - b.y

	      return fullBox(b)
	    }

	  })

	})

	SVG.Matrix = SVG.invent({
	  // Initialize
	  create: function(source) {
	    var i, base = arrayToMatrix([1, 0, 0, 1, 0, 0])

	    // ensure source as object
	    source = source instanceof SVG.Element ?
	      source.matrixify() :
	    typeof source === 'string' ?
	      stringToMatrix(source) :
	    arguments.length == 6 ?
	      arrayToMatrix([].slice.call(arguments)) :
	    typeof source === 'object' ?
	      source : base

	    // merge source
	    for (i = abcdef.length - 1; i >= 0; --i)
	      this[abcdef[i]] = source && typeof source[abcdef[i]] === 'number' ?
	        source[abcdef[i]] : base[abcdef[i]]
	  }

	  // Add methods
	, extend: {
	    // Extract individual transformations
	    extract: function() {
	      // find delta transform points
	      var px    = deltaTransformPoint(this, 0, 1)
	        , py    = deltaTransformPoint(this, 1, 0)
	        , skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90

	      return {
	        // translation
	        x:        this.e
	      , y:        this.f
	      , transformedX:(this.e * Math.cos(skewX * Math.PI / 180) + this.f * Math.sin(skewX * Math.PI / 180)) / Math.sqrt(this.a * this.a + this.b * this.b)
	      , transformedY:(this.f * Math.cos(skewX * Math.PI / 180) + this.e * Math.sin(-skewX * Math.PI / 180)) / Math.sqrt(this.c * this.c + this.d * this.d)
	        // skew
	      , skewX:    -skewX
	      , skewY:    180 / Math.PI * Math.atan2(py.y, py.x)
	        // scale
	      , scaleX:   Math.sqrt(this.a * this.a + this.b * this.b)
	      , scaleY:   Math.sqrt(this.c * this.c + this.d * this.d)
	        // rotation
	      , rotation: skewX
	      , a: this.a
	      , b: this.b
	      , c: this.c
	      , d: this.d
	      , e: this.e
	      , f: this.f
	      , matrix: new SVG.Matrix(this)
	      }
	    }
	    // Clone matrix
	  , clone: function() {
	      return new SVG.Matrix(this)
	    }
	    // Morph one matrix into another
	  , morph: function(matrix) {
	      // store new destination
	      this.destination = new SVG.Matrix(matrix)

	      return this
	    }
	    // Get morphed matrix at a given position
	  , at: function(pos) {
	      // make sure a destination is defined
	      if (!this.destination) return this

	      // calculate morphed matrix at a given position
	      var matrix = new SVG.Matrix({
	        a: this.a + (this.destination.a - this.a) * pos
	      , b: this.b + (this.destination.b - this.b) * pos
	      , c: this.c + (this.destination.c - this.c) * pos
	      , d: this.d + (this.destination.d - this.d) * pos
	      , e: this.e + (this.destination.e - this.e) * pos
	      , f: this.f + (this.destination.f - this.f) * pos
	      })

	      // process parametric rotation if present
	      if (this.param && this.param.to) {
	        // calculate current parametric position
	        var param = {
	          rotation: this.param.from.rotation + (this.param.to.rotation - this.param.from.rotation) * pos
	        , cx:       this.param.from.cx
	        , cy:       this.param.from.cy
	        }

	        // rotate matrix
	        matrix = matrix.rotate(
	          (this.param.to.rotation - this.param.from.rotation * 2) * pos
	        , param.cx
	        , param.cy
	        )

	        // store current parametric values
	        matrix.param = param
	      }

	      return matrix
	    }
	    // Multiplies by given matrix
	  , multiply: function(matrix) {
	      return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()))
	    }
	    // Inverses matrix
	  , inverse: function() {
	      return new SVG.Matrix(this.native().inverse())
	    }
	    // Translate matrix
	  , translate: function(x, y) {
	      return new SVG.Matrix(this.native().translate(x || 0, y || 0))
	    }
	    // Scale matrix
	  , scale: function(x, y, cx, cy) {
	      // support universal scale
	      if (arguments.length == 1 || arguments.length == 3)
	        y = x
	      if (arguments.length == 3) {
	        cy = cx
	        cx = y
	      }

	      return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0))
	    }
	    // Rotate matrix
	  , rotate: function(r, cx, cy) {
	      // convert degrees to radians
	      r = SVG.utils.radians(r)

	      return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0))
	    }
	    // Flip matrix on x or y, at a given offset
	  , flip: function(a, o) {
	      return a == 'x' ? this.scale(-1, 1, o, 0) : this.scale(1, -1, 0, o)
	    }
	    // Skew
	  , skew: function(x, y, cx, cy) {
	      return this.around(cx, cy, this.native().skewX(x || 0).skewY(y || 0))
	    }
	    // SkewX
	  , skewX: function(x, cx, cy) {
	      return this.around(cx, cy, this.native().skewX(x || 0))
	    }
	    // SkewY
	  , skewY: function(y, cx, cy) {
	      return this.around(cx, cy, this.native().skewY(y || 0))
	    }
	    // Transform around a center point
	  , around: function(cx, cy, matrix) {
	      return this
	        .multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0))
	        .multiply(matrix)
	        .multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0))
	    }
	    // Convert to native SVGMatrix
	  , native: function() {
	      // create new matrix
	      var matrix = SVG.parser.native.createSVGMatrix()

	      // update with current values
	      for (var i = abcdef.length - 1; i >= 0; i--)
	        matrix[abcdef[i]] = this[abcdef[i]]

	      return matrix
	    }
	    // Convert matrix to string
	  , toString: function() {
	      return 'matrix(' + this.a + ',' + this.b + ',' + this.c + ',' + this.d + ',' + this.e + ',' + this.f + ')'
	    }
	  }

	  // Define parent
	, parent: SVG.Element

	  // Add parent method
	, construct: {
	    // Get current matrix
	    ctm: function() {
	      return new SVG.Matrix(this.node.getCTM())
	    },
	    // Get current screen matrix
	    screenCTM: function() {
	      return new SVG.Matrix(this.node.getScreenCTM())
	    }

	  }

	})

	SVG.Point = SVG.invent({
	  // Initialize
	  create: function(x,y) {
	    var i, source, base = {x:0, y:0}

	    // ensure source as object
	    source = Array.isArray(x) ?
	      {x:x[0], y:x[1]} :
	    typeof x === 'object' ?
	      {x:x.x, y:x.y} :
	    y != null ?
	      {x:x, y:y} : base

	    // merge source
	    this.x = source.x
	    this.y = source.y
	  }

	  // Add methods
	, extend: {
	    // Clone point
	    clone: function() {
	      return new SVG.Point(this)
	    }
	    // Morph one point into another
	  , morph: function(point) {
	      // store new destination
	      this.destination = new SVG.Point(point)

	      return this
	    }
	    // Get morphed point at a given position
	  , at: function(pos) {
	      // make sure a destination is defined
	      if (!this.destination) return this

	      // calculate morphed matrix at a given position
	      var point = new SVG.Point({
	        x: this.x + (this.destination.x - this.x) * pos
	      , y: this.y + (this.destination.y - this.y) * pos
	      })

	      return point
	    }
	    // Convert to native SVGPoint
	  , native: function() {
	      // create new point
	      var point = SVG.parser.native.createSVGPoint()

	      // update with current values
	      point.x = this.x
	      point.y = this.y

	      return point
	    }
	    // transform point with matrix
	  , transform: function(matrix) {
	      return new SVG.Point(this.native().matrixTransform(matrix.native()))
	    }

	  }

	})

	SVG.extend(SVG.Element, {

	  // Get point
	  point: function(x, y) {
	    return new SVG.Point(x,y).transform(this.screenCTM().inverse());
	  }

	})

	SVG.extend(SVG.Element, {
	  // Set svg element attribute
	  attr: function(a, v, n) {
	    // act as full getter
	    if (a == null) {
	      // get an object of attributes
	      a = {}
	      v = this.node.attributes
	      for (n = v.length - 1; n >= 0; n--)
	        a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue

	      return a

	    } else if (typeof a == 'object') {
	      // apply every attribute individually if an object is passed
	      for (v in a) this.attr(v, a[v])

	    } else if (v === null) {
	        // remove value
	        this.node.removeAttribute(a)

	    } else if (v == null) {
	      // act as a getter if the first and only argument is not an object
	      v = this.node.getAttribute(a)
	      return v == null ?
	        SVG.defaults.attrs[a] :
	      SVG.regex.isNumber.test(v) ?
	        parseFloat(v) : v

	    } else {
	      // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
	      if (a == 'stroke-width')
	        this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null)
	      else if (a == 'stroke')
	        this._stroke = v

	      // convert image fill and stroke to patterns
	      if (a == 'fill' || a == 'stroke') {
	        if (SVG.regex.isImage.test(v))
	          v = this.doc().defs().image(v, 0, 0)

	        if (v instanceof SVG.Image)
	          v = this.doc().defs().pattern(0, 0, function() {
	            this.add(v)
	          })
	      }

	      // ensure correct numeric values (also accepts NaN and Infinity)
	      if (typeof v === 'number')
	        v = new SVG.Number(v)

	      // ensure full hex color
	      else if (SVG.Color.isColor(v))
	        v = new SVG.Color(v)

	      // parse array values
	      else if (Array.isArray(v))
	        v = new SVG.Array(v)

	      // store parametric transformation values locally
	      else if (v instanceof SVG.Matrix && v.param)
	        this.param = v.param

	      // if the passed attribute is leading...
	      if (a == 'leading') {
	        // ... call the leading method instead
	        if (this.leading)
	          this.leading(v)
	      } else {
	        // set given attribute on node
	        typeof n === 'string' ?
	          this.node.setAttributeNS(n, a, v.toString()) :
	          this.node.setAttribute(a, v.toString())
	      }

	      // rebuild if required
	      if (this.rebuild && (a == 'font-size' || a == 'x'))
	        this.rebuild(a, v)
	    }

	    return this
	  }
	})
	SVG.extend(SVG.Element, {
	  // Add transformations
	  transform: function(o, relative) {
	    // get target in case of the fx module, otherwise reference this
	    var target = this
	      , matrix

	    // act as a getter
	    if (typeof o !== 'object') {
	      // get current matrix
	      matrix = new SVG.Matrix(target).extract()

	      return typeof o === 'string' ? matrix[o] : matrix
	    }

	    // get current matrix
	    matrix = new SVG.Matrix(target)

	    // ensure relative flag
	    relative = !!relative || !!o.relative

	    // act on matrix
	    if (o.a != null) {
	      matrix = relative ?
	        // relative
	        matrix.multiply(new SVG.Matrix(o)) :
	        // absolute
	        new SVG.Matrix(o)

	    // act on rotation
	    } else if (o.rotation != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // apply transformation
	      matrix = relative ?
	        // relative
	        matrix.rotate(o.rotation, o.cx, o.cy) :
	        // absolute
	        matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy)

	    // act on scale
	    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // ensure scale values on both axes
	      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
	      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

	      if (!relative) {
	        // absolute; multiply inversed values
	        var e = matrix.extract()
	        o.scaleX = o.scaleX * 1 / e.scaleX
	        o.scaleY = o.scaleY * 1 / e.scaleY
	      }

	      matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy)

	    // act on skew
	    } else if (o.skewX != null || o.skewY != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // ensure skew values on both axes
	      o.skewX = o.skewX != null ? o.skewX : 0
	      o.skewY = o.skewY != null ? o.skewY : 0

	      if (!relative) {
	        // absolute; reset skew values
	        var e = matrix.extract()
	        matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse())
	      }

	      matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy)

	    // act on flip
	    } else if (o.flip) {
	      matrix = matrix.flip(
	        o.flip
	      , o.offset == null ? target.bbox()['c' + o.flip] : o.offset
	      )

	    // act on translate
	    } else if (o.x != null || o.y != null) {
	      if (relative) {
	        // relative
	        matrix = matrix.translate(o.x, o.y)
	      } else {
	        // absolute
	        if (o.x != null) matrix.e = o.x
	        if (o.y != null) matrix.f = o.y
	      }
	    }

	    return this.attr('transform', matrix)
	  }
	})

	SVG.extend(SVG.FX, {
	  transform: function(o, relative) {
	    // get target in case of the fx module, otherwise reference this
	    var target = this.target()
	      , matrix

	    // act as a getter
	    if (typeof o !== 'object') {
	      // get current matrix
	      matrix = new SVG.Matrix(target).extract()

	      return typeof o === 'string' ? matrix[o] : matrix
	    }

	    // ensure relative flag
	    relative = !!relative || !!o.relative

	    // act on matrix
	    if (o.a != null) {
	      matrix = new SVG.Matrix(o)

	    // act on rotation
	    } else if (o.rotation != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // apply transformation
	      matrix = new SVG.Rotate(o.rotation, o.cx, o.cy)

	    // act on scale
	    } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // ensure scale values on both axes
	      o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1
	      o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1

	      matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy)

	    // act on skew
	    } else if (o.skewX != null || o.skewY != null) {
	      // ensure centre point
	      ensureCentre(o, target)

	      // ensure skew values on both axes
	      o.skewX = o.skewX != null ? o.skewX : 0
	      o.skewY = o.skewY != null ? o.skewY : 0

	      matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy)

	    // act on flip
	    } else if (o.flip) {
	      matrix = new SVG.Matrix().morph(new SVG.Matrix().flip(
	        o.flip
	      , o.offset == null ? target.bbox()['c' + o.flip] : o.offset
	      ))

	    // act on translate
	    } else if (o.x != null || o.y != null) {
	      matrix = new SVG.Translate(o.x, o.y)
	    }

	    if(!matrix) return this

	    matrix.relative = relative

	    this.last().transforms.push(matrix)

	    setTimeout(function(){this.start()}.bind(this), 0)

	    return this
	  }
	})

	SVG.extend(SVG.Element, {
	  // Reset all transformations
	  untransform: function() {
	    return this.attr('transform', null)
	  },
	  // merge the whole transformation chain into one matrix and returns it
	  matrixify: function() {

	    var matrix = (this.attr('transform') || '')
	      // split transformations
	      .split(/\)\s*/).slice(0,-1).map(function(str){
	        // generate key => value pairs
	        var kv = str.trim().split('(')
	        return [kv[0], kv[1].split(SVG.regex.matrixElements).map(function(str){ return parseFloat(str) })]
	      })
	      // calculate every transformation into one matrix
	      .reduce(function(matrix, transform){

	        if(transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]))
	        return matrix[transform[0]].apply(matrix, transform[1])

	      }, new SVG.Matrix())

	    return matrix
	  },
	  // add an element to another parent without changing the visual representation on the screen
	  toParent: function(parent) {
	    if(this == parent) return this
	    var ctm = this.screenCTM()
	    var temp = parent.rect(1,1)
	    var pCtm = temp.screenCTM().inverse()
	    temp.remove()

	    this.addTo(parent).untransform().transform(pCtm.multiply(ctm))

	    return this
	  },
	  // same as above with parent equals root-svg
	  toDoc: function() {
	    return this.toParent(this.doc())
	  }

	})

	SVG.Transformation = SVG.invent({

	  create: function(source, inversed){

	    if(arguments.length > 1 && typeof inversed != 'boolean'){
	      return this.create([].slice.call(arguments))
	    }

	    if(typeof source == 'object'){
	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        this[this.arguments[i]] = source[this.arguments[i]]
	      }
	    }

	    if(Array.isArray(source)){
	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        this[this.arguments[i]] = source[i]
	      }
	    }

	    this.inversed = false

	    if(inversed === true){
	      this.inversed = true
	    }

	  }

	, extend: {

	    at: function(pos){

	      var params = []

	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        params.push(this[this.arguments[i]])
	      }

	      var m = this._undo || new SVG.Matrix()

	      m = new SVG.Matrix().morph(SVG.Matrix.prototype[this.method].apply(m, params)).at(pos)

	      return this.inversed ? m.inverse() : m

	    }

	  , undo: function(o){
	      for(var i = 0, len = this.arguments.length; i < len; ++i){
	        o[this.arguments[i]] = typeof this[this.arguments[i]] == 'undefined' ? 0 : o[this.arguments[i]]
	      }

	      this._undo = new SVG[capitalize(this.method)](o, true).at(1)

	      return this
	    }

	  }

	})

	SVG.Translate = SVG.invent({

	  parent: SVG.Matrix
	, inherit: SVG.Transformation

	, create: function(source, inversed){
	    if(typeof source == 'object') this.constructor.call(this, source, inversed)
	    else this.constructor.call(this, [].slice.call(arguments))
	  }

	, extend: {
	    arguments: ['transformedX', 'transformedY']
	  , method: 'translate'
	  }

	})

	SVG.Rotate = SVG.invent({

	  parent: SVG.Matrix
	, inherit: SVG.Transformation

	, create: function(source, inversed){
	    if(typeof source == 'object') this.constructor.call(this, source, inversed)
	    else this.constructor.call(this, [].slice.call(arguments))
	  }

	, extend: {
	    arguments: ['rotation', 'cx', 'cy']
	  , method: 'rotate'
	  , at: function(pos){
	      var m = new SVG.Matrix().rotate(new SVG.Number().morph(this.rotation - (this._undo ? this._undo.rotation : 0)).at(pos), this.cx, this.cy)
	      return this.inversed ? m.inverse() : m
	    }
	  , undo: function(o){
	      this._undo = o
	    }
	  }

	})

	SVG.Scale = SVG.invent({

	  parent: SVG.Matrix
	, inherit: SVG.Transformation

	, create: function(source, inversed){
	    if(typeof source == 'object') this.constructor.call(this, source, inversed)
	    else this.constructor.call(this, [].slice.call(arguments))
	  }

	, extend: {
	    arguments: ['scaleX', 'scaleY', 'cx', 'cy']
	  , method: 'scale'
	  }

	})

	SVG.Skew = SVG.invent({

	  parent: SVG.Matrix
	, inherit: SVG.Transformation

	, create: function(source, inversed){
	    if(typeof source == 'object') this.constructor.call(this, source, inversed)
	    else this.constructor.call(this, [].slice.call(arguments))
	  }

	, extend: {
	    arguments: ['skewX', 'skewY', 'cx', 'cy']
	  , method: 'skew'
	  }

	})

	SVG.extend(SVG.Element, {
	  // Dynamic style generator
	  style: function(s, v) {
	    if (arguments.length == 0) {
	      // get full style
	      return this.node.style.cssText || ''

	    } else if (arguments.length < 2) {
	      // apply every style individually if an object is passed
	      if (typeof s == 'object') {
	        for (v in s) this.style(v, s[v])

	      } else if (SVG.regex.isCss.test(s)) {
	        // parse css string
	        s = s.split(';')

	        // apply every definition individually
	        for (var i = 0; i < s.length; i++) {
	          v = s[i].split(':')
	          this.style(v[0].replace(/\s+/g, ''), v[1])
	        }
	      } else {
	        // act as a getter if the first and only argument is not an object
	        return this.node.style[camelCase(s)]
	      }

	    } else {
	      this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v
	    }

	    return this
	  }
	})
	SVG.Parent = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }

	  // Inherit from
	, inherit: SVG.Element

	  // Add class methods
	, extend: {
	    // Returns all child elements
	    children: function() {
	      return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function(node) {
	        return SVG.adopt(node)
	      })
	    }
	    // Add given element at a position
	  , add: function(element, i) {
	      if (i == null)
	        this.node.appendChild(element.node)
	      else if (element.node != this.node.childNodes[i])
	        this.node.insertBefore(element.node, this.node.childNodes[i])

	      return this
	    }
	    // Basically does the same as `add()` but returns the added element instead
	  , put: function(element, i) {
	      this.add(element, i)
	      return element
	    }
	    // Checks if the given element is a child
	  , has: function(element) {
	      return this.index(element) >= 0
	    }
	    // Gets index of given element
	  , index: function(element) {
	      return [].slice.call(this.node.childNodes).indexOf(element.node)
	    }
	    // Get a element at the given index
	  , get: function(i) {
	      return SVG.adopt(this.node.childNodes[i])
	    }
	    // Get first child
	  , first: function() {
	      return this.get(0)
	    }
	    // Get the last child
	  , last: function() {
	      return this.get(this.node.childNodes.length - 1)
	    }
	    // Iterates over all children and invokes a given block
	  , each: function(block, deep) {
	      var i, il
	        , children = this.children()

	      for (i = 0, il = children.length; i < il; i++) {
	        if (children[i] instanceof SVG.Element)
	          block.apply(children[i], [i, children])

	        if (deep && (children[i] instanceof SVG.Container))
	          children[i].each(block, deep)
	      }

	      return this
	    }
	    // Remove a given child
	  , removeElement: function(element) {
	      this.node.removeChild(element.node)

	      return this
	    }
	    // Remove all elements in this container
	  , clear: function() {
	      // remove children
	      while(this.node.hasChildNodes())
	        this.node.removeChild(this.node.lastChild)

	      // remove defs reference
	      delete this._defs

	      return this
	    }
	  , // Get defs
	    defs: function() {
	      return this.doc().defs()
	    }
	  }

	})

	SVG.extend(SVG.Parent, {

	  ungroup: function(parent, depth) {
	    if(depth === 0 || this instanceof SVG.Defs) return this

	    parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent))
	    depth = depth || Infinity

	    this.each(function(){
	      if(this instanceof SVG.Defs) return this
	      if(this instanceof SVG.Parent) return this.ungroup(parent, depth-1)
	      return this.toParent(parent)
	    })

	    this.node.firstChild || this.remove()

	    return this
	  },

	  flatten: function(parent, depth) {
	    return this.ungroup(parent, depth)
	  }

	})
	SVG.Container = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }

	  // Inherit from
	, inherit: SVG.Parent

	})

	SVG.ViewBox = SVG.invent({

	  create: function(source) {
	    var i, base = [0, 0, 0, 0]

	    var x, y, width, height, box, view, we, he
	      , wm   = 1 // width multiplier
	      , hm   = 1 // height multiplier
	      , reg  = /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi

	    if(source instanceof SVG.Element){

	      we = source
	      he = source
	      view = (source.attr('viewBox') || '').match(reg)
	      box = source.bbox

	      // get dimensions of current node
	      width  = new SVG.Number(source.width())
	      height = new SVG.Number(source.height())

	      // find nearest non-percentual dimensions
	      while (width.unit == '%') {
	        wm *= width.value
	        width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width())
	        we = we.parent()
	      }
	      while (height.unit == '%') {
	        hm *= height.value
	        height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height())
	        he = he.parent()
	      }

	      // ensure defaults
	      this.x      = 0
	      this.y      = 0
	      this.width  = width  * wm
	      this.height = height * hm
	      this.zoom   = 1

	      if (view) {
	        // get width and height from viewbox
	        x      = parseFloat(view[0])
	        y      = parseFloat(view[1])
	        width  = parseFloat(view[2])
	        height = parseFloat(view[3])

	        // calculate zoom accoring to viewbox
	        this.zoom = ((this.width / this.height) > (width / height)) ?
	          this.height / height :
	          this.width  / width

	        // calculate real pixel dimensions on parent SVG.Doc element
	        this.x      = x
	        this.y      = y
	        this.width  = width
	        this.height = height

	      }

	    }else{

	      // ensure source as object
	      source = typeof source === 'string' ?
	        source.match(reg).map(function(el){ return parseFloat(el) }) :
	      Array.isArray(source) ?
	        source :
	      typeof source == 'object' ?
	        [source.x, source.y, source.width, source.height] :
	      arguments.length == 4 ?
	        [].slice.call(arguments) :
	        base

	      this.x = source[0]
	      this.y = source[1]
	      this.width = source[2]
	      this.height = source[3]
	    }


	  }

	, extend: {

	    toString: function() {
	      return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height
	    }
	  , morph: function(v){

	      var v = arguments.length == 1 ?
	        [v.x, v.y, v.width, v.height] :
	        [].slice.call(arguments)

	      this.destination = new SVG.ViewBox(v)

	      return this

	    }

	  , at: function(pos) {

	    if(!this.destination) return this

	    return new SVG.ViewBox([
	        this.x + (this.destination.x - this.x) * pos
	      , this.y + (this.destination.y - this.y) * pos
	      , this.width + (this.destination.width - this.width) * pos
	      , this.height + (this.destination.height - this.height) * pos
	    ])

	    }

	  }

	  // Define parent
	, parent: SVG.Container

	  // Add parent method
	, construct: {

	    // get/set viewbox
	    viewbox: function(v) {
	      if (arguments.length == 0)
	        // act as a getter if there are no arguments
	        return new SVG.ViewBox(this)

	      // otherwise act as a setter
	      v = arguments.length == 1 ?
	        [v.x, v.y, v.width, v.height] :
	        [].slice.call(arguments)

	      return this.attr('viewBox', v)
	    }

	  }

	})
	// Add events to elements
	;[  'click'
	  , 'dblclick'
	  , 'mousedown'
	  , 'mouseup'
	  , 'mouseover'
	  , 'mouseout'
	  , 'mousemove'
	  // , 'mouseenter' -> not supported by IE
	  // , 'mouseleave' -> not supported by IE
	  , 'touchstart'
	  , 'touchmove'
	  , 'touchleave'
	  , 'touchend'
	  , 'touchcancel' ].forEach(function(event) {

	  // add event to SVG.Element
	  SVG.Element.prototype[event] = function(f) {
	    var self = this

	    // bind event to element rather than element node
	    this.node['on' + event] = typeof f == 'function' ?
	      function() { return f.apply(self, arguments) } : null

	    return this
	  }

	})

	// Initialize listeners stack
	SVG.listeners = []
	SVG.handlerMap = []
	SVG.listenerId = 0

	// Add event binder in the SVG namespace
	SVG.on = function(node, event, listener, binding) {
	  // create listener, get object-index
	  var l     = listener.bind(binding || node.instance || node)
	    , index = (SVG.handlerMap.indexOf(node) + 1 || SVG.handlerMap.push(node)) - 1
	    , ev    = event.split('.')[0]
	    , ns    = event.split('.')[1] || '*'


	  // ensure valid object
	  SVG.listeners[index]         = SVG.listeners[index]         || {}
	  SVG.listeners[index][ev]     = SVG.listeners[index][ev]     || {}
	  SVG.listeners[index][ev][ns] = SVG.listeners[index][ev][ns] || {}

	  if(!listener._svgjsListenerId)
	    listener._svgjsListenerId = ++SVG.listenerId

	  // reference listener
	  SVG.listeners[index][ev][ns][listener._svgjsListenerId] = l

	  // add listener
	  node.addEventListener(ev, l, false)
	}

	// Add event unbinder in the SVG namespace
	SVG.off = function(node, event, listener) {
	  var index = SVG.handlerMap.indexOf(node)
	    , ev    = event && event.split('.')[0]
	    , ns    = event && event.split('.')[1]

	  if(index == -1) return

	  if (listener) {
	    if(typeof listener == 'function') listener = listener._svgjsListenerId
	    if(!listener) return

	    // remove listener reference
	    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns || '*']) {
	      // remove listener
	      node.removeEventListener(ev, SVG.listeners[index][ev][ns || '*'][listener], false)

	      delete SVG.listeners[index][ev][ns || '*'][listener]
	    }

	  } else if (ns && ev) {
	    // remove all listeners for a namespaced event
	    if (SVG.listeners[index][ev] && SVG.listeners[index][ev][ns]) {
	      for (listener in SVG.listeners[index][ev][ns])
	        SVG.off(node, [ev, ns].join('.'), listener)

	      delete SVG.listeners[index][ev][ns]
	    }

	  } else if (ns){
	    // remove all listeners for a specific namespace
	    for(event in SVG.listeners[index]){
	        for(namespace in SVG.listeners[index][event]){
	            if(ns === namespace){
	                SVG.off(node, [event, ns].join('.'))
	            }
	        }
	    }

	  } else if (ev) {
	    // remove all listeners for the event
	    if (SVG.listeners[index][ev]) {
	      for (namespace in SVG.listeners[index][ev])
	        SVG.off(node, [ev, namespace].join('.'))

	      delete SVG.listeners[index][ev]
	    }

	  } else {
	    // remove all listeners on a given node
	    for (event in SVG.listeners[index])
	      SVG.off(node, event)

	    delete SVG.listeners[index]

	  }
	}

	//
	SVG.extend(SVG.Element, {
	  // Bind given event to listener
	  on: function(event, listener, binding) {
	    SVG.on(this.node, event, listener, binding)

	    return this
	  }
	  // Unbind event from listener
	, off: function(event, listener) {
	    SVG.off(this.node, event, listener)

	    return this
	  }
	  // Fire given event
	, fire: function(event, data) {

	    // Dispatch event
	    if(event instanceof Event){
	        this.node.dispatchEvent(event)
	    }else{
	        this.node.dispatchEvent(new CustomEvent(event, {detail:data}))
	    }

	    return this
	  }
	})

	SVG.Defs = SVG.invent({
	  // Initialize node
	  create: 'defs'

	  // Inherit from
	, inherit: SVG.Container

	})
	SVG.G = SVG.invent({
	  // Initialize node
	  create: 'g'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true)
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.gbox().cx : this.x(x - this.gbox().width / 2)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.gbox().cy : this.y(y - this.gbox().height / 2)
	    }
	  , gbox: function() {

	      var bbox  = this.bbox()
	        , trans = this.transform()

	      bbox.x  += trans.x
	      bbox.x2 += trans.x
	      bbox.cx += trans.x

	      bbox.y  += trans.y
	      bbox.y2 += trans.y
	      bbox.cy += trans.y

	      return bbox
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a group element
	    group: function() {
	      return this.put(new SVG.G)
	    }
	  }
	})

	// ### This module adds backward / forward functionality to elements.

	//
	SVG.extend(SVG.Element, {
	  // Get all siblings, including myself
	  siblings: function() {
	    return this.parent().children()
	  }
	  // Get the curent position siblings
	, position: function() {
	    return this.parent().index(this)
	  }
	  // Get the next element (will return null if there is none)
	, next: function() {
	    return this.siblings()[this.position() + 1]
	  }
	  // Get the next element (will return null if there is none)
	, previous: function() {
	    return this.siblings()[this.position() - 1]
	  }
	  // Send given element one step forward
	, forward: function() {
	    var i = this.position() + 1
	      , p = this.parent()

	    // move node one step forward
	    p.removeElement(this).add(this, i)

	    // make sure defs node is always at the top
	    if (p instanceof SVG.Doc)
	      p.node.appendChild(p.defs().node)

	    return this
	  }
	  // Send given element one step backward
	, backward: function() {
	    var i = this.position()

	    if (i > 0)
	      this.parent().removeElement(this).add(this, i - 1)

	    return this
	  }
	  // Send given element all the way to the front
	, front: function() {
	    var p = this.parent()

	    // Move node forward
	    p.node.appendChild(this.node)

	    // Make sure defs node is always at the top
	    if (p instanceof SVG.Doc)
	      p.node.appendChild(p.defs().node)

	    return this
	  }
	  // Send given element all the way to the back
	, back: function() {
	    if (this.position() > 0)
	      this.parent().removeElement(this).add(this, 0)

	    return this
	  }
	  // Inserts a given element before the targeted element
	, before: function(element) {
	    element.remove()

	    var i = this.position()

	    this.parent().add(element, i)

	    return this
	  }
	  // Insters a given element after the targeted element
	, after: function(element) {
	    element.remove()

	    var i = this.position()

	    this.parent().add(element, i + 1)

	    return this
	  }

	})
	SVG.Mask = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('mask'))

	    // keep references to masked elements
	    this.targets = []
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Unmask all masked elements and remove itself
	    remove: function() {
	      // unmask all targets
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unmask()
	      this.targets = []

	      // remove mask from parent
	      this.parent().removeElement(this)

	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create masking element
	    mask: function() {
	      return this.defs().put(new SVG.Mask)
	    }
	  }
	})


	SVG.extend(SVG.Element, {
	  // Distribute mask to svg element
	  maskWith: function(element) {
	    // use given mask or create a new one
	    this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element)

	    // store reverence on self in mask
	    this.masker.targets.push(this)

	    // apply mask
	    return this.attr('mask', 'url("#' + this.masker.attr('id') + '")')
	  }
	  // Unmask element
	, unmask: function() {
	    delete this.masker
	    return this.attr('mask', null)
	  }

	})

	SVG.ClipPath = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('clipPath'))

	    // keep references to clipped elements
	    this.targets = []
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Unclip all clipped elements and remove itself
	    remove: function() {
	      // unclip all targets
	      for (var i = this.targets.length - 1; i >= 0; i--)
	        if (this.targets[i])
	          this.targets[i].unclip()
	      this.targets = []

	      // remove clipPath from parent
	      this.parent().removeElement(this)

	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create clipping element
	    clip: function() {
	      return this.defs().put(new SVG.ClipPath)
	    }
	  }
	})

	//
	SVG.extend(SVG.Element, {
	  // Distribute clipPath to svg element
	  clipWith: function(element) {
	    // use given clip or create a new one
	    this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element)

	    // store reverence on self in mask
	    this.clipper.targets.push(this)

	    // apply mask
	    return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")')
	  }
	  // Unclip element
	, unclip: function() {
	    delete this.clipper
	    return this.attr('clip-path', null)
	  }

	})
	SVG.Gradient = SVG.invent({
	  // Initialize node
	  create: function(type) {
	    this.constructor.call(this, SVG.create(type + 'Gradient'))

	    // store type
	    this.type = type
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Add a color stop
	    at: function(offset, color, opacity) {
	      return this.put(new SVG.Stop).update(offset, color, opacity)
	    }
	    // Update gradient
	  , update: function(block) {
	      // remove all stops
	      this.clear()

	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)

	      return this
	    }
	    // Return the fill id
	  , fill: function() {
	      return 'url(#' + this.id() + ')'
	    }
	    // Alias string convertion to fill
	  , toString: function() {
	      return this.fill()
	    }
	    // custom attr to handle transform
	  , attr: function(a, b, c) {
	      if(a == 'transform') a = 'gradientTransform'
	      return SVG.Container.prototype.attr.call(this, a, b, c)
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create gradient element in defs
	    gradient: function(type, block) {
	      return this.defs().gradient(type, block)
	    }
	  }
	})

	// Add animatable methods to both gradient and fx module
	SVG.extend(SVG.Gradient, SVG.FX, {
	  // From position
	  from: function(x, y) {
	    return (this._target || this).type == 'radial' ?
	      this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) :
	      this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) })
	  }
	  // To position
	, to: function(x, y) {
	    return (this._target || this).type == 'radial' ?
	      this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) :
	      this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) })
	  }
	})

	// Base gradient generation
	SVG.extend(SVG.Defs, {
	  // define gradient
	  gradient: function(type, block) {
	    return this.put(new SVG.Gradient(type)).update(block)
	  }

	})

	SVG.Stop = SVG.invent({
	  // Initialize node
	  create: 'stop'

	  // Inherit from
	, inherit: SVG.Element

	  // Add class methods
	, extend: {
	    // add color stops
	    update: function(o) {
	      if (typeof o == 'number' || o instanceof SVG.Number) {
	        o = {
	          offset:  arguments[0]
	        , color:   arguments[1]
	        , opacity: arguments[2]
	        }
	      }

	      // set attributes
	      if (o.opacity != null) this.attr('stop-opacity', o.opacity)
	      if (o.color   != null) this.attr('stop-color', o.color)
	      if (o.offset  != null) this.attr('offset', new SVG.Number(o.offset))

	      return this
	    }
	  }

	})

	SVG.Pattern = SVG.invent({
	  // Initialize node
	  create: 'pattern'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Return the fill id
	    fill: function() {
	      return 'url(#' + this.id() + ')'
	    }
	    // Update pattern by rebuilding
	  , update: function(block) {
	      // remove content
	      this.clear()

	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)

	      return this
	    }
	    // Alias string convertion to fill
	  , toString: function() {
	      return this.fill()
	    }
	    // custom attr to handle transform
	  , attr: function(a, b, c) {
	      if(a == 'transform') a = 'patternTransform'
	      return SVG.Container.prototype.attr.call(this, a, b, c)
	    }

	  }

	  // Add parent method
	, construct: {
	    // Create pattern element in defs
	    pattern: function(width, height, block) {
	      return this.defs().pattern(width, height, block)
	    }
	  }
	})

	SVG.extend(SVG.Defs, {
	  // Define gradient
	  pattern: function(width, height, block) {
	    return this.put(new SVG.Pattern).update(block).attr({
	      x:            0
	    , y:            0
	    , width:        width
	    , height:       height
	    , patternUnits: 'userSpaceOnUse'
	    })
	  }

	})
	SVG.Doc = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    if (element) {
	      // ensure the presence of a dom element
	      element = typeof element == 'string' ?
	        document.getElementById(element) :
	        element

	      // If the target is an svg element, use that element as the main wrapper.
	      // This allows svg.js to work with svg documents as well.
	      if (element.nodeName == 'svg') {
	        this.constructor.call(this, element)
	      } else {
	        this.constructor.call(this, SVG.create('svg'))
	        element.appendChild(this.node)
	        this.size('100%', '100%')
	      }

	      // set svg element attributes and ensure defs node
	      this.namespace().defs()
	    }
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Add namespaces
	    namespace: function() {
	      return this
	        .attr({ xmlns: SVG.ns, version: '1.1' })
	        .attr('xmlns:xlink', SVG.xlink, SVG.xmlns)
	        .attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns)
	    }
	    // Creates and returns defs element
	  , defs: function() {
	      if (!this._defs) {
	        var defs

	        // Find or create a defs element in this instance
	        if (defs = this.node.getElementsByTagName('defs')[0])
	          this._defs = SVG.adopt(defs)
	        else
	          this._defs = new SVG.Defs

	        // Make sure the defs node is at the end of the stack
	        this.node.appendChild(this._defs.node)
	      }

	      return this._defs
	    }
	    // custom parent method
	  , parent: function() {
	      return this.node.parentNode.nodeName == '#document' ? null : this.node.parentNode
	    }
	    // Fix for possible sub-pixel offset. See:
	    // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
	  , spof: function(spof) {
	      var pos = this.node.getScreenCTM()

	      if (pos)
	        this
	          .style('left', (-pos.e % 1) + 'px')
	          .style('top',  (-pos.f % 1) + 'px')

	      return this
	    }

	      // Removes the doc from the DOM
	  , remove: function() {
	      if(this.parent()) {
	        this.parent().removeChild(this.node);
	      }

	      return this;
	    }
	  }

	})

	SVG.Shape = SVG.invent({
	  // Initialize node
	  create: function(element) {
	    this.constructor.call(this, element)
	  }

	  // Inherit from
	, inherit: SVG.Element

	})

	SVG.Bare = SVG.invent({
	  // Initialize
	  create: function(element, inherit) {
	    // construct element
	    this.constructor.call(this, SVG.create(element))

	    // inherit custom methods
	    if (inherit)
	      for (var method in inherit.prototype)
	        if (typeof inherit.prototype[method] === 'function')
	          this[method] = inherit.prototype[method]
	  }

	  // Inherit from
	, inherit: SVG.Element

	  // Add methods
	, extend: {
	    // Insert some plain text
	    words: function(text) {
	      // remove contents
	      while (this.node.hasChildNodes())
	        this.node.removeChild(this.node.lastChild)

	      // create text node
	      this.node.appendChild(document.createTextNode(text))

	      return this
	    }
	  }
	})


	SVG.extend(SVG.Parent, {
	  // Create an element that is not described by SVG.js
	  element: function(element, inherit) {
	    return this.put(new SVG.Bare(element, inherit))
	  }
	  // Add symbol element
	, symbol: function() {
	    return this.defs().element('symbol', SVG.Container)
	  }

	})
	SVG.Use = SVG.invent({
	  // Initialize node
	  create: 'use'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Use element as a reference
	    element: function(element, file) {
	      // Set lined element
	      return this.attr('href', (file || '') + '#' + element, SVG.xlink)
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a use element
	    use: function(element, file) {
	      return this.put(new SVG.Use).element(element, file)
	    }
	  }
	})
	SVG.Rect = SVG.invent({
	  // Initialize node
	  create: 'rect'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create a rect element
	    rect: function(width, height) {
	      return this.put(new SVG.Rect()).size(width, height)
	    }
	  }
	})
	SVG.Circle = SVG.invent({
	  // Initialize node
	  create: 'circle'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create circle element, based on ellipse
	    circle: function(size) {
	      return this.put(new SVG.Circle).rx(new SVG.Number(size).divide(2)).move(0, 0)
	    }
	  }
	})

	SVG.extend(SVG.Circle, SVG.FX, {
	  // Radius x value
	  rx: function(rx) {
	    return this.attr('r', rx)
	  }
	  // Alias radius x value
	, ry: function(ry) {
	    return this.rx(ry)
	  }
	})

	SVG.Ellipse = SVG.invent({
	  // Initialize node
	  create: 'ellipse'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create an ellipse
	    ellipse: function(width, height) {
	      return this.put(new SVG.Ellipse).size(width, height).move(0, 0)
	    }
	  }
	})

	SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
	  // Radius x value
	  rx: function(rx) {
	    return this.attr('rx', rx)
	  }
	  // Radius y value
	, ry: function(ry) {
	    return this.attr('ry', ry)
	  }
	})

	// Add common method
	SVG.extend(SVG.Circle, SVG.Ellipse, {
	    // Move over x-axis
	    x: function(x) {
	      return x == null ? this.cx() - this.rx() : this.cx(x + this.rx())
	    }
	    // Move over y-axis
	  , y: function(y) {
	      return y == null ? this.cy() - this.ry() : this.cy(y + this.ry())
	    }
	    // Move by center over x-axis
	  , cx: function(x) {
	      return x == null ? this.attr('cx') : this.attr('cx', x)
	    }
	    // Move by center over y-axis
	  , cy: function(y) {
	      return y == null ? this.attr('cy') : this.attr('cy', y)
	    }
	    // Set width of element
	  , width: function(width) {
	      return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2))
	    }
	    // Set height of element
	  , height: function(height) {
	      return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2))
	    }
	    // Custom size function
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)

	      return this
	        .rx(new SVG.Number(p.width).divide(2))
	        .ry(new SVG.Number(p.height).divide(2))
	    }
	})
	SVG.Line = SVG.invent({
	  // Initialize node
	  create: 'line'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Get array
	    array: function() {
	      return new SVG.PointArray([
	        [ this.attr('x1'), this.attr('y1') ]
	      , [ this.attr('x2'), this.attr('y2') ]
	      ])
	    }
	    // Overwrite native plot() method
	  , plot: function(x1, y1, x2, y2) {
	      if (typeof y1 !== 'undefined')
	        x1 = { x1: x1, y1: y1, x2: x2, y2: y2 }
	      else
	        x1 = new SVG.PointArray(x1).toLine()

	      return this.attr(x1)
	    }
	    // Move by left top corner
	  , move: function(x, y) {
	      return this.attr(this.array().move(x, y).toLine())
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)

	      return this.attr(this.array().size(p.width, p.height).toLine())
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a line element
	    line: function(x1, y1, x2, y2) {
	      return this.put(new SVG.Line).plot(x1, y1, x2, y2)
	    }
	  }
	})

	SVG.Polyline = SVG.invent({
	  // Initialize node
	  create: 'polyline'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create a wrapped polyline element
	    polyline: function(p) {
	      return this.put(new SVG.Polyline).plot(p)
	    }
	  }
	})

	SVG.Polygon = SVG.invent({
	  // Initialize node
	  create: 'polygon'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add parent method
	, construct: {
	    // Create a wrapped polygon element
	    polygon: function(p) {
	      return this.put(new SVG.Polygon).plot(p)
	    }
	  }
	})

	// Add polygon-specific functions
	SVG.extend(SVG.Polyline, SVG.Polygon, {
	  // Get array
	  array: function() {
	    return this._array || (this._array = new SVG.PointArray(this.attr('points')))
	  }
	  // Plot new path
	, plot: function(p) {
	    return this.attr('points', (this._array = new SVG.PointArray(p)))
	  }
	  // Move by left top corner
	, move: function(x, y) {
	    return this.attr('points', this.array().move(x, y))
	  }
	  // Set element size to given width and height
	, size: function(width, height) {
	    var p = proportionalSize(this, width, height)

	    return this.attr('points', this.array().size(p.width, p.height))
	  }

	})
	// unify all point to point elements
	SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
	  // Define morphable array
	  morphArray:  SVG.PointArray
	  // Move by left top corner over x-axis
	, x: function(x) {
	    return x == null ? this.bbox().x : this.move(x, this.bbox().y)
	  }
	  // Move by left top corner over y-axis
	, y: function(y) {
	    return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	  }
	  // Set width of element
	, width: function(width) {
	    var b = this.bbox()

	    return width == null ? b.width : this.size(width, b.height)
	  }
	  // Set height of element
	, height: function(height) {
	    var b = this.bbox()

	    return height == null ? b.height : this.size(b.width, height)
	  }
	})
	SVG.Path = SVG.invent({
	  // Initialize node
	  create: 'path'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Define morphable array
	    morphArray:  SVG.PathArray
	    // Get array
	  , array: function() {
	      return this._array || (this._array = new SVG.PathArray(this.attr('d')))
	    }
	    // Plot new poly points
	  , plot: function(p) {
	      return this.attr('d', (this._array = new SVG.PathArray(p)))
	    }
	    // Move by left top corner
	  , move: function(x, y) {
	      return this.attr('d', this.array().move(x, y))
	    }
	    // Move by left top corner over x-axis
	  , x: function(x) {
	      return x == null ? this.bbox().x : this.move(x, this.bbox().y)
	    }
	    // Move by left top corner over y-axis
	  , y: function(y) {
	      return y == null ? this.bbox().y : this.move(this.bbox().x, y)
	    }
	    // Set element size to given width and height
	  , size: function(width, height) {
	      var p = proportionalSize(this, width, height)

	      return this.attr('d', this.array().size(p.width, p.height))
	    }
	    // Set width of element
	  , width: function(width) {
	      return width == null ? this.bbox().width : this.size(width, this.bbox().height)
	    }
	    // Set height of element
	  , height: function(height) {
	      return height == null ? this.bbox().height : this.size(this.bbox().width, height)
	    }

	  }

	  // Add parent method
	, construct: {
	    // Create a wrapped path element
	    path: function(d) {
	      return this.put(new SVG.Path).plot(d)
	    }
	  }
	})
	SVG.Image = SVG.invent({
	  // Initialize node
	  create: 'image'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // (re)load image
	    load: function(url) {
	      if (!url) return this

	      var self = this
	        , img  = document.createElement('img')

	      // preload image
	      img.onload = function() {
	        var p = self.parent(SVG.Pattern)

	        if(p === null) return

	        // ensure image size
	        if (self.width() == 0 && self.height() == 0)
	          self.size(img.width, img.height)

	        // ensure pattern size if not set
	        if (p && p.width() == 0 && p.height() == 0)
	          p.size(self.width(), self.height())

	        // callback
	        if (typeof self._loaded === 'function')
	          self._loaded.call(self, {
	            width:  img.width
	          , height: img.height
	          , ratio:  img.width / img.height
	          , url:    url
	          })
	      }

	      img.onerror = function(e){
	        if (typeof self._error === 'function'){
	            self._error.call(self, e)
	        }
	      }

	      return this.attr('href', (img.src = this.src = url), SVG.xlink)
	    }
	    // Add loaded callback
	  , loaded: function(loaded) {
	      this._loaded = loaded
	      return this
	    }

	  , error: function(error) {
	      this._error = error
	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // create image element, load image and set its size
	    image: function(source, width, height) {
	      return this.put(new SVG.Image).load(source).size(width || 0, height || width || 0)
	    }
	  }

	})
	SVG.Text = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('text'))

	    this.dom.leading = new SVG.Number(1.3)    // store leading value for rebuilding
	    this._rebuild = true                      // enable automatic updating of dy values
	    this._build   = false                     // disable build mode for adding multiple lines

	    // set default font
	    this.attr('font-family', SVG.defaults.attrs['font-family'])
	  }

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Move over x-axis
	    x: function(x) {
	      // act as getter
	      if (x == null)
	        return this.attr('x')

	      // move lines as well if no textPath is present
	      if (!this.textPath)
	        this.lines().each(function() { if (this.dom.newLined) this.x(x) })

	      return this.attr('x', x)
	    }
	    // Move over y-axis
	  , y: function(y) {
	      var oy = this.attr('y')
	        , o  = typeof oy === 'number' ? oy - this.bbox().y : 0

	      // act as getter
	      if (y == null)
	        return typeof oy === 'number' ? oy - o : oy

	      return this.attr('y', typeof y === 'number' ? y + o : y)
	    }
	    // Move center over x-axis
	  , cx: function(x) {
	      return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2)
	    }
	    // Move center over y-axis
	  , cy: function(y) {
	      return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2)
	    }
	    // Set the text content
	  , text: function(text) {
	      // act as getter
	      if (typeof text === 'undefined'){
	        var text = ''
	        var children = this.node.childNodes
	        for(var i = 0, len = children.length; i < len; ++i){

	          // add newline if its not the first child and newLined is set to true
	          if(i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true){
	            text += '\n'
	          }

	          // add content of this node
	          text += children[i].textContent
	        }

	        return text
	      }

	      // remove existing content
	      this.clear().build(true)

	      if (typeof text === 'function') {
	        // call block
	        text.call(this, this)

	      } else {
	        // store text and make sure text is not blank
	        text = text.split('\n')

	        // build new lines
	        for (var i = 0, il = text.length; i < il; i++)
	          this.tspan(text[i]).newLine()
	      }

	      // disable build mode and rebuild lines
	      return this.build(false).rebuild()
	    }
	    // Set font size
	  , size: function(size) {
	      return this.attr('font-size', size).rebuild()
	    }
	    // Set / get leading
	  , leading: function(value) {
	      // act as getter
	      if (value == null)
	        return this.dom.leading

	      // act as setter
	      this.dom.leading = new SVG.Number(value)

	      return this.rebuild()
	    }
	    // Get all the first level lines
	  , lines: function() {
	      var node = (this.textPath && this.textPath() || this).node

	      // filter tspans and map them to SVG.js instances
	      var lines = SVG.utils.map(SVG.utils.filterSVGElements(node.childNodes), function(el){
	        return SVG.adopt(el)
	      })

	      // return an instance of SVG.set
	      return new SVG.Set(lines)
	    }
	    // Rebuild appearance type
	  , rebuild: function(rebuild) {
	      // store new rebuild flag if given
	      if (typeof rebuild == 'boolean')
	        this._rebuild = rebuild

	      // define position of all lines
	      if (this._rebuild) {
	        var self = this
	          , blankLineOffset = 0
	          , dy = this.dom.leading * new SVG.Number(this.attr('font-size'))

	        this.lines().each(function() {
	          if (this.dom.newLined) {
	            if (!this.textPath)
	              this.attr('x', self.attr('x'))

	            if(this.text() == '\n') {
	              blankLineOffset += dy
	            }else{
	              this.attr('dy', dy + blankLineOffset)
	              blankLineOffset = 0
	            }
	          }
	        })

	        this.fire('rebuild')
	      }

	      return this
	    }
	    // Enable / disable build mode
	  , build: function(build) {
	      this._build = !!build
	      return this
	    }
	    // overwrite method from parent to set data properly
	  , setData: function(o){
	      this.dom = o
	      this.dom.leading = new SVG.Number(o.leading || 1.3)
	      return this
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create text element
	    text: function(text) {
	      return this.put(new SVG.Text).text(text)
	    }
	    // Create plain text element
	  , plain: function(text) {
	      return this.put(new SVG.Text).plain(text)
	    }
	  }

	})

	SVG.Tspan = SVG.invent({
	  // Initialize node
	  create: 'tspan'

	  // Inherit from
	, inherit: SVG.Shape

	  // Add class methods
	, extend: {
	    // Set text content
	    text: function(text) {
	      if(text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '')

	      typeof text === 'function' ? text.call(this, this) : this.plain(text)

	      return this
	    }
	    // Shortcut dx
	  , dx: function(dx) {
	      return this.attr('dx', dx)
	    }
	    // Shortcut dy
	  , dy: function(dy) {
	      return this.attr('dy', dy)
	    }
	    // Create new line
	  , newLine: function() {
	      // fetch text parent
	      var t = this.parent(SVG.Text)

	      // mark new line
	      this.dom.newLined = true

	      // apply new hy¡n
	      return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x())
	    }
	  }

	})

	SVG.extend(SVG.Text, SVG.Tspan, {
	  // Create plain text node
	  plain: function(text) {
	    // clear if build mode is disabled
	    if (this._build === false)
	      this.clear()

	    // create text node
	    this.node.appendChild(document.createTextNode(text))

	    return this
	  }
	  // Create a tspan
	, tspan: function(text) {
	    var node  = (this.textPath && this.textPath() || this).node
	      , tspan = new SVG.Tspan

	    // clear if build mode is disabled
	    if (this._build === false)
	      this.clear()

	    // add new tspan
	    node.appendChild(tspan.node)

	    return tspan.text(text)
	  }
	  // Clear all lines
	, clear: function() {
	    var node = (this.textPath && this.textPath() || this).node

	    // remove existing child nodes
	    while (node.hasChildNodes())
	      node.removeChild(node.lastChild)

	    return this
	  }
	  // Get length of text element
	, length: function() {
	    return this.node.getComputedTextLength()
	  }
	})

	SVG.TextPath = SVG.invent({
	  // Initialize node
	  create: 'textPath'

	  // Inherit from
	, inherit: SVG.Parent

	  // Define parent class
	, parent: SVG.Text

	  // Add parent method
	, construct: {
	    // Create path for text to run on
	    path: function(d) {
	      // create textPath element
	      var path  = new SVG.TextPath
	        , track = this.doc().defs().path(d)

	      // move lines to textpath
	      while (this.node.hasChildNodes())
	        path.node.appendChild(this.node.firstChild)

	      // add textPath element as child node
	      this.node.appendChild(path.node)

	      // link textPath to path and add content
	      path.attr('href', '#' + track, SVG.xlink)

	      return this
	    }
	    // Plot path if any
	  , plot: function(d) {
	      var track = this.track()

	      if (track)
	        track.plot(d)

	      return this
	    }
	    // Get the path track element
	  , track: function() {
	      var path = this.textPath()

	      if (path)
	        return path.reference('href')
	    }
	    // Get the textPath child
	  , textPath: function() {
	      if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath')
	        return SVG.adopt(this.node.firstChild)
	    }
	  }
	})
	SVG.Nested = SVG.invent({
	  // Initialize node
	  create: function() {
	    this.constructor.call(this, SVG.create('svg'))

	    this.style('overflow', 'visible')
	  }

	  // Inherit from
	, inherit: SVG.Container

	  // Add parent method
	, construct: {
	    // Create nested svg document
	    nested: function() {
	      return this.put(new SVG.Nested)
	    }
	  }
	})
	SVG.A = SVG.invent({
	  // Initialize node
	  create: 'a'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Link url
	    to: function(url) {
	      return this.attr('href', url, SVG.xlink)
	    }
	    // Link show attribute
	  , show: function(target) {
	      return this.attr('show', target, SVG.xlink)
	    }
	    // Link target attribute
	  , target: function(target) {
	      return this.attr('target', target)
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a hyperlink element
	    link: function(url) {
	      return this.put(new SVG.A).to(url)
	    }
	  }
	})

	SVG.extend(SVG.Element, {
	  // Create a hyperlink element
	  linkTo: function(url) {
	    var link = new SVG.A

	    if (typeof url == 'function')
	      url.call(link, link)
	    else
	      link.to(url)

	    return this.parent().put(link).put(this)
	  }

	})
	SVG.Marker = SVG.invent({
	  // Initialize node
	  create: 'marker'

	  // Inherit from
	, inherit: SVG.Container

	  // Add class methods
	, extend: {
	    // Set width of element
	    width: function(width) {
	      return this.attr('markerWidth', width)
	    }
	    // Set height of element
	  , height: function(height) {
	      return this.attr('markerHeight', height)
	    }
	    // Set marker refX and refY
	  , ref: function(x, y) {
	      return this.attr('refX', x).attr('refY', y)
	    }
	    // Update marker
	  , update: function(block) {
	      // remove all content
	      this.clear()

	      // invoke passed block
	      if (typeof block == 'function')
	        block.call(this, this)

	      return this
	    }
	    // Return the fill id
	  , toString: function() {
	      return 'url(#' + this.id() + ')'
	    }
	  }

	  // Add parent method
	, construct: {
	    marker: function(width, height, block) {
	      // Create marker element in defs
	      return this.defs().marker(width, height, block)
	    }
	  }

	})

	SVG.extend(SVG.Defs, {
	  // Create marker
	  marker: function(width, height, block) {
	    // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
	    return this.put(new SVG.Marker)
	      .size(width, height)
	      .ref(width / 2, height / 2)
	      .viewbox(0, 0, width, height)
	      .attr('orient', 'auto')
	      .update(block)
	  }

	})

	SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
	  // Create and attach markers
	  marker: function(marker, width, height, block) {
	    var attr = ['marker']

	    // Build attribute name
	    if (marker != 'all') attr.push(marker)
	    attr = attr.join('-')

	    // Set marker attribute
	    marker = arguments[1] instanceof SVG.Marker ?
	      arguments[1] :
	      this.doc().marker(width, height, block)

	    return this.attr(attr, marker)
	  }

	})
	// Define list of available attributes for stroke and fill
	var sugar = {
	  stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset']
	, fill:   ['color', 'opacity', 'rule']
	, prefix: function(t, a) {
	    return a == 'color' ? t : t + '-' + a
	  }
	}

	// Add sugar for fill and stroke
	;['fill', 'stroke'].forEach(function(m) {
	  var i, extension = {}

	  extension[m] = function(o) {
	    if (typeof o == 'undefined')
	      return this
	    if (typeof o == 'string' || SVG.Color.isRgb(o) || (o && typeof o.fill === 'function'))
	      this.attr(m, o)

	    else
	      // set all attributes from sugar.fill and sugar.stroke list
	      for (i = sugar[m].length - 1; i >= 0; i--)
	        if (o[sugar[m][i]] != null)
	          this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]])

	    return this
	  }

	  SVG.extend(SVG.Element, SVG.FX, extension)

	})

	SVG.extend(SVG.Element, SVG.FX, {
	  // Map rotation to transform
	  rotate: function(d, cx, cy) {
	    return this.transform({ rotation: d, cx: cx, cy: cy })
	  }
	  // Map skew to transform
	, skew: function(x, y, cx, cy) {
	    return this.transform({ skewX: x, skewY: y, cx: cx, cy: cy })
	  }
	  // Map scale to transform
	, scale: function(x, y, cx, cy) {
	    return arguments.length == 1  || arguments.length == 3 ?
	      this.transform({ scale: x, cx: y, cy: cx }) :
	      this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy })
	  }
	  // Map translate to transform
	, translate: function(x, y) {
	    return this.transform({ x: x, y: y })
	  }
	  // Map flip to transform
	, flip: function(a, o) {
	    return this.transform({ flip: a, offset: o })
	  }
	  // Map matrix to transform
	, matrix: function(m) {
	    return this.attr('transform', new SVG.Matrix(m))
	  }
	  // Opacity
	, opacity: function(value) {
	    return this.attr('opacity', value)
	  }
	  // Relative move over x axis
	, dx: function(x) {
	    return this.x((this instanceof SVG.FX ? 0 : this.x()) + x, true)
	  }
	  // Relative move over y axis
	, dy: function(y) {
	    return this.y((this instanceof SVG.FX ? 0 : this.y()) + y, true)
	  }
	  // Relative move over x and y axes
	, dmove: function(x, y) {
	    return this.dx(x).dy(y)
	  }
	})

	SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
	  // Add x and y radius
	  radius: function(x, y) {
	    var type = (this._target || this).type;
	    return type == 'radial' || type == 'circle' ?
	      this.attr('r', new SVG.Number(x)) :
	      this.rx(x).ry(y == null ? x : y)
	  }
	})

	SVG.extend(SVG.Path, {
	  // Get path length
	  length: function() {
	    return this.node.getTotalLength()
	  }
	  // Get point at length
	, pointAt: function(length) {
	    return this.node.getPointAtLength(length)
	  }
	})

	SVG.extend(SVG.Parent, SVG.Text, SVG.FX, {
	  // Set font
	  font: function(o) {
	    for (var k in o)
	      k == 'leading' ?
	        this.leading(o[k]) :
	      k == 'anchor' ?
	        this.attr('text-anchor', o[k]) :
	      k == 'size' || k == 'family' || k == 'weight' || k == 'stretch' || k == 'variant' || k == 'style' ?
	        this.attr('font-'+ k, o[k]) :
	        this.attr(k, o[k])

	    return this
	  }
	})


	SVG.Set = SVG.invent({
	  // Initialize
	  create: function(members) {
	    // Set initial state
	    Array.isArray(members) ? this.members = members : this.clear()
	  }

	  // Add class methods
	, extend: {
	    // Add element to set
	    add: function() {
	      var i, il, elements = [].slice.call(arguments)

	      for (i = 0, il = elements.length; i < il; i++)
	        this.members.push(elements[i])

	      return this
	    }
	    // Remove element from set
	  , remove: function(element) {
	      var i = this.index(element)

	      // remove given child
	      if (i > -1)
	        this.members.splice(i, 1)

	      return this
	    }
	    // Iterate over all members
	  , each: function(block) {
	      for (var i = 0, il = this.members.length; i < il; i++)
	        block.apply(this.members[i], [i, this.members])

	      return this
	    }
	    // Restore to defaults
	  , clear: function() {
	      // initialize store
	      this.members = []

	      return this
	    }
	    // Get the length of a set
	  , length: function() {
	      return this.members.length
	    }
	    // Checks if a given element is present in set
	  , has: function(element) {
	      return this.index(element) >= 0
	    }
	    // retuns index of given element in set
	  , index: function(element) {
	      return this.members.indexOf(element)
	    }
	    // Get member at given index
	  , get: function(i) {
	      return this.members[i]
	    }
	    // Get first member
	  , first: function() {
	      return this.get(0)
	    }
	    // Get last member
	  , last: function() {
	      return this.get(this.members.length - 1)
	    }
	    // Default value
	  , valueOf: function() {
	      return this.members
	    }
	    // Get the bounding box of all members included or empty box if set has no items
	  , bbox: function(){
	      var box = new SVG.BBox()

	      // return an empty box of there are no members
	      if (this.members.length == 0)
	        return box

	      // get the first rbox and update the target bbox
	      var rbox = this.members[0].rbox()
	      box.x      = rbox.x
	      box.y      = rbox.y
	      box.width  = rbox.width
	      box.height = rbox.height

	      this.each(function() {
	        // user rbox for correct position and visual representation
	        box = box.merge(this.rbox())
	      })

	      return box
	    }
	  }

	  // Add parent method
	, construct: {
	    // Create a new set
	    set: function(members) {
	      return new SVG.Set(members)
	    }
	  }
	})

	SVG.FX.Set = SVG.invent({
	  // Initialize node
	  create: function(set) {
	    // store reference to set
	    this.set = set
	  }

	})

	// Alias methods
	SVG.Set.inherit = function() {
	  var m
	    , methods = []

	  // gather shape methods
	  for(var m in SVG.Shape.prototype)
	    if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function')
	      methods.push(m)

	  // apply shape aliasses
	  methods.forEach(function(method) {
	    SVG.Set.prototype[method] = function() {
	      for (var i = 0, il = this.members.length; i < il; i++)
	        if (this.members[i] && typeof this.members[i][method] == 'function')
	          this.members[i][method].apply(this.members[i], arguments)

	      return method == 'animate' ? (this.fx || (this.fx = new SVG.FX.Set(this))) : this
	    }
	  })

	  // clear methods for the next round
	  methods = []

	  // gather fx methods
	  for(var m in SVG.FX.prototype)
	    if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function')
	      methods.push(m)

	  // apply fx aliasses
	  methods.forEach(function(method) {
	    SVG.FX.Set.prototype[method] = function() {
	      for (var i = 0, il = this.set.members.length; i < il; i++)
	        this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments)

	      return this
	    }
	  })
	}




	SVG.extend(SVG.Element, {
	  // Store data values on svg nodes
	  data: function(a, v, r) {
	    if (typeof a == 'object') {
	      for (v in a)
	        this.data(v, a[v])

	    } else if (arguments.length < 2) {
	      try {
	        return JSON.parse(this.attr('data-' + a))
	      } catch(e) {
	        return this.attr('data-' + a)
	      }

	    } else {
	      this.attr(
	        'data-' + a
	      , v === null ?
	          null :
	        r === true || typeof v === 'string' || typeof v === 'number' ?
	          v :
	          JSON.stringify(v)
	      )
	    }

	    return this
	  }
	})
	SVG.extend(SVG.Element, {
	  // Remember arbitrary data
	  remember: function(k, v) {
	    // remember every item in an object individually
	    if (typeof arguments[0] == 'object')
	      for (var v in k)
	        this.remember(v, k[v])

	    // retrieve memory
	    else if (arguments.length == 1)
	      return this.memory()[k]

	    // store memory
	    else
	      this.memory()[k] = v

	    return this
	  }

	  // Erase a given memory
	, forget: function() {
	    if (arguments.length == 0)
	      this._memory = {}
	    else
	      for (var i = arguments.length - 1; i >= 0; i--)
	        delete this.memory()[arguments[i]]

	    return this
	  }

	  // Initialize or return local memory object
	, memory: function() {
	    return this._memory || (this._memory = {})
	  }

	})
	// Method for getting an element by id
	SVG.get = function(id) {
	  var node = document.getElementById(idFromReference(id) || id)
	  return SVG.adopt(node)
	}

	// Select elements by query string
	SVG.select = function(query, parent) {
	  return new SVG.Set(
	    SVG.utils.map((parent || document).querySelectorAll(query), function(node) {
	      return SVG.adopt(node)
	    })
	  )
	}

	SVG.extend(SVG.Parent, {
	  // Scoped select method
	  select: function(query) {
	    return SVG.select(query, this.node)
	  }

	})
	function is(el, obj){
	  return el instanceof obj
	}

	// tests if a given selector matches an element
	function matches(el, selector) {
	  return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
	}

	// Convert dash-separated-string to camelCase
	function camelCase(s) {
	  return s.toLowerCase().replace(/-(.)/g, function(m, g) {
	    return g.toUpperCase()
	  })
	}

	// Capitalize first letter of a string
	function capitalize(s) {
	  return s.charAt(0).toUpperCase() + s.slice(1)
	}

	// Ensure to six-based hex
	function fullHex(hex) {
	  return hex.length == 4 ?
	    [ '#',
	      hex.substring(1, 2), hex.substring(1, 2)
	    , hex.substring(2, 3), hex.substring(2, 3)
	    , hex.substring(3, 4), hex.substring(3, 4)
	    ].join('') : hex
	}

	// Component to hex value
	function compToHex(comp) {
	  var hex = comp.toString(16)
	  return hex.length == 1 ? '0' + hex : hex
	}

	// Calculate proportional width and height values when necessary
	function proportionalSize(element, width, height) {
	  if (width == null || height == null) {
	    var box = element.bbox()

	    if (width == null)
	      width = box.width / box.height * height
	    else if (height == null)
	      height = box.height / box.width * width
	  }

	  return {
	    width:  width
	  , height: height
	  }
	}

	// Delta transform point
	function deltaTransformPoint(matrix, x, y) {
	  return {
	    x: x * matrix.a + y * matrix.c + 0
	  , y: x * matrix.b + y * matrix.d + 0
	  }
	}

	// Map matrix array to object
	function arrayToMatrix(a) {
	  return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] }
	}

	// Parse matrix if required
	function parseMatrix(matrix) {
	  if (!(matrix instanceof SVG.Matrix))
	    matrix = new SVG.Matrix(matrix)

	  return matrix
	}

	// Add centre point to transform object
	function ensureCentre(o, target) {
	  o.cx = o.cx == null ? target.bbox().cx : o.cx
	  o.cy = o.cy == null ? target.bbox().cy : o.cy
	}

	// Convert string to matrix
	function stringToMatrix(source) {
	  // remove matrix wrapper and split to individual numbers
	  source = source
	    .replace(SVG.regex.whitespace, '')
	    .replace(SVG.regex.matrix, '')
	    .split(SVG.regex.matrixElements)

	  // convert string values to floats and convert to a matrix-formatted object
	  return arrayToMatrix(
	    SVG.utils.map(source, function(n) {
	      return parseFloat(n)
	    })
	  )
	}

	// Calculate position according to from and to
	function at(o, pos) {
	  // number recalculation (don't bother converting to SVG.Number for performance reasons)
	  return typeof o.from == 'number' ?
	    o.from + (o.to - o.from) * pos :

	  // instance recalculation
	  o instanceof SVG.Color || o instanceof SVG.Number || o instanceof SVG.Matrix ? o.at(pos) :

	  // for all other values wait until pos has reached 1 to return the final value
	  pos < 1 ? o.from : o.to
	}

	// PathArray Helpers
	function arrayToString(a) {
	  for (var i = 0, il = a.length, s = ''; i < il; i++) {
	    s += a[i][0]

	    if (a[i][1] != null) {
	      s += a[i][1]

	      if (a[i][2] != null) {
	        s += ' '
	        s += a[i][2]

	        if (a[i][3] != null) {
	          s += ' '
	          s += a[i][3]
	          s += ' '
	          s += a[i][4]

	          if (a[i][5] != null) {
	            s += ' '
	            s += a[i][5]
	            s += ' '
	            s += a[i][6]

	            if (a[i][7] != null) {
	              s += ' '
	              s += a[i][7]
	            }
	          }
	        }
	      }
	    }
	  }

	  return s + ' '
	}

	// Deep new id assignment
	function assignNewId(node) {
	  // do the same for SVG child nodes as well
	  for (var i = node.childNodes.length - 1; i >= 0; i--)
	    if (node.childNodes[i] instanceof SVGElement)
	      assignNewId(node.childNodes[i])

	  return SVG.adopt(node).id(SVG.eid(node.nodeName))
	}

	// Add more bounding box properties
	function fullBox(b) {
	  if (b.x == null) {
	    b.x      = 0
	    b.y      = 0
	    b.width  = 0
	    b.height = 0
	  }

	  b.w  = b.width
	  b.h  = b.height
	  b.x2 = b.x + b.width
	  b.y2 = b.y + b.height
	  b.cx = b.x + b.width / 2
	  b.cy = b.y + b.height / 2

	  return b
	}

	// Get id from reference string
	function idFromReference(url) {
	  var m = url.toString().match(SVG.regex.reference)

	  if (m) return m[1]
	}

	// Create matrix array for looping
	var abcdef = 'abcdef'.split('')
	// Add CustomEvent to IE9 and IE10
	if (typeof CustomEvent !== 'function') {
	  // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
	  var CustomEvent = function(event, options) {
	    options = options || { bubbles: false, cancelable: false, detail: undefined }
	    var e = document.createEvent('CustomEvent')
	    e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail)
	    return e
	  }

	  CustomEvent.prototype = window.Event.prototype

	  window.CustomEvent = CustomEvent
	}

	// requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
	(function(w) {
	  var lastTime = 0
	  var vendors = ['moz', 'webkit']

	  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	    w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame']
	    w.cancelAnimationFrame  = w[vendors[x] + 'CancelAnimationFrame'] ||
	                              w[vendors[x] + 'CancelRequestAnimationFrame']
	  }

	  w.requestAnimationFrame = w.requestAnimationFrame ||
	    function(callback) {
	      var currTime = new Date().getTime()
	      var timeToCall = Math.max(0, 16 - (currTime - lastTime))

	      var id = w.setTimeout(function() {
	        callback(currTime + timeToCall)
	      }, timeToCall)

	      lastTime = currTime + timeToCall
	      return id
	    }

	  w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;

	}(window))

	return SVG

	}));

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.MouseMonitor = exports.Subscription = undefined;

	var _getPrototypeOf = __webpack_require__(57);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _possibleConstructorReturn2 = __webpack_require__(61);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(86);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _classCallCheck2 = __webpack_require__(94);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(95);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Subscription = exports.Subscription = function () {
	    function Subscription() {
	        (0, _classCallCheck3.default)(this, Subscription);

	        this.subscribers = [];
	    }

	    (0, _createClass3.default)(Subscription, [{
	        key: "subscribe",
	        value: function subscribe(func) {
	            this.subscribers.push(func);
	            return this;
	        }
	    }, {
	        key: "dispatch",
	        value: function dispatch() {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }

	            this.subscribers.forEach(function (subscriber) {
	                return subscriber.call.apply(subscriber, [null].concat(args));
	            });
	        }
	    }, {
	        key: "clear",
	        value: function clear() {
	            this.subscribers = [];
	        }
	    }]);
	    return Subscription;
	}();

	var MouseMonitor = exports.MouseMonitor = function (_Subscription) {
	    (0, _inherits3.default)(MouseMonitor, _Subscription);

	    function MouseMonitor() {
	        (0, _classCallCheck3.default)(this, MouseMonitor);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (MouseMonitor.__proto__ || (0, _getPrototypeOf2.default)(MouseMonitor)).call(this));

	        window.addEventListener("mousemove", _this._mousemoved.bind(_this), true);
	        // setTimeout(() => this.destroy(), 3000)
	        // this.destroy = () => window.removeEventListener('mousemove', onmove)
	        return _this;
	    }

	    (0, _createClass3.default)(MouseMonitor, [{
	        key: "curr",
	        value: function curr() {
	            return { cx: this.x, cy: this.y };
	        }
	    }, {
	        key: "_mousemoved",
	        value: function _mousemoved(_ref) {
	            var x = _ref.x,
	                y = _ref.y;

	            this.x = x;
	            this.y = y;
	            this.dispatch(x, y);
	        }
	    }]);
	    return MouseMonitor;
	}(Subscription);

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(58), __esModule: true };

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59);
	module.exports = __webpack_require__(11).Object.getPrototypeOf;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(46)
	  , $getPrototypeOf = __webpack_require__(45);

	__webpack_require__(60)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(9)
	  , core    = __webpack_require__(11)
	  , fails   = __webpack_require__(20);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(62);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(63);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(70);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(64), __esModule: true };

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(3);
	__webpack_require__(65);
	module.exports = __webpack_require__(69).f('iterator');

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	var global        = __webpack_require__(10)
	  , hide          = __webpack_require__(14)
	  , Iterators     = __webpack_require__(26)
	  , TO_STRING_TAG = __webpack_require__(44)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(67)
	  , step             = __webpack_require__(68)
	  , Iterators        = __webpack_require__(26)
	  , toIObject        = __webpack_require__(32);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(7)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 68 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(44);

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(71), __esModule: true };

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(72);
	__webpack_require__(83);
	__webpack_require__(84);
	__webpack_require__(85);
	module.exports = __webpack_require__(11).Symbol;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(10)
	  , has            = __webpack_require__(25)
	  , DESCRIPTORS    = __webpack_require__(19)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(24)
	  , META           = __webpack_require__(73).KEY
	  , $fails         = __webpack_require__(20)
	  , shared         = __webpack_require__(39)
	  , setToStringTag = __webpack_require__(43)
	  , uid            = __webpack_require__(40)
	  , wks            = __webpack_require__(44)
	  , wksExt         = __webpack_require__(69)
	  , wksDefine      = __webpack_require__(74)
	  , keyOf          = __webpack_require__(75)
	  , enumKeys       = __webpack_require__(76)
	  , isArray        = __webpack_require__(79)
	  , anObject       = __webpack_require__(16)
	  , toIObject      = __webpack_require__(32)
	  , toPrimitive    = __webpack_require__(22)
	  , createDesc     = __webpack_require__(23)
	  , _create        = __webpack_require__(28)
	  , gOPNExt        = __webpack_require__(80)
	  , $GOPD          = __webpack_require__(82)
	  , $DP            = __webpack_require__(15)
	  , $keys          = __webpack_require__(30)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(81).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(78).f  = $propertyIsEnumerable;
	  __webpack_require__(77).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(8)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(14)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(40)('meta')
	  , isObject = __webpack_require__(17)
	  , has      = __webpack_require__(25)
	  , setDesc  = __webpack_require__(15).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(20)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(10)
	  , core           = __webpack_require__(11)
	  , LIBRARY        = __webpack_require__(8)
	  , wksExt         = __webpack_require__(69)
	  , defineProperty = __webpack_require__(15).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(30)
	  , toIObject = __webpack_require__(32);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(30)
	  , gOPS    = __webpack_require__(77)
	  , pIE     = __webpack_require__(78);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 78 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(34);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(32)
	  , gOPN      = __webpack_require__(81).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(31)
	  , hiddenKeys = __webpack_require__(41).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(78)
	  , createDesc     = __webpack_require__(23)
	  , toIObject      = __webpack_require__(32)
	  , toPrimitive    = __webpack_require__(22)
	  , has            = __webpack_require__(25)
	  , IE8_DOM_DEFINE = __webpack_require__(18)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(19) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 83 */
/***/ function(module, exports) {

	

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(74)('asyncIterator');

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(74)('observable');

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(87);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(91);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(62);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(89);
	module.exports = __webpack_require__(11).Object.setPrototypeOf;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(9);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(90).set});

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(17)
	  , anObject = __webpack_require__(16);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(12)(Function.call, __webpack_require__(82).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(92), __esModule: true };

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(93);
	var $Object = __webpack_require__(11).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(28)});

/***/ },
/* 94 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(96);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(97), __esModule: true };

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(98);
	var $Object = __webpack_require__(11).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(19), 'Object', {defineProperty: __webpack_require__(15).f});

/***/ }
/******/ ])
});
;