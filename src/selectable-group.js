import React from 'react';
import ReactDOM from 'react-dom';
import isNodeInRoot from './nodeInRoot';
import getBoundsForNode from './getBoundsForNode';
import doObjectsCollide from './doObjectsCollide';

class SelectableGroup extends React.Component {


	constructor (props) {
		super(props);

		this.state = {
			isBoxSelecting: false,
			boxWidth: 0,
			boxHeight: 0
		}

		this._mouseDownData = null;
		this._registry = [];

		// Used to prevent actions from firing twice on devices that are both click and touch enabled
		this._mouseDownStarted = false;
		this._mouseMoveStarted = false;
		this._mouseUpStarted = false;

		this._openSelector = this._openSelector.bind(this);
		this._mouseDown = this._mouseDown.bind(this);
		this._mouseUp = this._mouseUp.bind(this);
		this._selectElements = this._selectElements.bind(this);
		this._registerSelectable = this._registerSelectable.bind(this);
		this._unregisterSelectable = this._unregisterSelectable.bind(this);
		this._desktopEventCoords = this._desktopEventCoords.bind(this);

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
		ReactDOM.findDOMNode(this).addEventListener('mousedown', this._mouseDown);
		ReactDOM.findDOMNode(this).addEventListener('touchstart', this._mouseDown);		
	}
	

	/**	 
	 * Remove global event listeners
	 */
	componentWillUnmount () {		
		ReactDOM.findDOMNode(this).removeEventListener('mousedown', this._mouseDown);
		ReactDOM.findDOMNode(this).removeEventListener('touchstart', this._mouseDown);		
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
		if(this._mouseMoveStarted) return;
		this._mouseMoveStarted = true;

		e = this._desktopEventCoords(e);

	    const w = Math.abs(this._mouseDownData.initialW - e.pageX);
	    const h = Math.abs(this._mouseDownData.initialH - e.pageY);

	    this.setState({
	    	isBoxSelecting: true,
	    	boxWidth: w,
	    	boxHeight: h,
	    	boxLeft: Math.min(e.pageX, this._mouseDownData.initialW),
	    	boxTop: Math.min(e.pageY, this._mouseDownData.initialH)
	    }, () => {
	    	this._mouseMoveStarted = false;
	    });
	}


	/**
	 * Called when a user presses the mouse button. Determines if a select box should
	 * be added, and if so, attach event listeners
	 */
	_mouseDown (e) {
		if(this._mouseDownStarted) return;
		this._mouseDownStarted = true; 
		this._mouseUpStarted = false;

		e = this._desktopEventCoords(e);

		const node = ReactDOM.findDOMNode(this);
		let collides, offsetData, distanceData;		
		ReactDOM.findDOMNode(this).addEventListener('mouseup', this._mouseUp);
		ReactDOM.findDOMNode(this).addEventListener('touchend', this._mouseUp);
		
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
					top: e.pageY,
					left: e.pageX,
					offsetWidth: 0,
					offsetHeight: 0
				}
			);
			if(!collides) return;
		} 		

		this._mouseDownData = {			
			boxLeft: e.pageX,
			boxTop: e.pageY,
	        initialW: e.pageX,
        	initialH: e.pageY        	
		};		

		e.preventDefault();

		ReactDOM.findDOMNode(this).addEventListener('mousemove', this._openSelector);
		ReactDOM.findDOMNode(this).addEventListener('touchmove', this._openSelector);
	}


	/**
	 * Called when the user has completed selection
	 */
	_mouseUp (e) {
		if(this._mouseUpStarted) return;
		this._mouseUpStarted = true;
		this._mouseDownStarted = false;

	    ReactDOM.findDOMNode(this).removeEventListener('mousemove', this._openSelector);
	    ReactDOM.findDOMNode(this).removeEventListener('mouseup', this._mouseUp);
	    ReactDOM.findDOMNode(this).removeEventListener('touchmove', this._openSelector);
	    ReactDOM.findDOMNode(this).removeEventListener('touchend', this._mouseUp);

	    if(!this._mouseDownData) return;
	    
		return this._selectElements(e);			
	}


	/**
	 * Selects multiple children given x/y coords of the mouse
	 */
	_selectElements (e) {
	    this._mouseDownData = null;
	    const currentItems = [],
		      selectbox = ReactDOM.findDOMNode(this.refs.selectbox),
		      {tolerance} = this.props;

		if(!selectbox) return;
		
		this._registry.forEach(itemData => {			
			if(itemData.domNode && doObjectsCollide(selectbox, itemData.domNode, tolerance)) {
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
	 * Used to return event object with desktop (non-touch) format of event 
	 * coordinates, regardless of whether the action is from mobile or desktop.
	 */
	_desktopEventCoords (e){
		if(e.pageX==undefined || e.pageY==undefined){ // Touch-device
			e.pageX = e.targetTouches[0].pageX;
			e.pageY = e.targetTouches[0].pageY;
		}
		return e;
	}

	/**
	 * Renders the component
	 * @return {ReactComponent}
	 */
	render () {

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

		return (
			<this.props.component {...this.props}>				
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
	fixedPosition: React.PropTypes.bool

};

SelectableGroup.defaultProps = {
	onSelection: () => {},
	component: 'div',
	tolerance: 0,
	fixedPosition: false
};

SelectableGroup.childContextTypes = {
	selectable: React.PropTypes.object
};

export default SelectableGroup;
