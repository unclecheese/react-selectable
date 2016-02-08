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

class App extends React.Component {
  render () {
    return (
      <SelectableGroup onSelection={this.handleSelection}>
        {this.props.items.map((item, i) => (
          return <MySelectableItem key={i} selectableKey={item.id}>{item.title}</MySelectableItem>;
        ))}
      </SelectableGroup>
    );
  },
  
  handleSelection (keys) {
    console.log('you selected the following keys', keys);
  }
	
}

const MyItem = ({
	children,
	selected
}) => (
  <div className={selected ? 'selected' : ''}>
    {children}
  </div>
);

// Compose the MyItem component to be selectable by the SelectableGroup.
const MySelectableItem = createSelectable(MyItem);

```

Selected items receive the property `selected`.

## Configuration

The component accepts a few optional props:
* `onSelection` (Function) Fired after user completes selection
* `tolerance` (Number|Object) The amount of buffer to add around your `<SelectableGroup />` container, in pixels. To set custom tolerances for each border of the container, pass an object containing values for `top`, `left`, `bottom`, and `right`, e.g. `{ top: 30, left: 40, bottom: 100, right: 0 }`.
* `component` (string) The component to render. Defaults to `div`.
