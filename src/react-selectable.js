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

  /**
   * @type {Object}
   */
  propTypes: {

    /**
     * Event that will fire when items are selected. Passes an array of keys
     */
    onSelection: React.PropTypes.func,

    /**
     * Don't clear current selected items before next selection
     */
    dontClearSelection: React.PropTypes.bool,

    /**
     * The component that will represent the Selectable DOM node
     */
    component: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.string
    ]),

    /**
     * Expands the boundary of the selectable area. It can be an integer, which
     * applies to all sides, or an object containing "top", "bottom", "left",
     * and "right" values for custom distance on each side
     */
    distance: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number
    ]),

    /**
     * Amount of forgiveness an item will offer to the selectbox before registering
     * a selection, i.e. if only 1px of the item is in the selection, it shouldn't be
     * included.
     */
    tolerance: React.PropTypes.number,

    /**
     * If true, a click-and-drag with the mouse will generate a select box anywhere
     * in the document.
     */
    globalMouse: React.PropTypes.bool,

    /**
     * If true, a click will not generate event onSelection
     */
    disableSingleSelection: React.PropTypes.bool
  },

  /**
   * This is stored outside the state, so that setting it doesn't
   * rerender the app during selection. shouldComponentUpdate() could work around that.
   * @type {Object}
   */
  _mouseDownData: null,

  /**
   * @return {Object}
   */
  getInitialState: function() {
    return {
      isBoxSelecting: false,
      persist: this.props.dontClearSelection,
      boxWidth: 0,
      boxHeight: 0,
      selectedItems: []
    };
  },

  /**
   * @return {Object}
   */
  getDefaultProps: function() {
    return {
      onSelection: function () {},
      dontClearSelection: false,
      component: 'div',
      distance: 0,
      tolerance: 0,
      globalMouse: false,
      disableSingleSelection: false
    };
  },

  /**
   * Attach global event listeners
   */
  componentDidMount: function() {
    var node = this.getDOMNode();
    node.addEventListener('mousedown', this._mouseDown);
    node.addEventListener('keydown', this._keyListener);
    node.addEventListener('keyup', this._keyListener);
  },

  /**
   * Remove global event listeners
   */
  componentWillUnmount: function() {
    var node = this.getDOMNode();
    node.removeEventListener('mousedown', this._mouseDown);
    node.removeEventListener('keydown', this._keyListener);
    node.removeEventListener('keyup', this._keyListener);
  },

  /**
   * Renders the component
   * @return {ReactComponent}
   */
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

  /**
   * Called while moving the mouse with the button down. Changes the boundaries
   * of the selection box
   */
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

  /**
   * Called when a user presses the mouse button. Determines if a select box should
   * be added, and if so, attach event listeners
   */
  _mouseDown: function (e) {
    var node = this.getDOMNode(),collides, offsetData, distanceData;

    document.addEventListener('mouseup', this._mouseUp);

    // Right clicks
    if(e.which === 3 || e.button === 2) return;

    if(!isNodeInRoot(e.target, node) && !this.props.globalMouse) {
      distanceData = this._getDistanceData();
      offsetData = this._getBoundsForNode(node);
      collides = this._objectsCollide(
        {
          top: offsetData.top - distanceData.top,
          left: offsetData.left - distanceData.left,
          bottom: offsetData.offsetHeight + distanceData.bottom,
          right: offsetData.offsetWidth + distanceData.right
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

    if (!this.props.dontClearSelection) {
      this.setState({selectedItems: []});
    }
    document.addEventListener('mousemove', this._openSelector);
  },

  /**
   * Called when the user has completed selection
   */
  _mouseUp: function (e) {

    document.removeEventListener('mousemove', this._openSelector);
    document.removeEventListener('mouseup', this._mouseUp);

    if(!this._mouseDownData) return;

    var inRoot = isNodeInRoot(e.target, this.getDOMNode());
    var click = (e.pageX === this._mouseDownData.initialW && e.pageY === this._mouseDownData.initialH);

    // Clicks outside the Selectable node should reset clear selection
    if(click && !inRoot) {
      this.setState({
        selectedItems: []
      });
      return this.props.onSelection([]);
    }

    if (!this.props.disableSingleSelection) {
      // Handle selection of a single element
      if(click && inRoot) {
        return this._selectElement(e.pageX, e.pageY)
      }
    }

    // User drag-clicked in the Selectable area
    if(!click && inRoot) {
      return this._selectElements(e);
    }
  },

  /**
   * Selects a single child, given the x/y coords of the mouse
   * @param  {int} x
   * @param  {int} y
   */
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
        },
        this.props.tolerance
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

  /**
   * Selects multiple children given x/y coords of the mouse
   */
  _selectElements: function (e) {
    var currentItems = this.state.selectedItems,
      index;

    this._mouseDownData = null;

    React.Children.forEach(this.props.children, function (child) {
      var collision = this._objectsCollide(
        this.refs.selectbox.getDOMNode(),
        this.refs['selectable_'+child.key].getDOMNode(),
        this.props.tolerance
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
          currentItems.push(child.key);
        }
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

  /**
   * Given a node, get everything needed to calculate its boundaries
   * @param  {HTMLElement} node
   * @return {Object}
   */
  _getBoundsForNode: function (node) {
    var rect = node.getBoundingClientRect();

    return {
      top: rect.top+document.body.scrollTop,
      left: rect.left+document.body.scrollLeft,
      offsetWidth: node.offsetWidth,
      offsetHeight: node.offsetHeight
    };
  },

  /**
   * Resolve the disance prop from either an Int or an Object
   * @return {Object}
   */
  _getDistanceData: function () {
    var distance = this.props.distance;

    if(!distance) {
      distance = 0;
    }

    if(typeof distance !== 'object') {
      return {
        top: distance,
        left: distance,
        right: distance,
        bottom: distance
      };
    }

    return distance;
  },

  /**
   * Given two objects containing "top", "left", "offsetWidth" and "offsetHeight"
   * properties, determine if they collide.
   * @param  {Object|HTMLElement} a
   * @param  {Object|HTMLElement} b
   * @return {bool}
   */
  _objectsCollide: function (a, b, tolerance) {
    var aObj = (a instanceof HTMLElement) ? this._getBoundsForNode(a) : a,
      bObj = (b instanceof HTMLElement) ? this._getBoundsForNode(b) : b;

    return this._coordsCollide(
      aObj.top,
      aObj.left,
      bObj.top,
      bObj.left,
      aObj.offsetWidth,
      aObj.offsetHeight,
      bObj.offsetWidth,
      bObj.offsetHeight,
      tolerance
    );
  },

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
  _coordsCollide: function (aTop, aLeft, bTop, bLeft, aWidth, aHeight, bWidth, bHeight, tolerance) {
    if(typeof tolerance === 'undefined') {
      tolerance = 0;
    }

    return !(
      // 'a' bottom doesn't touch 'b' top
      ( (aTop + aHeight - tolerance ) < bTop ) ||
        // 'a' top doesn't touch 'b' bottom
      ( (aTop + tolerance) > (bTop + bHeight) ) ||
        // 'a' right doesn't touch 'b' left
      ( (aLeft + aWidth - tolerance) < bLeft ) ||
        // 'a' left doesn't touch 'b' right
      ( (aLeft + tolerance) > (bLeft + bWidth) )
    );
  },

  /**
   * Listens for the meta key
   */
  _keyListener: function (e) {
    this.setState({
      persist: !!e.metaKey
    });
  }
});

module.exports = Selectable;
