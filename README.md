# Selectable items for React

Allows individual or group selection of items using the mouse.

## Demo
[Try it out](http://unclecheese.github.io/react-selectable/example)

## Upgrading from 0.1
There have been significant changes in the 0.2 release. Please [read about them here](UPGRADING.md).
## Getting started
```
npm install react-selectable
```

```js
import React from 'react';
import { render } from 'react-dom';
import { SelectableGroup, createSelectable } from 'react-selectable';
import SomeComponent from './some-component';

const SelectableComponent = createSelectable(SomeComponent);

class App extends React.Component {
  
  constructor (props) {
  	super(props);
  	this.state = {
  		selectedKeys: []
  	};
  }

  render () {
    return (
      <SelectableGroup onSelection={this.handleSelection}>
        {this.props.items.map((item, i) => {
          	let selected = this.state.selectedKeys.indexOf(item.id) > -1;
          	return (
          		<SelectableComponent key={i} selected={selected} selectableKey={item.id}>
          			{item.title}
          		</SelectableComponent>
          	);
        })}
      </SelectableGroup>
    );
  },
  
  handleSelection (selectedKeys) {
  	this.setState({ selectedKeys });
  }
	
}
```
## Configuration

The component accepts a few optional props:
* `onSelection` (Function) Fired after user completes selection
* `tolerance` (Number) The amount of buffer to add around your `<SelectableGroup />` container, in pixels.
* `component` (string) The component to render. Defaults to `div`.
