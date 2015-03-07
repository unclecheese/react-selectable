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

	var data = __webpack_require__(1);
	var React = __webpack_require__(3);
	var Selectable = __webpack_require__(2);

	var App = React.createClass({
	  displayName: "App",

	  getInitialState: function getInitialState() {
	    return {
	      selectedItems: []
	    };
	  },

	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "h1",
	        null,
	        "React Selectable Demo"
	      ),
	      React.createElement(
	        "div",
	        { className: "sidebar" },
	        React.createElement(
	          "div",
	          { className: "info" },
	          this.state.selectedItems.length > 0 && React.createElement(
	            "h3",
	            null,
	            "You have selected the following items:"
	          ),
	          this.state.selectedItems.length === 0 && React.createElement(
	            "p",
	            null,
	            "Please select some items from the right. Click and drag your mouse to select multiple. Cmd/Ctrl-click to select non-adjacent items."
	          ),
	          React.createElement(
	            "ul",
	            null,
	            this.state.selectedItems.map((function (key, i) {
	              return React.createElement(
	                "li",
	                { key: i },
	                this.props.items[key].title
	              );
	            }).bind(this))
	          )
	        )
	      ),
	      React.createElement(
	        Selectable,
	        { className: "main", onSelection: this.handleSelection, tolerance: 100 },
	        this.props.items.map(function (item, i) {
	          return React.createElement(Item, { key: i, title: item.title, year: item.year });
	        })
	      )
	    );
	  },

	  handleSelection: function handleSelection(keys) {
	    this.setState({
	      selectedItems: keys
	    });
	  }
	});

	var Item = React.createClass({
	  displayName: "Item",

	  render: function render() {
	    var classes = this.props.selected ? "item selected" : "item";
	    return React.createElement(
	      "div",
	      { className: classes },
	      React.createElement(
	        "h2",
	        null,
	        this.props.title
	      ),
	      React.createElement(
	        "small",
	        null,
	        this.props.year
	      )
	    );
	  }
	});
	React.render(React.createElement(App, { items: data }), document.body);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = [{ title: "My Aim is True", year: "1977" }, { title: "This Year's Model", year: "1978" }, { title: "Armed Forces", year: "1979" }, { title: "Get Happy", year: "1980" }, { title: "Trust", year: "1981" }, { title: "Almost Blue", year: "1981" }, { title: "Imperial Bedroom", year: "1982" }, { title: "Punch the Clock", year: "1983" }, { title: "Goodbye Cruel World", year: "1984" }, { title: "King of America", year: "1986" }, { title: "Blood and Chocolate", year: "1986" }, { title: "Spike", year: "1989" }, { title: "Mighty Like a Rose", year: "1991" }, { title: "The Juliette Letters", year: "1993" }, { title: "Brutal Youth", year: "1994" }, { title: "Kojak Variety", year: "1995" }, { title: "All This Useless Beauty", year: "1996" }, { title: "Painted from Memory", year: "1998" }, { title: "When I Was Cruel", year: "2002" }, { title: "North", year: "2003" }, { title: "The Delivery Man", year: "2004" }, { title: "The River in Reverse", year: "2006" }, { title: "Momofuku", year: "2008" }, { title: "Secret, Profane & Sugarcane", year: "2009" }, { title: "National Ransom", year: "2009" }, { title: "Wise Up Ghost", year: "2013" }];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var React = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react/addons\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var cloneWithProps = React.addons.cloneWithProps;

	function isNodeInRoot(node, root) {
		while (node) {
			if (node === root) {
				return true;
			}
			node = node.parentNode;
		}

		return false;
	}

	var Selectable = React.createClass({
		displayName: "Selectable",

		propTypes: {
			onSelection: React.PropTypes.func,
			component: React.PropTypes.string,
			tolerance: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.number])
		},

		_mouseDownData: null,

		getInitialState: function getInitialState() {
			return {
				isBoxSelecting: false,
				persist: false,
				boxWidth: 0,
				boxHeight: 0,
				selectedItems: []
			};
		},

		getDefaultProps: function getDefaultProps() {
			return {
				onSelection: function onSelection() {},
				component: "div",
				tolerance: 0
			};
		},

		componentDidMount: function componentDidMount() {
			document.addEventListener("mousedown", this._mouseDown);
			document.addEventListener("keydown", this._keyListener);
			document.addEventListener("keyup", this._keyListener);
			document.addEventListener("click", this._clickListener);
		},

		componentWillUnmount: function componentWillUnmount() {
			document.removeEventListener("mousedown", this._mouseDown);
			document.removeEventListener("keydown", this._keyListener);
			document.removeEventListener("keyup", this._keyListener);
			document.removeEventListener("click", this._clickListener);
		},

		render: function render() {
			var boxStyle = {
				left: this.state.boxLeft,
				top: this.state.boxTop,
				width: this.state.boxWidth,
				height: this.state.boxHeight,
				zIndex: 9000,
				position: "absolute",
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
				React.Children.map(this.props.children, (function (child, i) {
					return cloneWithProps(child, {
						key: child.key || i,
						ref: "selectable_" + child.key,
						selected: this.state.selectedItems.indexOf(child.key) > -1
					});
				}).bind(this))
			);
		},

		_openSelector: function _openSelector(e) {
			var w = Math.abs(this._mouseDownData.initialW - e.pageX);
			var h = Math.abs(this._mouseDownData.initialH - e.pageY);

			this.setState({
				isBoxSelecting: true,
				boxWidth: w,
				boxHeight: h,
				boxLeft: Math.min(e.pageX, this._mouseDownData.initialW),
				boxTop: Math.min(e.pageY, this._mouseDownData.initialH),
				selectedItems: this.state.persist ? this.state.selectedItems : []
			});
		},

		_mouseDown: function _mouseDown(e) {
			var node = this.getDOMNode(),
			    collides;
			if (!isNodeInRoot(e.target, node)) {
				collides = this._objectsCollide(node, {
					top: e.pageY,
					left: e.pageX,
					offsetWidth: 0,
					offsetHeight: 0
				}, this.props.tolerance);

				if (!collides) {
					return;
				}
			}

			e.preventDefault();
			this._mouseDownData = {
				boxLeft: e.pageX,
				boxTop: e.pageY,
				initialW: e.pageX,
				initialH: e.pageY
			};

			document.addEventListener("mouseup", this._mouseUp);
			document.addEventListener("mousemove", this._openSelector);
		},

		_mouseUp: function _mouseUp(e) {
			e.preventDefault();

			document.removeEventListener("mousemove", this._openSelector);
			document.removeEventListener("mouseup", this._mouseUp);

			if (e.pageX === this._mouseDownData.initialW && e.pageY === this._mouseDownData.initialH) {
				return this._selectElement(e.pageX, e.pageY);
			}

			return this._selectElements(e);
		},

		_selectElement: function _selectElement(x, y) {
			var currentItems = this.state.selectedItems,
			    index;

			React.Children.forEach(this.props.children, (function (child) {
				var node = this.refs["selectable_" + child.key].getDOMNode();
				var collision = this._objectsCollide(node, {
					top: y,
					left: x,
					offsetWidth: 0,
					offsetHeight: 0
				});

				if (collision) {
					index = currentItems.indexOf(child.key);
					if (this.state.persist) {
						if (index > -1) {
							currentItems.splice(index, 1);
						} else {
							currentItems.push(child.key);
						}
					} else {
						currentItems = [child.key];
					}
				}
			}).bind(this));

			this._mouseDownData = null;

			this.setState({
				isBoxSelecting: false,
				boxWidth: 0,
				boxHeight: 0,
				selectedItems: currentItems
			});

			this.props.onSelection(currentItems);
		},

		_selectElements: function _selectElements(e) {
			var currentItems = this.state.selectedItems;

			this._mouseDownData = null;

			React.Children.forEach(this.props.children, (function (child) {
				var collision = this._objectsCollide(this.refs["selectable_" + child.key].getDOMNode(), this.refs.selectbox.getDOMNode());
				if (collision) {
					currentItems.push(child.key);
				}
			}).bind(this));

			this.setState({
				isBoxSelecting: false,
				boxWidth: 0,
				boxHeight: 0,
				selectedItems: currentItems
			});

			this.props.onSelection(currentItems);
		},

		_getBoundsForNode: function _getBoundsForNode(node) {
			var rect = node.getBoundingClientRect();

			return {
				top: rect.top + document.body.scrollTop,
				left: rect.left + document.body.scrollLeft,
				offsetWidth: node.offsetWidth,
				offsetHeight: node.offsetHeight
			};
		},

		_objectsCollide: function _objectsCollide(a, b, tolerance) {
			var aObj = a instanceof HTMLElement ? this._getBoundsForNode(a) : a,
			    bObj = b instanceof HTMLElement ? this._getBoundsForNode(b) : b;

			if (!tolerance) {
				tolerance = 0;
			}

			if (typeof tolerance !== "object") {
				tolerance = { top: tolerance, left: tolerance, right: tolerance, bottom: tolerance };
			}

			return this._coordsCollide(aObj.top - tolerance.top, aObj.left - tolerance.top, bObj.top, bObj.left, aObj.offsetHeight + tolerance.bottom, aObj.offsetWidth + tolerance.right, bObj.offsetWidth, bObj.offsetHeight);
		},

		_coordsCollide: function _coordsCollide(aTop, aLeft, bTop, bLeft, aWidth, aHeight, bWidth, bHeight) {
			return !(aTop + aHeight < bTop || aTop > bTop + bHeight || aLeft + aWidth < bLeft || aLeft > bLeft + bWidth);
		},

		_keyListener: function _keyListener(e) {
			this.setState({
				persist: !!e.metaKey
			});
		},

		_clickListener: function _clickListener(e) {
			if (isNodeInRoot(e.target, this.getDOMNode())) {
				return;
			}this.setState({
				selectedItems: []
			});

			this.props.onSelection([]);
		}

	});

	module.exports = Selectable;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./lib/React\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

/***/ }
/******/ ]);