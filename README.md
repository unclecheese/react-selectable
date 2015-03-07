# Selectable items for React

Allows individual or group selection of items using the mouse. Click and drag to lasso multiple items, hold the cmd/ctrl key to select non-adjacent items.

## Demo
[Try it out](http://unclecheese.github.io/react-selectable/example)
## Getting started
```
npm install react-selectable
```

```js
var React = require('react');
var Selectable = require('react-selectable');

var App = React.createClass({
  
  render: function () {
    return (
      <Selectable onSelection={this.handleSelection}>
        {this.props.items.map.function(item, i) {
          return <MyItem key={i}>{item.title}</MyItem>;
        })}
      </Selectable>
    );
  },
  
  handleSelection: function (keys) {
    console.log('you selected the following keys', keys);
  }
});

var MyItem = React.createClass({
  
  render: function () {
    return (
      <div className={this.props.selected ? 'selected' : ''>
        {this.props.children}
      </div>
    );
  }
});
```

Selected items receive the property `selected`.

## Configuration

The component accepts a few optional props:
* `onSelection` (Function) Fired after user completes selection
* `tolerance` (Number|Object) The amount of buffer to add around your `<Selectable />` container, in pixels. To set custom tolerances for each border of the container, pass an object containing values for `top`, `left`, `bottom`, and `right`, e.g. `{ top: 30, left: 40, bottom: 100, right: 0 }`.
* `component` (string) The component to render. Defaults to `div`.
