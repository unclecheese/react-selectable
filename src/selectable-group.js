import React from 'react';
import ReactDOM from 'react-dom';
import isNodeInRoot from './nodeInRoot';
import isNodeIn from './isNodeIn';
import getBoundsForNode from './getBoundsForNode';
import doObjectsCollide from './doObjectsCollide';
import throttle from 'lodash.throttle';

class SelectableGroup extends React.Component {


	constructor (props) {
		super(props);

		this.state = {
			isBoxSelecting: false,
			boxWidth: 0,
			boxHeight: 0
		}

		this._mouseDownData = null;
		this._rect = null;
		this._registry = [];

		this._openSelector = this._openSelector.bind(this);
		this._mouseDown = this._mouseDown.bind(this);
		this._mouseUp = this._mouseUp.bind(this);
		this._selectElements = this._selectElements.bind(this);
		this._registerSelectable = this._registerSelectable.bind(this);
		this._unregisterSelectable = this._unregisterSelectable.bind(this);
		this._throttledSelect = throttle(this._selectElements, 50);
	}


	getChildContext () {
		return {
			selectable: {
				register: this._registerSelectable,
				unregister: this._unregisterSelectable
			}
		};
	}


	componentDidMount () {
		document.addEventListener('mousedown', this._mouseDown);
		this._rect = this._getInitialCoordinates();
	}

	/**
	 * Remove global event listeners
	 */
	componentWillUnmount () {
		document.removeEventListener('mousedown', this._mouseDown);
	}

	_getInitialCoordinates() {
	    const style = window.getComputedStyle(document.body);
		const t = style.getPropertyValue('margin-top');
	    const l = style.getPropertyValue('margin-left');
		const mLeft = parseInt(l.slice(0, l.length - 2), 10);
		const mTop = parseInt(t.slice(0, t.length - 2), 10);

		const bodyRect = document.body.getBoundingClientRect();
	    const elemRect = ReactDOM.findDOMNode(this).getBoundingClientRect();
		return { x: Math.round(elemRect.left - bodyRect.left + mLeft) , y: Math.round(elemRect.top - bodyRect.top + mTop) }
	}

	_registerSelectable (key, domNode) {
		this._registry.push({key, domNode});
	}


	_unregisterSelectable (key) {
		this._registry = this._registry.filter(data => data.key !== key);
	}


	/**
	 * Called while moving the mouse with the button down. Changes the boundaries
	 * of the selection box
	 */
	_openSelector (e) {
	    const w = Math.abs(this._mouseDownData.initialW - e.pageX + this._rect.x);
	    const h = Math.abs(this._mouseDownData.initialH - e.pageY + this._rect.y);
	    this.setState({
	    	isBoxSelecting: true,
	    	boxWidth: w,
	    	boxHeight: h,
	    	boxLeft: Math.min(e.pageX - this._rect.x, this._mouseDownData.initialW),
	    	boxTop: Math.min(e.pageY - this._rect.y, this._mouseDownData.initialH)
	    });

		if (this.props.selectOnMouseMove) this._throttledSelect(e);
	}


	/**
	 * Called when a user presses the mouse button. Determines if a select box should
	 * be added, and if so, attach event listeners
	 */
	_mouseDown (e) {
		// Disable if target is control by react-dnd
		if (isNodeIn(e.target, node => !!node.draggable)) return;

		const node = ReactDOM.findDOMNode(this);
		let collides, offsetData, distanceData;
		document.addEventListener('mouseup', this._mouseUp);

		// Right clicks
		if(e.which === 3 || e.button === 2) return;

		if(!isNodeInRoot(e.target, node)) {
			offsetData = getBoundsForNode(node);
			collides = doObjectsCollide(
				{
					top: offsetData.top,
					left: offsetData.left,
					bottom: offsetData.offsetHeight,
					right: offsetData.offsetWidth
				},
				{
					top: e.pageY - this._rect.y,
					left: e.pageX - this._rect.x,
					offsetWidth: 0,
					offsetHeight: 0
				}
			);
			if(!collides) return;
		}
		this._rect = this._getInitialCoordinates();
		this._mouseDownData = {
			boxLeft: e.pageX - this._rect.x,
			boxTop: e.pageY - this._rect.y,
	        initialW: e.pageX - this._rect.x,
        	initialH: e.pageY - this._rect.y
		};

		if(this.props.preventDefault) e.preventDefault();

		document.addEventListener('mousemove', this._openSelector);
	}


	/**
	 * Called when the user has completed selection
	 */
	_mouseUp (e) {
		e.stopPropagation();
	    document.removeEventListener('mousemove', this._openSelector);
	    document.removeEventListener('mouseup', this._mouseUp);
		// debugger;
	    if(!this._mouseDownData) return;

	    // Mouse up when not box selecting is a heuristic for a "click"
		if (this.props.onNonItemClick && !this.state.isBoxSelecting) {
			if (!this._registry.some(({ domNode }) => isNodeInRoot(e.target, domNode))) {
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
	_selectElements (e) {
	    const currentItems = [],
		      selectbox = ReactDOM.findDOMNode(this.refs.selectbox),
		      {tolerance} = this.props;

		if(!selectbox) return;

		this._registry.forEach(itemData => {
			if(itemData.domNode && doObjectsCollide(selectbox, itemData.domNode, tolerance)) {
				currentItems.push(itemData.key);
			}
		});

		this.props.onSelection(currentItems, e);
	}


	/**
	 * Renders the component
	 * @return {ReactComponent}
	 */
	render () {
		const wrapperStyle = {
			position: 'relative',
			overflow: 'visible'
		};

		const boxStyle = {
			left: this.state.boxLeft,
			top: this.state.boxTop,
			width: this.state.boxWidth,
			height: this.state.boxHeight,
			zIndex: 9000,
			position: this.props.fixedPosition ? 'fixed' : 'absolute',
			cursor: 'default'
		};

		const spanStyle = {
			backgroundColor: 'transparent',
			border: '1px dashed #999',
			width: '100%',
			height: '100%',
			float: 'left'
		};

		const filteredProps = Object.assign({}, this.props);
        delete filteredProps.onSelection;
        delete filteredProps.fixedPosition;
        delete filteredProps.selectOnMouseMove;
        delete filteredProps.component;
        delete filteredProps.tolerance;
        delete filteredProps.preventDefault;

        return (
            <this.props.component {...filteredProps} style={wrapperStyle}>
                {this.state.isBoxSelecting &&
                  <div style={boxStyle} ref="selectbox"><span style={spanStyle}></span></div>
                }
                {this.props.children}
            </this.props.component>
        );
	}
}

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
	fixedPosition: React.PropTypes.bool,

	/**
	 * Enable to fire the onSelection callback while the mouse is moving. Throttled to 50ms
	 * for performance in IE/Edge
	 * @type boolean
	 */
	selectOnMouseMove: React.PropTypes.bool,

    /**
	 * Allows to enable/disable preventing the default action of the onmousedown event (with e.preventDefault).
     * True by default. Disable if your app needs to capture this event for other functionalities.
	 * @type boolean
	 */
    preventDefault: React.PropTypes.bool,

    /**
     * Triggered when the user clicks in the component, but not on an item, e.g. whitespace
     * 
     * @type {Function}
     */
    onNonItemClick: React.PropTypes.func,

};

SelectableGroup.defaultProps = {
	onSelection: () => {},
	component: 'div',
	tolerance: 0,
	fixedPosition: false,
	selectOnMouseMove: false,
    preventDefault: true
};

SelectableGroup.childContextTypes = {
	selectable: React.PropTypes.object
};

export default SelectableGroup;
