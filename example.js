import data from './sample-data';
import React from 'react';
import { render } from 'react-dom';
import SelectableGroup from './selectable-group';
import createSelectable from './createSelectable';


const isNodeInRoot = (node, root) => {
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }

  return false;
};


class App extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			selectedItems: [],
			tolerance: 0,
			distance: 0,
		}

		this.handleSelection = this.handleSelection.bind(this);
		this.clearItems = this.clearItems.bind(this);
		this.handleToleranceChange = this.handleToleranceChange.bind(this);
	}


	componentDidMount () {
		document.addEventListener('click', this.clearItems);
	}


	componentWillUnmount () {
		document.removeEventListener('click', this.clearItems);
	}


	handleSelection (keys) {
		this.setState({
			selectedItems: keys
		});
	}


	clearItems (e) {
		if(!isNodeInRoot(e.target, this.refs.selectable)) {
			this.setState({
				selectedItems: []
			});
		}
	}


	handleToleranceChange (e) {
		this.setState({
			tolerance: e.target.value
		});
	}


	render () {
		return (
			<div>
				<h1>React Selectable Demo</h1>
				<div className="sidebar">
					<div className="info">						
						<strong>Tolerance</strong>: <span>{this.state.tolerance}</span><br/>
						<em>The number of pixels that must be in the bounding box in order for an item to be selected.</em>
						<p><input type="range" min="0" max="50" step="1" onChange={this.handleToleranceChange} value={this.state.tolerance} /></p>

						{this.state.selectedItems.length > 0 &&
							<h3>You have selected the following items:</h3>
						}
						{this.state.selectedItems.length === 0 &&
							<p>Please select some items from the right by clicking and dragging a box around them.</p>
						}
						<ul>
						{this.state.selectedItems.map(function (key,i) {
							return <li key={i}>{this.props.items[key].title}</li>
						}.bind(this))}
						</ul>
					</div>
				</div>
				<SelectableGroup
					className="main" 
					ref="selectable"
					onSelection={this.handleSelection} 
					tolerance={this.state.tolerance}
					globalMouse={this.state.isGlobal}
					distance={this.state.distance}>
				
				{this.props.items.map((item, i) => {
					const selected = this.state.selectedItems.indexOf(i) > -1;
					return (
						<SelectableItem
							selectableKey={i}
							key={i} 
							title={item.title} 
							year={item.year} 
							selected={selected} />
					);
				})}
				</SelectableGroup>
			</div>

		);		
	}
}

const Item = ({
	selected,
	title,
	year
}) => {
	const classes = selected ? 'item selected' : 'item';
	return (
		<div className={classes}>
			<h2>{title}</h2>
			<small>{year}</small>
		</div>
	)
};

const SelectableItem = createSelectable(Item);

render(<App items={data} />, document.getElementById('app'));