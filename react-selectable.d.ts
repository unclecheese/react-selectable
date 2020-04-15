import React from 'react';

declare module 'react-selectable' {
    interface ReactSelectableGroupProps {
        onSelection?: (selectedItems: Array<any>) => void;
        onNonItemClick?: () => void;
        onBeginSelection?: () => void;
        onEndSelection?: () => void;
        selectingClassName?: string;
        tolerance?: number;
        component?: string;
        fixedPosition?: boolean;
        preventDefault?: boolean;
        enabled?: boolean;
        [key: string]: any;
    }

    interface ReactSelectableComponentProps {
        key?: number|string;
        selected?: boolean;
        selectableKey?: number|string;
        [key: string]: any;
    }

    export class SelectableGroup extends React.Component<ReactSelectableGroupProps> {

    }

    class SelectableComponent extends React.Component<ReactSelectableComponentProps> {

    }
    export const createSelectable: (component: React.ReactNode) => typeof SelectableComponent;
}
