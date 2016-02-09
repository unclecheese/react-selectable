## Significant API changes since 0.1
This module now does a lot _less_ than it used to. The sole function of `react-selectable` is now to provide mouse events that draw a box around the UI, and fire an event telling you which of components are in the group. You are responsible for wiring up everything else, and that's a good thing.

The primary change in this version is that `Selectable` no longer assumes that all of its children, and only its children, are selectable. This is a false premise and precludes you from creating lists that may include non-selectable items, or lists that are grouped in other child components. You now have to explicitly compose a component as selectable by running it through the `createSelectable` higher-order component.

`const MySelectableItem = createSelectable(MyItem);`. 

Note that this is merely sugar for wiring up `this.context.selectable.register(key, domNode)` and `this.context.selectable.unregister(key)` on lifecycle methods.

To disambiguate the two, the `<Selectable />` component should now be referred to as `<SelectableGroup />`

### In addition the following features have been removed in 0.2:

* **Cmd-clicking** to concatenate items (just wire up your own `keyup` listener to toggle a multiselection state in your store(s))

* **The `distance` prop**: This assumed that you had the mouse events attached above the Selectable node (i.e. `document`), which gives this plugin too much scope. If you want the entire document to be selectable, just make the root component a `<SelectableGroup />`. If you want distance padding, just place the `<SeletableGroup />` at the level at which you want the selection box to be available. It will only select those items that are composed with `createSelectable`.

* **The `globalMouse` prop**: For many of the same reasons as `distance`.

* **Managing your `onClick` events**: You can do that on your own now. By default, a selectable item will not become selected on click. You should wire up a click handler that updates your store, similar to how you would wire up your cmd-clicking.

* **You must now provide `selectableKey`**: Your selectable items have a required prop of `selectableKey`, which is the key that will be passed to the `onSelection` handler of your `SelectableGroup`.
