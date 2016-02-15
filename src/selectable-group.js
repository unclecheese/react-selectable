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
			boxHeight: 0,
			currentItems: []			
		}

		this._mouseDownData = null;
		this._registry = [];

		this._openSelector = this._openSelector.bind(this);
		this._click = this._click.bind(this);
		this._mouseDown = this._mouseDown.bind(this);
		this._mouseUp = this._mouseUp.bind(this);
		this._selectElements = this._selectElements.bind(this);
		this._registerSelectable = this._registerSelectable.bind(this);
		this._unregisterSelectable = this._unregisterSelectable.bind(this);
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
		ReactDOM.findDOMNode(this).addEventListener('click', this._click);	
		ReactDOM.findDOMNode(this).addEventListener('mousedown', this._mouseDown);	
	}
	

	/**	 
	 * Remove global event listeners
	 */
	componentWillUnmount () {
		ReactDOM.findDOMNode(this).removeEventListener('click', this._click);
		ReactDOM.findDOMNode(this).removeEventListener('mousedown', this._mouseDown);		
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
	    const w = Math.abs(this._mouseDownData.initialW - e.pageX);
	    const h = Math.abs(this._mouseDownData.initialH - e.pageY);

	    this.setState({
	    	isBoxSelecting: true,
	    	boxWidth: w,
	    	boxHeight: h,
	    	boxLeft: Math.min(e.pageX, this._mouseDownData.initialW),
	    	boxTop: Math.min(e.pageY, this._mouseDownData.initialH)
	    });
	}

	/**
	 * Called when a user clicks on an item. Selects the clicked item.
	 */
	_click (e) {
		
		// We breifly open the selector to capture the position of the clicked item
		this._mouseDownData = {
			boxLeft: e.pageX,
			boxTop: e.pageY,
			initialW: e.pageX,
			initialH: e.pageY
		};
		this._openSelector(e);

		const node = ReactDOM.findDOMNode(this);
		
		const {tolerance, dontClearSelection} = this.props,
	    	  selectbox = ReactDOM.findDOMNode(this.refs.selectbox);

		// Right clicks
		if(e.which === 3 || e.button === 2) return;

		var newItems = []; // For holding the clicked item

		if(!dontClearSelection){ // Clear exisiting selections
			this._clearSelections();
		}else{
			newItems = this.state.currentItems;
		}

		this._registry.forEach(itemData => {			
			if(itemData.domNode && doObjectsCollide(selectbox, itemData.domNode, tolerance)) {
				if(!dontClearSelection){
					newItems.push(itemData.key); // Only clicked item will be selected now
				}else{ // Toggle item selection
					if(newItems.indexOf(itemData.key) == -1){ // Not selected currently, mark item as selected
						newItems.push(itemData.key);
					}else{ // Selected currently, mark item as unselected
						var index = newItems.indexOf(itemData.key);
						newItems.splice(index, 1);
					}
				}
			}
		});

		// Close selector and update currently selected items
		this.setState({
	    	isBoxSelecting: false,
	    	boxWidth: 0,
	    	boxHeight: 0,
	    	currentItems: newItems
	    });

	    this.props.onSelection(this.state.currentItems);

		e.preventDefault();
	}

	/**
	 * Called when a user presses the mouse button. Determines if a select box should
	 * be added, and if so, attach event listeners
	 */
	_mouseDown (e) {
		const node = ReactDOM.findDOMNode(this);
		let collides, offsetData, distanceData;		
		ReactDOM.findDOMNode(this).addEventListener('mouseup', this._mouseUp);
		
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
	}


	/**
	 * Called when the user has completed selection
	 */
	_mouseUp (e) {
	    ReactDOM.findDOMNode(this).removeEventListener('mousemove', this._openSelector);
	    ReactDOM.findDOMNode(this).removeEventListener('mouseup', this._mouseUp);

	    if(!this._mouseDownData) return;
	    
		return this._selectElements(e);			
	}


	/**
	 * Selects multiple children given x/y coords of the mouse
	 */
	_selectElements (e) {
	    this._mouseDownData = null;
	    
	    const {tolerance, dontClearSelection} = this.props,
	    	  selectbox = ReactDOM.findDOMNode(this.refs.selectbox);
		
		if(!dontClearSelection){ // Clear old selection if feature is not enabled
			this._clearSelections();
		}

		if(!selectbox) return;
		
		var newItems = [];
		var allNewItemsAlreadySelected = true; // Book keeping for dontClearSelection feature
		
		this._registry.forEach(itemData => {			
			if(itemData.domNode && doObjectsCollide(selectbox, itemData.domNode, tolerance)) {
				newItems.push(itemData.key);
				if(this.state.currentItems.indexOf(itemData.key) == -1 && dontClearSelection){
					allNewItemsAlreadySelected = false;
				}
			}
		});

		var newCurrentItems = [];
		if(!dontClearSelection||!allNewItemsAlreadySelected){ // dontClearSelection is not enabled or (it is) 
															  // and newItems should be added to the selection
			newCurrentItems = this.state.currentItems.concat(newItems);
		}else{
			newCurrentItems = this.state.currentItems.filter(function(i) {return newItems.indexOf(i) < 0;}); // Delete newItems from _currentItems
		}

		this.setState({
			isBoxSelecting: false,
			boxWidth: 0,
			boxHeight: 0,
			currentItems: newCurrentItems
		});

		this.props.onSelection(this.state.currentItems);
	}
	
	/**
	 * Unselects all items, clearing this.state.currentItems
	 */
	_clearSelections (){
		this.state.currentItems = [];
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
	fixedPosition: React.PropTypes.bool,
	
	/**
	 * Don't clear current selected items before next selection
	 */
	dontClearSelection: React.PropTypes.bool
 
};

SelectableGroup.defaultProps = {
	onSelection: () => {},
	component: 'div',
	tolerance: 0,
	fixedPosition: false,
	dontClearSelection: false
};

SelectableGroup.childContextTypes = {
	selectable: React.PropTypes.object
};

export default SelectableGroup;
