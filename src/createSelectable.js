import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const createSelectable = (WrappedComponent) => {
	class SelectableItem extends React.Component {

		componentDidMount () {
			this.context.selectable.register(this.props.selectableKey, ReactDOM.findDOMNode(this));
		}


		componentWillUnmount () {
			this.context.selectable.unregister(this.props.selectableKey);
		}


		render () {
			return React.createElement(
				WrappedComponent,
				this.props,
				this.props.children
			);
		}
	}

	SelectableItem.contextTypes = {
		selectable: PropTypes.object
	};

	SelectableItem.propTypes = {
		selectableKey: PropTypes.any.isRequired
	};

	return SelectableItem;
}


export default createSelectable;
