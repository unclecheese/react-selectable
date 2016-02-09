(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["Selectable"] = factory(require("react"), require("react-dom"));
	else
		root["Selectable"] = factory(root["React"], root["ReactDOM"]);
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.createSelectable = exports.SelectableGroup = undefined;

	var _selectableGroup = __webpack_require__(1);

	var _selectableGroup2 = _interopRequireDefault(_selectableGroup);

	var _createSelectable = __webpack_require__(7);

	var _createSelectable2 = _interopRequireDefault(_createSelectable);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.SelectableGroup = _selectableGroup2.default;
	exports.createSelectable = _createSelectable2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _nodeInRoot = __webpack_require__(4);

	var _nodeInRoot2 = _interopRequireDefault(_nodeInRoot);

	var _getBoundsForNode = __webpack_require__(5);

	var _getBoundsForNode2 = _interopRequireDefault(_getBoundsForNode);

	var _doObjectsCollide = __webpack_require__(6);

	var _doObjectsCollide2 = _interopRequireDefault(_doObjectsCollide);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SelectableGroup = function (_React$Component) {
		_inherits(SelectableGroup, _React$Component);

		function SelectableGroup(props) {
			_classCallCheck(this, SelectableGroup);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SelectableGroup).call(this, props));

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
				_reactDom2.default.findDOMNode(this).addEventListener('mousedown', this._mouseDown);
			}

			/**	 
	   * Remove global event listeners
	   */

		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				_reactDom2.default.findDOMNode(this).removeEventListener('mousedown', this._mouseDown);
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
			}

			/**
	   * Called when a user presses the mouse button. Determines if a select box should
	   * be added, and if so, attach event listeners
	   */

		}, {
			key: '_mouseDown',
			value: function _mouseDown(e) {
				var node = _reactDom2.default.findDOMNode(this);
				var collides = undefined,
				    offsetData = undefined,
				    distanceData = undefined;
				_reactDom2.default.findDOMNode(this).addEventListener('mouseup', this._mouseUp);

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

				e.preventDefault();

				_reactDom2.default.findDOMNode(this).addEventListener('mousemove', this._openSelector);
			}

			/**
	   * Called when the user has completed selection
	   */

		}, {
			key: '_mouseUp',
			value: function _mouseUp(e) {
				_reactDom2.default.findDOMNode(this).removeEventListener('mousemove', this._openSelector);
				_reactDom2.default.findDOMNode(this).removeEventListener('mouseup', this._mouseUp);

				if (!this._mouseDownData) return;

				return this._selectElements(e);
			}

			/**
	   * Selects multiple children given x/y coords of the mouse
	   */

		}, {
			key: '_selectElements',
			value: function _selectElements(e) {
				this._mouseDownData = null;
				var currentItems = [];
				var selectbox = _reactDom2.default.findDOMNode(this.refs.selectbox);
				var tolerance = this.props.tolerance;

				if (!selectbox) return;

				this._registry.forEach(function (itemData) {
					if (itemData.domNode && (0, _doObjectsCollide2.default)(selectbox, itemData.domNode, tolerance)) {
						currentItems.push(itemData.key);
					}
				});

				this.setState({
					isBoxSelecting: false,
					boxWidth: 0,
					boxHeight: 0
				});

				this.props.onSelection(currentItems);
			}

			/**
	   * Renders the component
	   * @return {ReactComponent}
	   */

		}, {
			key: 'render',
			value: function render() {

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
					this.props.component,
					this.props,
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
		fixedPosition: _react2.default.PropTypes.bool

	};

	SelectableGroup.defaultProps = {
		onSelection: function onSelection() {},
		component: 'div',
		tolerance: 0,
		fixedPosition: false
	};

	SelectableGroup.childContextTypes = {
		selectable: _react2.default.PropTypes.object
	};

	exports.default = SelectableGroup;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var isNodeInRoot = function isNodeInRoot(node, root) {
	  while (node) {
	    if (node === root) {
	      return true;
	    }
	    node = node.parentNode;
	  }

	  return false;
	};

	exports.default = isNodeInRoot;

/***/ },
/* 5 */
/***/ function(module, exports) {

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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getBoundsForNode = __webpack_require__(5);

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

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

				return _possibleConstructorReturn(this, Object.getPrototypeOf(SelectableItem).apply(this, arguments));
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

/***/ }
/******/ ])
});
;