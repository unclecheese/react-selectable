var Selectable =
/******/ (function(modules) { // webpackBootstrap
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

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var SelectableGroup = _interopRequire(__webpack_require__(1));

	var createSelectable = _interopRequire(__webpack_require__(2));

	exports.SelectableGroup = SelectableGroup;
	exports.createSelectable = createSelectable;
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var React = _interopRequire(__webpack_require__(3));

	var ReactDOM = _interopRequire(__webpack_require__(4));

	var isNodeInRoot = _interopRequire(__webpack_require__(5));

	var getBoundsForNode = _interopRequire(__webpack_require__(6));

	var doObjectsCollide = _interopRequire(__webpack_require__(7));

	var SelectableGroup = (function (_React$Component) {
		function SelectableGroup(props) {
			_classCallCheck(this, SelectableGroup);

			_get(Object.getPrototypeOf(SelectableGroup.prototype), "constructor", this).call(this, props);

			this.state = {
				isBoxSelecting: false,
				boxWidth: 0,
				boxHeight: 0
			};

			this._mouseDownData = null;
			this._registry = [];

			this._openSelector = this._openSelector.bind(this);
			this._mouseDown = this._mouseDown.bind(this);
			this._mouseUp = this._mouseUp.bind(this);
			this._selectElements = this._selectElements.bind(this);
			this._registerSelectable = this._registerSelectable.bind(this);
			this._unregisterSelectable = this._unregisterSelectable.bind(this);
		}

		_inherits(SelectableGroup, _React$Component);

		_createClass(SelectableGroup, {
			getChildContext: {
				value: function getChildContext() {
					return {
						selectable: {
							register: this._registerSelectable,
							unregister: this._unregisterSelectable
						}
					};
				}
			},
			componentDidMount: {
				value: function componentDidMount() {
					ReactDOM.findDOMNode(this).addEventListener("mousedown", this._mouseDown);
				}
			},
			componentWillUnmount: {

				/**	 
	    * Remove global event listeners
	    */

				value: function componentWillUnmount() {
					ReactDOM.findDOMNode(this).removeEventListener("mousedown", this._mouseDown);
				}
			},
			_registerSelectable: {
				value: function _registerSelectable(key, domNode) {
					this._registry.push({ key: key, domNode: domNode });
				}
			},
			_unregisterSelectable: {
				value: function _unregisterSelectable(key) {
					this._registry = this._registry.filter(function (data) {
						return data.key !== key;
					});
				}
			},
			_openSelector: {

				/**
	    * Called while moving the mouse with the button down. Changes the boundaries
	    * of the selection box
	    */

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
			},
			_mouseDown: {

				/**
	    * Called when a user presses the mouse button. Determines if a select box should
	    * be added, and if so, attach event listeners
	    */

				value: function _mouseDown(e) {
					var node = ReactDOM.findDOMNode(this);
					var collides = undefined,
					    offsetData = undefined,
					    distanceData = undefined;
					ReactDOM.findDOMNode(this).addEventListener("mouseup", this._mouseUp);

					// Right clicks
					if (e.which === 3 || e.button === 2) {
						return;
					}if (!isNodeInRoot(e.target, node)) {
						offsetData = getBoundsForNode(node);
						collides = doObjectsCollide({
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
						if (!collides) {
							return;
						}
					}

					this._mouseDownData = {
						boxLeft: e.pageX,
						boxTop: e.pageY,
						initialW: e.pageX,
						initialH: e.pageY
					};

					e.preventDefault();

					ReactDOM.findDOMNode(this).addEventListener("mousemove", this._openSelector);
				}
			},
			_mouseUp: {

				/**
	    * Called when the user has completed selection
	    */

				value: function _mouseUp(e) {
					ReactDOM.findDOMNode(this).removeEventListener("mousemove", this._openSelector);
					ReactDOM.findDOMNode(this).removeEventListener("mouseup", this._mouseUp);

					if (!this._mouseDownData) {
						return;
					}return this._selectElements(e);
				}
			},
			_selectElements: {

				/**
	    * Selects multiple children given x/y coords of the mouse
	    */

				value: function _selectElements(e) {
					this._mouseDownData = null;
					var currentItems = [];
					var selectbox = ReactDOM.findDOMNode(this.refs.selectbox);var tolerance = this.props.tolerance;

					if (!selectbox) {
						return;
					}this._registry.forEach(function (itemData) {
						if (itemData.domNode && doObjectsCollide(selectbox, itemData.domNode, tolerance)) {
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
			},
			render: {

				/**
	    * Renders the component
	    * @return {ReactComponent}
	    */

				value: function render() {

					var boxStyle = {
						left: this.state.boxLeft,
						top: this.state.boxTop,
						width: this.state.boxWidth,
						height: this.state.boxHeight,
						zIndex: 9000,
						position: this.props.fixedPosition ? "fixed" : "absolute",
						cursor: "default"
					};

					var spanStyle = {
						backgroundColor: "transparent",
						border: "1px dashed #999",
						width: "100%",
						height: "100%",
						float: "left"
					};

					return React.createElement(
						this.props.component,
						this.props,
						this.state.isBoxSelecting && React.createElement(
							"div",
							{ style: boxStyle, ref: "selectbox" },
							React.createElement("span", { style: spanStyle })
						),
						this.props.children
					);
				}
			}
		});

		return SelectableGroup;
	})(React.Component);

	SelectableGroup.propTypes = {

		/**
	  * Event that will fire when items are selected. Passes an array of keys		 
	  */
		onSelection: React.PropTypes.func,

		/**
	  * The component that will represent the Selectable DOM node		 
	  */
		component: React.PropTypes.node,

		/**
	  * Amount of forgiveness an item will offer to the selectbox before registering
	  * a selection, i.e. if only 1px of the item is in the selection, it shouldn't be 
	  * included.		 
	  */
		tolerance: React.PropTypes.number,

		/**
	  * In some cases, it the bounding box may need fixed positioning, if your layout
	  * is relying on fixed positioned elements, for instance.
	  * @type boolean
	  */
		fixedPosition: React.PropTypes.bool

	};

	SelectableGroup.defaultProps = {
		onSelection: function () {},
		component: "div",
		tolerance: 0,
		fixedPosition: false
	};

	SelectableGroup.childContextTypes = {
		selectable: React.PropTypes.object
	};

	module.exports = SelectableGroup;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var React = _interopRequire(__webpack_require__(3));

	var ReactDOM = _interopRequire(__webpack_require__(4));

	var createSelectable = function (WrappedComponent) {
		var SelectableItem = (function (_React$Component) {
			function SelectableItem() {
				_classCallCheck(this, SelectableItem);

				if (_React$Component != null) {
					_React$Component.apply(this, arguments);
				}
			}

			_inherits(SelectableItem, _React$Component);

			_createClass(SelectableItem, {
				componentDidMount: {
					value: function componentDidMount() {
						this.context.selectable.register(this.props.selectableKey, ReactDOM.findDOMNode(this));
					}
				},
				componentWillUnmount: {
					value: function componentWillUnmount() {
						this.context.selectable.unregister(this.props.selectableKey);
					}
				},
				render: {
					value: function render() {
						return React.createElement(WrappedComponent, this.props, this.props.children);
					}
				}
			});

			return SelectableItem;
		})(React.Component);

		SelectableItem.contextTypes = {
			selectable: React.PropTypes.object
		};

		SelectableItem.propTypes = {
			selectableKey: React.PropTypes.any.isRequired
		};

		return SelectableItem;
	};

	module.exports = createSelectable;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = ReactDOM;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var isNodeInRoot = function (node, root) {
	  while (node) {
	    if (node === root) {
	      return true;
	    }
	    node = node.parentNode;
	  }

	  return false;
	};

	module.exports = isNodeInRoot;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	/**
	 * Given a node, get everything needed to calculate its boundaries
	 * @param  {HTMLElement} node 
	 * @return {Object}
	 */

	module.exports = function (node) {
		var rect = node.getBoundingClientRect();

		return {
			top: rect.top + document.body.scrollTop,
			left: rect.left + document.body.scrollLeft,
			offsetWidth: node.offsetWidth,
			offsetHeight: node.offsetHeight
		};
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var getBoundsForNode = _interopRequire(__webpack_require__(6));

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
	var coordsCollide = function (aTop, aLeft, bTop, bLeft, aWidth, aHeight, bWidth, bHeight, tolerance) {
	  if (typeof tolerance === "undefined") {
	    tolerance = 0;
	  }

	  return !(
	  // 'a' bottom doesn't touch 'b' top
	  aTop + aHeight - tolerance < bTop || aTop + tolerance > bTop + bHeight || aLeft + aWidth - tolerance < bLeft || aLeft + tolerance > bLeft + bWidth);
	};

	/**
	 * Given two objects containing "top", "left", "offsetWidth" and "offsetHeight"
	 * properties, determine if they collide. 
	 * @param  {Object|HTMLElement} a
	 * @param  {Object|HTMLElement} b	 
	 * @return {bool}
	 */

	module.exports = function (a, b, tolerance) {
	  var aObj = a instanceof HTMLElement ? getBoundsForNode(a) : a,
	      bObj = b instanceof HTMLElement ? getBoundsForNode(b) : b;

	  return coordsCollide(aObj.top, aObj.left, bObj.top, bObj.left, aObj.offsetWidth, aObj.offsetHeight, bObj.offsetWidth, bObj.offsetHeight, tolerance);
	};

	// 'a' top doesn't touch 'b' bottom

	// 'a' right doesn't touch 'b' left

	// 'a' left doesn't touch 'b' right

/***/ }
/******/ ]);