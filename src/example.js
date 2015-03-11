var data = require('./sample-data');
var React = require('react');
var Selectable = require('./react-selectable');

var App = React.createClass({
	getInitialState: function () {
		return {
			'selectedItems': [],
			tolerance: 0,
			distance: 0,
			isGlobal: false
		};
	},

	render: function () {
		return (
			<div>
				<h1>React Selectable Demo</h1>
				<div className="sidebar">
					<div className="info">
						<strong>Tolerance</strong>: <span>{this.state.tolerance}</span><br/>
						<p><input type="range" min="0" max="50" step="1" onChange={this.createRangeHandler('tolerance')} value={this.state.tolerance} /></p>
						<strong>Distance</strong>: <span>{this.state.distance}</span><br/>
						<p><input type="range" min="0" max="50" step="1" onChange={this.createRangeHandler('distance')} value={this.state.distance} /></p>              
						<p><input type="checkbox" onChange={this.toggleGlobal} checked={this.state.isGlobal} /> Make selection box global</p>

						{this.state.selectedItems.length > 0 &&
							<h3>You have selected the following items:</h3>
						}
						{this.state.selectedItems.length === 0 &&
							<p>Please select some items from the right. Click and drag your mouse to select multiple. Cmd/Ctrl-click to select non-adjacent items.</p>
						}
						<ul>
						{this.state.selectedItems.map(function (key,i) {
							return <li key={i}>{this.props.items[key].title}</li>
						}.bind(this))}
						</ul>
					</div>
				</div>
				<Selectable 
					className="main" 
					onSelection={this.handleSelection} 
					tolerance={this.state.tolerance}
					globalMouse={this.state.isGlobal}
					distance={this.state.distance}>
				
				{this.props.items.map(function (item, i) {
					return <Item key={i} title={item.title} year={item.year} />
				})}
				</Selectable>
			</div>
		);
	},

	handleSelection: function (keys) {
		this.setState({
			selectedItems: keys
		});
	},

	createRangeHandler: function (state) {
		return function (e) {
			var newState = {};

			newState[state] = parseInt(e.target.value);
			this.setState(newState);
		}.bind(this);
	},

	toggleGlobal: function (e) {    	
		this.setState({
			isGlobal: e.target.checked
		});
	}
});

var Item = React.createClass({
	render: function () {
		var classes = this.props.selected ? 'item selected' : 'item';
		return (
			<div className={classes}>
				<h2>{this.props.title}</h2>
				<small>{this.props.year}</small>
			</div>
		);

	}
});

React.render(<App items={data} />, document.body);