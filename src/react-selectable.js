var React = require('react/addons');
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


	propTypes: {
		onSelection: React.PropTypes.func,
		component: React.PropTypes.string,
		tolerance: React.PropTypes.oneOfType([
			React.PropTypes.object,
			React.PropTypes.number
		])
	},


	_mouseDownData: null,


	getInitialState: function() {
		return {
			isBoxSelecting: false,
			persist: false,
			boxWidth: 0,
			boxHeight: 0,
			selectedItems: []
		};
	},


	getDefaultProps: function() {
		return {
			onSelection: function () {},
			component: 'div',
			tolerance: 0
		};
	},


	componentDidMount: function() {
		document.addEventListener('mousedown', this._mouseDown);
		document.addEventListener('keydown', this._keyListener);
		document.addEventListener('keyup', this._keyListener);
		document.addEventListener('click', this._clickListener);
	},


	componentWillUnmount: function() {		
		document.removeEventListener('mousedown', this._mouseDown);		
		document.removeEventListener('keydown', this._keyListener);
		document.removeEventListener('keyup', this._keyListener);
		document.removeEventListener('click', this._clickListener);
	},


	render: function() {
		var boxStyle = {
			left: this.state.boxLeft,
			top: this.state.boxTop,
			width: this.state.boxWidth,
			height: this.state.boxHeight,
			zIndex: 9000,
			position: 'absolute',
			cursor: 'default'
		};
		var spanStyle = {
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
			  {React.Children.map(this.props.children, function (child, i) {
			  	return cloneWithProps(child, {
			  		key: child.key || i, 
			  		ref: 'selectable_'+child.key,
			  		selected: this.state.selectedItems.indexOf(child.key) > -1
			  	})
			  }.bind(this))}
			</this.props.component>

		);
	},

	
	_openSelector: function (e) {
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

	
	_mouseDown: function (e) {
		var node = this.getDOMNode(),
			collides;
		if(!isNodeInRoot(e.target, node)) {			
			collides = this._objectsCollide(
				node,
				{
					top: e.pageY,
					left: e.pageX,
					offsetWidth: 0,
					offsetHeight: 0
				},
				this.props.tolerance
			);
			
			if(!collides) return;
		} 

		e.preventDefault();
		this._mouseDownData = {			
			boxLeft: e.pageX,
			boxTop: e.pageY,
	        initialW: e.pageX,
        	initialH: e.pageY        	
		};

        document.addEventListener('mouseup', this._mouseUp);
        document.addEventListener('mousemove', this._openSelector);
	},

	_mouseUp: function (e) {
		e.preventDefault();

	    document.removeEventListener('mousemove', this._openSelector);
	    document.removeEventListener('mouseup', this._mouseUp);

	    if(e.pageX === this._mouseDownData.initialW && e.pageY === this._mouseDownData.initialH) {
	    	return this._selectElement(e.pageX, e.pageY)
	    }

	    return this._selectElements(e);
	},


	_selectElement: function (x, y) {	    
	    var currentItems = this.state.selectedItems,
	    	index;    	

		React.Children.forEach(this.props.children, function (child) {
			var node = this.refs['selectable_'+child.key].getDOMNode();				
			var collision = this._objectsCollide(
				node,
				{
					top: y,
					left: x,
					offsetWidth: 0,
					offsetHeight: 0
				}
			);
			
			if(collision) {				
				index = currentItems.indexOf(child.key);
				if(this.state.persist) {
					if(index > -1) {
						currentItems.splice(index, 1);
					}
					else {
						currentItems.push(child.key);
					}
				}
				else {
					currentItems = [child.key];
				}
			}

		}.bind(this));

		this._mouseDownData = null;

		this.setState({
			isBoxSelecting: false,
			boxWidth: 0,
			boxHeight: 0,
			selectedItems: currentItems
		});

		this.props.onSelection(currentItems);
	},


	_selectElements: function (e) {
	    var currentItems = this.state.selectedItems;

	    this._mouseDownData = null;

		React.Children.forEach(this.props.children, function (child) {
			var collision = this._objectsCollide(
				this.refs['selectable_'+child.key].getDOMNode(),
				this.refs.selectbox.getDOMNode()
			);
			if(collision) {
				currentItems.push(child.key);
			}

		}.bind(this));

		this.setState({
			isBoxSelecting: false,
			boxWidth: 0,
			boxHeight: 0,
			selectedItems: currentItems
		});

		this.props.onSelection(currentItems);

	},

	
	_getBoundsForNode: function (node) {
		var rect = node.getBoundingClientRect();
		
		return {
			top: rect.top+document.body.scrollTop,
			left: rect.left+document.body.scrollLeft,
			offsetWidth: node.offsetWidth,
			offsetHeight: node.offsetHeight
		};
	},


	_objectsCollide: function (a, b, tolerance) {		
		var aObj = (a instanceof HTMLElement) ? this._getBoundsForNode(a) : a,
			bObj = (b instanceof HTMLElement) ? this._getBoundsForNode(b) : b;
		
		if(!tolerance) {
			tolerance = 0;
		}
		
		if(typeof tolerance !== 'object') {
			tolerance = {top: tolerance, left: tolerance, right: tolerance, bottom: tolerance};
		}			

    	return this._coordsCollide(
    		aObj.top - tolerance.top, 
    		aObj.left - tolerance.top, 
    		bObj.top, 
    		bObj.left, 
    		aObj.offsetHeight + tolerance.bottom, 
    		aObj.offsetWidth + tolerance.right, 
    		bObj.offsetWidth, 
    		bObj.offsetHeight
    	);
	},


	_coordsCollide: function (aTop, aLeft, bTop, bLeft, aWidth, aHeight, bWidth, bHeight) {
	    return !(
	        ((aTop + aHeight) < (bTop)) ||
	        (aTop > (bTop + bHeight)) ||
	        ((aLeft + aWidth) < bLeft) ||
	        (aLeft > (bLeft + bWidth))
	    );		
	},


	_keyListener: function (e) {		
		this.setState({
			persist: !!e.metaKey
		});
	},

	_clickListener: function (e) {
		if(isNodeInRoot(e.target, this.getDOMNode())) return;

		this.setState({
			selectedItems: []
		});

		this.props.onSelection([]);
	}


});

module.exports = Selectable;