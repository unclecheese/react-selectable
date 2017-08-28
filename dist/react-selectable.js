(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("react"), require("react-dom")) : factory(root["React"], root["ReactDOM"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.nodeInRoot = exports.isNodeIn = exports.createSelectable = exports.SelectableGroup = undefined;

	var _selectableGroup = __webpack_require__(1);

	var _selectableGroup2 = _interopRequireDefault(_selectableGroup);

	var _createSelectable = __webpack_require__(9);

	var _createSelectable2 = _interopRequireDefault(_createSelectable);

	var _isNodeIn = __webpack_require__(5);

	var _isNodeIn2 = _interopRequireDefault(_isNodeIn);

	var _nodeInRoot = __webpack_require__(4);

	var _nodeInRoot2 = _interopRequireDefault(_nodeInRoot);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.SelectableGroup = _selectableGroup2.default;
	exports.createSelectable = _createSelectable2.default;
	exports.isNodeIn = _isNodeIn2.default;
	exports.nodeInRoot = _nodeInRoot2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _nodeInRoot = __webpack_require__(4);

	var _nodeInRoot2 = _interopRequireDefault(_nodeInRoot);

	var _isNodeIn = __webpack_require__(5);

	var _isNodeIn2 = _interopRequireDefault(_isNodeIn);

	var _getBoundsForNode = __webpack_require__(6);

	var _getBoundsForNode2 = _interopRequireDefault(_getBoundsForNode);

	var _doObjectsCollide = __webpack_require__(7);

	var _doObjectsCollide2 = _interopRequireDefault(_doObjectsCollide);

	var _lodash = __webpack_require__(8);

	var _lodash2 = _interopRequireDefault(_lodash);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SelectableGroup = function (_React$Component) {
		_inherits(SelectableGroup, _React$Component);

		function SelectableGroup(props) {
			_classCallCheck(this, SelectableGroup);

			var _this = _possibleConstructorReturn(this, (SelectableGroup.__proto__ || Object.getPrototypeOf(SelectableGroup)).call(this, props));

			_this.state = {
				isBoxSelecting: false,
				boxWidth: 0,
				boxHeight: 0
			};

			_this._mouseDownData = null;
			_this._registry = [];

			_this._openSelector = _this._openSelector.bind(_this);
			_this._mouseDown = _this._mouseDown.bind(_this);
			_this._mouseUp = _this._mouseUp.bind(_this);
			_this._selectElements = _this._selectElements.bind(_this);
			_this._registerSelectable = _this._registerSelectable.bind(_this);
			_this._unregisterSelectable = _this._unregisterSelectable.bind(_this);

			_this._throttledSelect = (0, _lodash2.default)(_this._selectElements, 50);
			return _this;
		}

		_createClass(SelectableGroup, [{
			key: 'getChildContext',
			value: function getChildContext() {
				return {
					selectable: {
						register: this._registerSelectable,
						unregister: this._unregisterSelectable
					}
				};
			}
		}, {
			key: 'componentDidMount',
			value: function componentDidMount() {
				this._applyMousedown(this.props.enabled);
			}

			/**
	   * Remove global event listeners
	   */

		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				this._applyMousedown(false);
			}
		}, {
			key: 'componentWillReceiveProps',
			value: function componentWillReceiveProps(nextProps) {
				if (nextProps.enabled !== this.props.enabled) {
					this._applyMousedown(nextProps.enabled);
				}
			}
		}, {
			key: '_registerSelectable',
			value: function _registerSelectable(key, domNode) {
				this._registry.push({ key: key, domNode: domNode });
			}
		}, {
			key: '_unregisterSelectable',
			value: function _unregisterSelectable(key) {
				this._registry = this._registry.filter(function (data) {
					return data.key !== key;
				});
			}
		}, {
			key: '_applyMousedown',
			value: function _applyMousedown(apply) {
				var funcName = apply ? 'addEventListener' : 'removeEventListener';
				_reactDom2.default.findDOMNode(this)[funcName]('mousedown', this._mouseDown);
			}

			/**
	   * Called while moving the mouse with the button down. Changes the boundaries
	   * of the selection box
	   */

		}, {
			key: '_openSelector',
			value: function _openSelector(e) {
				var w = Math.abs(this._mouseDownData.initialW - e.pageX);
				var h = Math.abs(this._mouseDownData.initialH - e.pageY);

				this.setState({
					isBoxSelecting: true,
					boxWidth: w,
					boxHeight: h,
					boxLeft: Math.min(e.pageX, this._mouseDownData.initialW),
					boxTop: Math.min(e.pageY, this._mouseDownData.initialH)
				});

				if (this.props.selectOnMouseMove) this._throttledSelect(e);
			}

			/**
	   * Called when a user presses the mouse button. Determines if a select box should
	   * be added, and if so, attach event listeners
	   */

		}, {
			key: '_mouseDown',
			value: function _mouseDown(e) {
				// Disable if target is control by react-dnd
				if ((0, _isNodeIn2.default)(e.target, function (node) {
					return !!node.draggable;
				})) return;

				var node = _reactDom2.default.findDOMNode(this);
				var collides = void 0,
				    offsetData = void 0,
				    distanceData = void 0;
				window.addEventListener('mouseup', this._mouseUp);

				// Right clicks
				if (e.which === 3 || e.button === 2) return;

				if (!(0, _nodeInRoot2.default)(e.target, node)) {
					offsetData = (0, _getBoundsForNode2.default)(node);
					collides = (0, _doObjectsCollide2.default)({
						top: offsetData.top,
						left: offsetData.left,
						bottom: offsetData.offsetHeight,
						right: offsetData.offsetWidth
					}, {
						top: e.pageY,
						left: e.pageX,
						offsetWidth: 0,
						offsetHeight: 0
					});
					if (!collides) return;
				}

				this._mouseDownData = {
					boxLeft: e.pageX,
					boxTop: e.pageY,
					initialW: e.pageX,
					initialH: e.pageY
				};

				if (this.props.preventDefault) e.preventDefault();

				window.addEventListener('mousemove', this._openSelector);
			}

			/**
	   * Called when the user has completed selection
	   */

		}, {
			key: '_mouseUp',
			value: function _mouseUp(e) {
				window.removeEventListener('mousemove', this._openSelector);
				window.removeEventListener('mouseup', this._mouseUp);

				if (!this._mouseDownData) return;

				// Mouse up when not box selecting is a heuristic for a "click"
				if (this.props.onNonItemClick && !this.state.isBoxSelecting) {
					if (!this._registry.some(function (_ref) {
						var domNode = _ref.domNode;
						return (0, _nodeInRoot2.default)(e.target, domNode);
					})) {
						this.props.onNonItemClick(e);
					}
				}

				this._selectElements(e);

				this._mouseDownData = null;
				this.setState({
					isBoxSelecting: false,
					boxWidth: 0,
					boxHeight: 0
				});
			}

			/**
	   * Selects multiple children given x/y coords of the mouse
	   */

		}, {
			key: '_selectElements',
			value: function _selectElements(e) {
				var currentItems = [],
				    selectbox = _reactDom2.default.findDOMNode(this.refs.selectbox),
				    tolerance = this.props.tolerance;


				if (!selectbox) return;

				this._registry.forEach(function (itemData) {
					if (itemData.domNode && (0, _doObjectsCollide2.default)(selectbox, itemData.domNode, tolerance)) {
						currentItems.push(itemData.key);
					}
				});

				this.props.onSelection(currentItems, e);
			}

			/**
	   * Renders the component
	   * @return {ReactComponent}
	   */

		}, {
			key: 'render',
			value: function render() {
				var Component = this.props.component;
				var filteredProps = Object.assign({}, this.props);
				delete filteredProps.onSelection;
				delete filteredProps.fixedPosition;
				delete filteredProps.selectOnMouseMove;
				delete filteredProps.component;
				delete filteredProps.tolerance;
				delete filteredProps.preventDefault;

				if (!this.props.enabled) {
					return _react2.default.createElement(
						Component,
						filteredProps,
						this.props.children
					);
				}

				var boxStyle = {
					left: this.state.boxLeft,
					top: this.state.boxTop,
					width: this.state.boxWidth,
					height: this.state.boxHeight,
					zIndex: 9000,
					position: this.props.fixedPosition ? 'fixed' : 'absolute',
					cursor: 'default'
				};

				var spanStyle = {
					backgroundColor: 'transparent',
					border: '1px dashed #999',
					width: '100%',
					height: '100%',
					float: 'left'
				};

				return _react2.default.createElement(
					Component,
					filteredProps,
					this.state.isBoxSelecting && _react2.default.createElement(
						'div',
						{ style: boxStyle, ref: 'selectbox' },
						_react2.default.createElement('span', { style: spanStyle })
					),
					this.props.children
				);
			}
		}]);

		return SelectableGroup;
	}(_react2.default.Component);

	SelectableGroup.propTypes = {

		/**
	  * Event that will fire when items are selected. Passes an array of keys
	  */
		onSelection: _react2.default.PropTypes.func,

		/**
	  * The component that will represent the Selectable DOM node
	  */
		component: _react2.default.PropTypes.node,

		/**
	  * Amount of forgiveness an item will offer to the selectbox before registering
	  * a selection, i.e. if only 1px of the item is in the selection, it shouldn't be
	  * included.
	  */
		tolerance: _react2.default.PropTypes.number,

		/**
	  * In some cases, it the bounding box may need fixed positioning, if your layout
	  * is relying on fixed positioned elements, for instance.
	  * @type boolean
	  */
		fixedPosition: _react2.default.PropTypes.bool,

		/**
	  * Enable to fire the onSelection callback while the mouse is moving. Throttled to 50ms
	  * for performance in IE/Edge
	  * @type boolean
	  */
		selectOnMouseMove: _react2.default.PropTypes.bool,

		/**
	 * Allows to enable/disable preventing the default action of the onmousedown event (with e.preventDefault).
	  * True by default. Disable if your app needs to capture this event for other functionalities.
	 * @type boolean
	 */
		preventDefault: _react2.default.PropTypes.bool,

		/**
	  * Triggered when the user clicks in the component, but not on an item, e.g. whitespace
	  * 
	  * @type {Function}
	  */
		onNonItemClick: _react2.default.PropTypes.func,

		/**
	  * If false, all of the selectble features are turned off.
	  * @type {[type]}
	  */
		enabled: _react2.default.PropTypes.bool

	};

	SelectableGroup.defaultProps = {
		onSelection: function onSelection() {},
		component: 'div',
		tolerance: 0,
		fixedPosition: false,
		selectOnMouseMove: false,
		preventDefault: true,
		enabled: true
	};

	SelectableGroup.childContextTypes = {
		selectable: _react2.default.PropTypes.object
	};

	exports.default = SelectableGroup;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _isNodeIn = __webpack_require__(5);

	var _isNodeIn2 = _interopRequireDefault(_isNodeIn);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isNodeInRoot = function isNodeInRoot(node, root) {
		return (0, _isNodeIn2.default)(node, function (currentNode) {
			return currentNode === root;
		});
	};

	exports.default = isNodeInRoot;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isNodeIn = function isNodeIn(node, predicate) {
	  if (typeof predicate !== 'function') {
	    throw new Error('isNodeIn second parameter must be a function');
	  }

	  var currentNode = node;
	  while (currentNode) {
	    if (predicate(currentNode)) {
	      return true;
	    }
	    currentNode = currentNode.parentNode;
	  }

	  return false;
	};

	exports.default = isNodeIn;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	/**
	 * Given a node, get everything needed to calculate its boundaries
	 * @param  {HTMLElement} node 
	 * @return {Object}
	 */
	exports.default = function (node) {
		var rect = node.getBoundingClientRect();

		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft,
			offsetWidth: node.offsetWidth,
			offsetHeight: node.offsetHeight
		};
	};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getBoundsForNode = __webpack_require__(6);

	var _getBoundsForNode2 = _interopRequireDefault(_getBoundsForNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Given offsets, widths, and heights of two objects, determine if they collide (overlap).
	 * @param  {int} aTop    The top position of the first object
	 * @param  {int} aLeft   The left position of the first object
	 * @param  {int} bTop    The top position of the second object
	 * @param  {int} bLeft   The left position of the second object
	 * @param  {int} aWidth  The width of the first object
	 * @param  {int} aHeight The height of the first object
	 * @param  {int} bWidth  The width of the second object
	 * @param  {int} bHeight The height of the second object
	 * @return {bool}
	 */
	var coordsCollide = function coordsCollide(aTop, aLeft, bTop, bLeft, aWidth, aHeight, bWidth, bHeight, tolerance) {
	  if (typeof tolerance === 'undefined') {
	    tolerance = 0;
	  }

	  return !(
	  // 'a' bottom doesn't touch 'b' top
	  aTop + aHeight - tolerance < bTop ||
	  // 'a' top doesn't touch 'b' bottom
	  aTop + tolerance > bTop + bHeight ||
	  // 'a' right doesn't touch 'b' left
	  aLeft + aWidth - tolerance < bLeft ||
	  // 'a' left doesn't touch 'b' right
	  aLeft + tolerance > bLeft + bWidth);
	};

	/**
	 * Given two objects containing "top", "left", "offsetWidth" and "offsetHeight"
	 * properties, determine if they collide. 
	 * @param  {Object|HTMLElement} a
	 * @param  {Object|HTMLElement} b	 
	 * @return {bool}
	 */

	exports.default = function (a, b, tolerance) {
	  var aObj = a instanceof HTMLElement ? (0, _getBoundsForNode2.default)(a) : a,
	      bObj = b instanceof HTMLElement ? (0, _getBoundsForNode2.default)(b) : b;

	  return coordsCollide(aObj.top, aObj.left, bObj.top, bObj.left, aObj.offsetWidth, aObj.offsetHeight, bObj.offsetWidth, bObj.offsetHeight, tolerance);
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) == 'object' && global && global.Object === Object && global;

	/** Detect free variable `self`. */
	var freeSelf = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeMin = Math.min;

	/**
	 * Gets the timestamp of the number of milliseconds that have elapsed since
	 * the Unix epoch (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @since 2.4.0
	 * @category Date
	 * @returns {number} Returns the timestamp.
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => Logs the number of milliseconds it took for the deferred invocation.
	 */
	var now = function now() {
	  return root.Date.now();
	};

	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed `func` invocations and a `flush` method to immediately invoke them.
	 * Provide `options` to indicate whether `func` should be invoked on the
	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
	 * with the last arguments provided to the debounced function. Subsequent
	 * calls to the debounced function return the result of the last `func`
	 * invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the debounced function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=false]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {number} [options.maxWait]
	 *  The maximum time `func` is allowed to be delayed before it's invoked.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // Avoid costly calculations while the window size is in flux.
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', debounced);
	 *
	 * // Cancel the trailing debounced invocation.
	 * jQuery(window).on('popstate', debounced.cancel);
	 */
	function debounce(func, wait, options) {
	  var lastArgs,
	      lastThis,
	      maxWait,
	      result,
	      timerId,
	      lastCallTime,
	      lastInvokeTime = 0,
	      leading = false,
	      maxing = false,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = toNumber(wait) || 0;
	  if (isObject(options)) {
	    leading = !!options.leading;
	    maxing = 'maxWait' in options;
	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }

	  function invokeFunc(time) {
	    var args = lastArgs,
	        thisArg = lastThis;

	    lastArgs = lastThis = undefined;
	    lastInvokeTime = time;
	    result = func.apply(thisArg, args);
	    return result;
	  }

	  function leadingEdge(time) {
	    // Reset any `maxWait` timer.
	    lastInvokeTime = time;
	    // Start the timer for the trailing edge.
	    timerId = setTimeout(timerExpired, wait);
	    // Invoke the leading edge.
	    return leading ? invokeFunc(time) : result;
	  }

	  function remainingWait(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime,
	        result = wait - timeSinceLastCall;

	    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
	  }

	  function shouldInvoke(time) {
	    var timeSinceLastCall = time - lastCallTime,
	        timeSinceLastInvoke = time - lastInvokeTime;

	    // Either this is the first call, activity has stopped and we're at the
	    // trailing edge, the system time has gone backwards and we're treating
	    // it as the trailing edge, or we've hit the `maxWait` limit.
	    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
	  }

	  function timerExpired() {
	    var time = now();
	    if (shouldInvoke(time)) {
	      return trailingEdge(time);
	    }
	    // Restart the timer.
	    timerId = setTimeout(timerExpired, remainingWait(time));
	  }

	  function trailingEdge(time) {
	    timerId = undefined;

	    // Only invoke if we have `lastArgs` which means `func` has been
	    // debounced at least once.
	    if (trailing && lastArgs) {
	      return invokeFunc(time);
	    }
	    lastArgs = lastThis = undefined;
	    return result;
	  }

	  function cancel() {
	    if (timerId !== undefined) {
	      clearTimeout(timerId);
	    }
	    lastInvokeTime = 0;
	    lastArgs = lastCallTime = lastThis = timerId = undefined;
	  }

	  function flush() {
	    return timerId === undefined ? result : trailingEdge(now());
	  }

	  function debounced() {
	    var time = now(),
	        isInvoking = shouldInvoke(time);

	    lastArgs = arguments;
	    lastThis = this;
	    lastCallTime = time;

	    if (isInvoking) {
	      if (timerId === undefined) {
	        return leadingEdge(lastCallTime);
	      }
	      if (maxing) {
	        // Handle invocations in a tight loop.
	        timerId = setTimeout(timerExpired, wait);
	        return invokeFunc(lastCallTime);
	      }
	    }
	    if (timerId === undefined) {
	      timerId = setTimeout(timerExpired, wait);
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  debounced.flush = flush;
	  return debounced;
	}

	/**
	 * Creates a throttled function that only invokes `func` at most once per
	 * every `wait` milliseconds. The throttled function comes with a `cancel`
	 * method to cancel delayed `func` invocations and a `flush` method to
	 * immediately invoke them. Provide `options` to indicate whether `func`
	 * should be invoked on the leading and/or trailing edge of the `wait`
	 * timeout. The `func` is invoked with the last arguments provided to the
	 * throttled function. Subsequent calls to the throttled function return the
	 * result of the last `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
	 * invoked on the trailing edge of the timeout only if the throttled function
	 * is invoked more than once during the `wait` timeout.
	 *
	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
	 *
	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
	 * for details over the differences between `_.throttle` and `_.debounce`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to throttle.
	 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
	 * @param {Object} [options={}] The options object.
	 * @param {boolean} [options.leading=true]
	 *  Specify invoking on the leading edge of the timeout.
	 * @param {boolean} [options.trailing=true]
	 *  Specify invoking on the trailing edge of the timeout.
	 * @returns {Function} Returns the new throttled function.
	 * @example
	 *
	 * // Avoid excessively updating the position while scrolling.
	 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
	 *
	 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
	 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
	 * jQuery(element).on('click', throttled);
	 *
	 * // Cancel the trailing throttled invocation.
	 * jQuery(window).on('popstate', throttled.cancel);
	 */
	function throttle(func, wait, options) {
	  var leading = true,
	      trailing = true;

	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  if (isObject(options)) {
	    leading = 'leading' in options ? !!options.leading : leading;
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }
	  return debounce(func, wait, {
	    'leading': leading,
	    'maxWait': wait,
	    'trailing': trailing
	  });
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
	}

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? other + '' : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
	}

	module.exports = throttle;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var createSelectable = function createSelectable(WrappedComponent) {
		var SelectableItem = function (_React$Component) {
			_inherits(SelectableItem, _React$Component);

			function SelectableItem() {
				_classCallCheck(this, SelectableItem);

				return _possibleConstructorReturn(this, (SelectableItem.__proto__ || Object.getPrototypeOf(SelectableItem)).apply(this, arguments));
			}

			_createClass(SelectableItem, [{
				key: 'componentDidMount',
				value: function componentDidMount() {
					this.context.selectable.register(this.props.selectableKey, _reactDom2.default.findDOMNode(this));
				}
			}, {
				key: 'componentWillUnmount',
				value: function componentWillUnmount() {
					this.context.selectable.unregister(this.props.selectableKey);
				}
			}, {
				key: 'render',
				value: function render() {
					return _react2.default.createElement(WrappedComponent, this.props, this.props.children);
				}
			}]);

			return SelectableItem;
		}(_react2.default.Component);

		SelectableItem.contextTypes = {
			selectable: _react2.default.PropTypes.object
		};

		SelectableItem.propTypes = {
			selectableKey: _react2.default.PropTypes.any.isRequired
		};

		return SelectableItem;
	};

	exports.default = createSelectable;

/***/ })
/******/ ])
});
;