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

  handleSelection (selectedKeys) {
  	this.setState({ selectedKeys });
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
  }

}
```
## Configuration

The `<SelectableGroup />` component accepts a few optional props:
* **`onBeginSelection(event)`** (Function) Callback fired when the selection was started.
* **`onSelection(items, event)`** (Function) Callback fired while the mouse is moving. Throttled to 50ms for performance in IE/Edge.
* **`onEndSelection(items, event)`** (Function) Callback fired after user completes selection.
* **`onNonItemClick(event)`** (Function) Callback fired when a click happens within the selectable group component, but not in a selectable item. Useful for clearing selection.
* **`tolerance`** (Number) The amount of buffer to add around your `<SelectableGroup />` container, in pixels.
* **`component`** (String) The component to render. Defaults to `div`.
* **`fixedPosition`** (Boolean) Whether the `<SelectableGroup />` container is a fixed/absolute position element or the grandchild of one. Note: if you get an error that `Value must be omitted for boolean attributes` when you try `<SelectableGroup fixedPosition={true} />`, simply use Javascript's boolean object function: `<SelectableGroup fixedPosition={Boolean(true)} />`.
* **`preventDefault`** (Boolean) Allows to enable/disable preventing the default action of the onmousedown event (with e.preventDefault). True by default. Disable if your app needs to capture this event for other functionalities.
* **`enabled`** (Boolean) If false, all of the selectable features are disabled, and event handlers removed.
* **`className`** (String) A CSS class to add to the containing element.
* **`selectingClassName`** (String) A CSS class to add to the containing element when we select.

### Decorators

Though they are optional, you can use decorators with this `react-selectable`.

A side by side comparison is the best way to illustrate the difference:

#### Without Decorators
```javascript
class SomeComponent extends Component {

}
export default createSelectable(SomeComponent)
```
vs.

#### With Decorators
```javascript
@createSelectable
export default class SomeComponent extends Component {

}
```

In order to enable this functionality, you will most likely need to install a plugin (depending on your build setup). For Babel, you will need to make sure you have installed and enabled  [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy) by doing the following:

1. run `npm i --save-dev babel-plugin-transform-decorators-legacy`
2. Add the following line to your `.babelrc`:

```json
{
  "plugins": ["transform-decorators-legacy"]
}
```
