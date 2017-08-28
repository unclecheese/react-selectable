# Selectable items for React

Allows individual or group selection of items using the mouse.

## Demo
[Try it out](http://unclecheese.github.io/react-selectable/example)

## Upgrading from 0.1 to 0.2
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

The `<SelectableGroup />` component accepts a few optional props:
* `onSelection` (Function) Callback fired after user completes selection
* `onNonItemClick` (Function) Callback fired when a click happens within the selectable group component, but not in a selectable item. Useful for clearing selection.
* `tolerance` (Number) The amount of buffer to add around your `<SelectableGroup />` container, in pixels.
* `component` (String) The component to render. Defaults to `div`.
* `fixedPosition` (Boolean) Whether the `<SelectableGroup />` container is a fixed/absolute position element or the grandchild of one. Note: if you get an error that `Value must be omitted for boolean attributes` when you try `<SelectableGroup fixedPosition={true} />`, simply use Javascript's boolean object function: `<SelectableGroup fixedPosition={Boolean(true)} />`.
* `selectOnMouseMove` (Boolean) Enable to fire the `onSelection` callback while the mouse is moving. Throttled to 50ms for performance in IE/Edge
* `preventDefault` (Boolean) Allows to enable/disable preventing the default action of the onmousedown event (with e.preventDefault). True by default. Disable if your app needs to capture this event for other functionalities.
* `enabled` (Boolean) If false, all of the selectable features are disabled, and event handlers removed.
