# Selectable items for React

Allows individual or group selection of items using the mouse.

## Demo
[Try it out](http://unclecheese.github.io/react-selectable/example)

## Upgrading from 0.1 to 0.2
There have been significant changes in the 0.2 release. Please [read about them here](UPGRADING.md).

## Getting started

```
npm install --save react-selectable
```
This assumes you are using npm as your package manager.

If you are not, you can access these files [through unpkg](https://unpkg.com/react-selectable), download them, or point your package manager to them. For more info on this in, visit [the builds section](#builds)

```js
import React from 'react';
import { SelectableGroup, createSelectable } from 'react-selectable';
import SomeComponent from './some-component';

const SelectableComponent = createSelectable(SomeComponent);

class App extends React.Component {

  state = {
    selectedKeys: []
  }

  handleSelection = (selectedKeys) => {
    this.setState({ selectedKeys });
  }

  render () {
    return (
      <SelectableGroup onSelection={this.handleSelection}>
        {this.props.items.map((item, i) => {
          	const selected = this.state.selectedKeys.indexOf(item.id) > -1;
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
* `onSelection` (Function) Callback fired after user completes selection
* `onNonItemClick` (Function) Callback fired when a click happens within the selectable group component, but not in a selectable item. Useful for clearing selection.
* `tolerance` (Number) The amount of buffer to add around your `<SelectableGroup />` container, in pixels.
* `component` (String) The component to render. Defaults to `div`.
* `fixedPosition` (Boolean) Whether the `<SelectableGroup />` container is a fixed/absolute position element or the grandchild of one. Note: if you get an error that `Value must be omitted for boolean attributes` when you try `<SelectableGroup fixedPosition={true} />`, simply use Javascript's boolean object function: `<SelectableGroup fixedPosition={Boolean(true)} />`.
* `selectOnMouseMove` (Boolean) Enable to fire the `onSelection` callback while the mouse is moving. Throttled to 50ms for performance in IE/Edge
* `preventDefault` (Boolean) Allows to enable/disable preventing the default action of the onmousedown event (with e.preventDefault). True by default. Disable if your app needs to capture this event for other functionalities.
* `enabled` (Boolean) If false, all of the selectable features are disabled, and event handlers removed.

## Builds

Most commonly people consume `react-selectable` as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules. These modules are what you get when you import `react-selectable` in a [Webpack](https://webpack.js.org/), [Browserify](http://browserify.org/), or a Node environment.

The `redux-selectable` source code is written in ES2015 but we precompile both CommonJS and UMD builds to ES5 so they work in [any modern browser](http://caniuse.com/#feat=es5).

If you don't use a module bundler, it's also fine. The `redux-selectable` npm package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://unpkg.com/react-selectable/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. For example, you can drop a UMD build as a [`<script>` tag](https://unpkg.com/redux/dist/redux.js) on the page, or [tell Bower to install it](https://github.com/reactjs/redux/pull/1181#issuecomment-167361975). The UMD builds make Redux available as a `window.ReactSelectable` global variable.
