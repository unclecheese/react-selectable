import React, {createRef, PureComponent, ReactElement, ComponentType} from 'react';
import {SelectableContext} from './SelectableContext';

interface Props {
    children: ReactElement;
    selectableKey: any;
}

export const createSelectable = (WrappedComponent: ComponentType) => {
    class SelectableItem extends PureComponent<Props> {
        private selectableRef = createRef<HTMLDivElement>();

        static contextType = SelectableContext;

        public componentDidMount() {
            this.context.register(this.props.selectableKey, this.selectableRef.current);
        }

        public componentWillUnmount() {
            this.context.unregister(this.props.selectableKey);
        }

        public render() {
            return (
                <div ref={this.selectableRef}>
                    <WrappedComponent {...this.props}>
                        {this.props.children}
                    </WrappedComponent>
                </div>
            )
        }
    }

    return SelectableItem;
};