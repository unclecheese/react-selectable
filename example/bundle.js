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

	'use strict';

	var _App = __webpack_require__(1);

	var _App2 = _interopRequireDefault(_App);

	var _sampleData = __webpack_require__(3);

	var _sampleData2 = _interopRequireDefault(_sampleData);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	ReactDOM.render(React.createElement(_App2.default, { items: _sampleData2.default }), document.getElementById('app'));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _Album = __webpack_require__(2);

	var _Album2 = _interopRequireDefault(_Album);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var _Selectable = Selectable;
	var SelectableGroup = _Selectable.SelectableGroup;
	var createSelectable = _Selectable.createSelectable;

	var isNodeInRoot = function isNodeInRoot(node, root) {
		while (node) {
			if (node === root) {
				return true;
			}
			node = node.parentNode;
		}

		return false;
	};

	var SelectableAlbum = createSelectable(_Album2.default);

	var App = function (_React$Component) {
		_inherits(App, _React$Component);

		function App(props) {
			_classCallCheck(this, App);

			var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

			_this.state = {
				selectedItems: [],
				tolerance: 0,
				distance: 0
			};

			_this.handleSelection = _this.handleSelection.bind(_this);
			_this.clearItems = _this.clearItems.bind(_this);
			_this.handleToleranceChange = _this.handleToleranceChange.bind(_this);
			return _this;
		}

		_createClass(App, [{
			key: 'componentDidMount',
			value: function componentDidMount() {
				document.addEventListener('click', this.clearItems);
			}
		}, {
			key: 'componentWillUnmount',
			value: function componentWillUnmount() {
				document.removeEventListener('click', this.clearItems);
			}
		}, {
			key: 'handleSelection',
			value: function handleSelection(keys) {
				this.setState({
					selectedItems: keys
				});
			}
		}, {
			key: 'clearItems',
			value: function clearItems(e) {
				if (!isNodeInRoot(e.target, this.refs.selectable)) {
					this.setState({
						selectedItems: []
					});
				}
			}
		}, {
			key: 'handleToleranceChange',
			value: function handleToleranceChange(e) {
				this.setState({
					tolerance: parseInt(e.target.value)
				});
			}
		}, {
			key: 'render',
			value: function render() {
				var _this2 = this;

				return React.createElement(
					'div',
					null,
					React.createElement(
						'h1',
						null,
						'React Selectable Demo'
					),
					React.createElement(
						'div',
						{ className: 'sidebar' },
						React.createElement(
							'div',
							{ className: 'info' },
							React.createElement(
								'strong',
								null,
								'Tolerance'
							),
							': ',
							React.createElement(
								'span',
								null,
								this.state.tolerance
							),
							React.createElement('br', null),
							React.createElement(
								'em',
								null,
								'The number of pixels that must be in the bounding box in order for an item to be selected.'
							),
							React.createElement(
								'p',
								null,
								React.createElement('input', { type: 'range', min: '0', max: '50', step: '1', onChange: this.handleToleranceChange, value: this.state.tolerance })
							),
							this.state.selectedItems.length > 0 && React.createElement(
								'h3',
								null,
								'You have selected the following items:'
							),
							this.state.selectedItems.length === 0 && React.createElement(
								'p',
								null,
								'Please select some items from the right by clicking and dragging a box around them.'
							),
							React.createElement(
								'ul',
								null,
								this.state.selectedItems.map(function (key, i) {
									return React.createElement(
										'li',
										{ key: i },
										this.props.items[key].title
									);
								}.bind(this))
							)
						)
					),
					React.createElement(
						SelectableGroup,
						{
							className: 'main',
							ref: 'selectable',
							onSelection: this.handleSelection,
							tolerance: this.state.tolerance,
							globalMouse: this.state.isGlobal,
							distance: this.state.distance },
						this.props.items.map(function (item, i) {
							var selected = _this2.state.selectedItems.indexOf(i) > -1;
							return React.createElement(SelectableAlbum, {
								selectableKey: i,
								key: i,
								title: item.title,
								year: item.year,
								selected: selected });
						})
					)
				);
			}
		}]);

		return App;
	}(React.Component);

	exports.default = App;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Album = function Album(_ref) {
		var selected = _ref.selected;
		var title = _ref.title;
		var year = _ref.year;

		var classes = selected ? 'item selected' : 'item';
		return React.createElement(
			'div',
			{ className: classes },
			React.createElement(
				'h2',
				null,
				title
			),
			React.createElement(
				'small',
				null,
				year
			)
		);
	};

	exports.default = Album;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var data = [{ title: 'My Aim is True', year: '1977' }, { title: "This Year's Model", year: '1978' }, { title: 'Armed Forces', year: '1979' }, { title: 'Get Happy', year: '1980' }, { title: 'Trust', year: '1981' }, { title: 'Almost Blue', year: '1981' }, { title: 'Imperial Bedroom', year: '1982' }, { title: 'Punch the Clock', year: '1983' }, { title: 'Goodbye Cruel World', year: '1984' }, { title: 'King of America', year: '1986' }, { title: 'Blood and Chocolate', year: '1986' }, { title: 'Spike', year: '1989' }, { title: 'Mighty Like a Rose', year: '1991' }, { title: 'The Juliette Letters', year: '1993' }, { title: 'Brutal Youth', year: '1994' }, { title: 'Kojak Variety', year: '1995' }, { title: 'All This Useless Beauty', year: '1996' }, { title: 'Painted from Memory', year: '1998' }, { title: 'When I Was Cruel', year: '2002' }, { title: 'North', year: '2003' }, { title: 'The Delivery Man', year: '2004' }, { title: 'The River in Reverse', year: '2006' }, { title: 'Momofuku', year: '2008' }, { title: 'Secret, Profane & Sugarcane', year: '2009' }, { title: 'National Ransom', year: '2009' }, { title: 'Wise Up Ghost', year: '2013' }];

	exports.default = data;

/***/ }
/******/ ]);