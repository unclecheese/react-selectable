var data = require('./sample-data');
var React = require('react');
var Selectable = require('./react-selectable');

var App = React.createClass({
  getInitialState: function () {
      return {
          'selectedItems': []
        };
    },
    
    render: function () {
      return (
      <div>
          <h1>React Selectable Demo</h1>
          <div className="sidebar">
            <div className="info">
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
          <Selectable className="main" onSelection={this.handleSelection} tolerance={100}>
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