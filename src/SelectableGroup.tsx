import React, {createRef, CSSProperties, PureComponent} from 'react';
import classNames from 'classnames';
import {isNodeInRoot, noop, getBoundsForNode, doObjectsCollide} from './utils';
import throttle from 'lodash.throttle';
import {SelectableContext} from './SelectableContext';


interface Props {
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

    className?: string,
    selectboxClassName?: string,
    disableClickOnItem?: boolean,
}

interface State {
    isBoxSelecting: boolean,
}

interface Coordinate {
    x: number;
    y: number;
}

interface MouseDownDataInterface {
    boxLeft: number;
    boxTop: number;
    initialW: number;
    initialH: number;
}

export class SelectableGroup extends PureComponent<Props, State> {
    private rootRef = createRef<HTMLDivElement>();
    private selectboxRef = createRef<HTMLDivElement>();

    private registry: any[] = [];
    private rect: Coordinate = {x: 0, y: 0};
    private mouseDownData: MouseDownDataInterface | null = null;
    private mouseDownStarted: boolean = false;
    private mouseUpStarted: boolean = false;
    private mouseMoveStarted: boolean = false;

    public readonly state: State = {
        isBoxSelecting: false,
    };

    static defaultProps = {
        component: 'div',
        tolerance: 0,
        fixedPosition: false,
        preventDefault: true,
        enabled: true,
        disableClickOnItem: false,
        onSelection: noop,
        onNonItemClick: noop,
        onBeginSelection: noop,
        onEndSelection: noop,
    };

    public componentDidMount() {
        this.rootRef.current && this.rootRef.current.addEventListener('mousedown', this.mouseDown);
        this.rect = this.getInitialCoordinates();
    }

    /**
     * Remove global event listeners
     */
    public componentWillUnmount() {
        this.rootRef.current && this.rootRef.current.removeEventListener('mousedown', this.mouseDown)
    }

    private registerSelectable = (key: any, node: HTMLElement): void => {
        this.registry.push({key, node});
    };

    private unregisterSelectable = (key: any): void => {
        this.registry = this.registry.filter(data => data.key !== key);
    };

    /**
     * Called while moving the mouse with the button down. Changes the boundaries
     * of the selection box
     */
    private updateSelectbox = (e) => {
        if (this.mouseMoveStarted) {
            return
        }
        this.mouseMoveStarted = true;
        // this.mouseMoved = true

        const {pageX, pageY} = e;
        const {x, y} = this.rect;

        const width = Math.abs(this.mouseDownData!.initialW - pageX + x);
        const height = Math.abs(this.mouseDownData!.initialH - pageY + y);
        const pointX = Math.min(pageX - x, this.mouseDownData!.initialW);
        const pointY = Math.min(pageY - y, this.mouseDownData!.initialH);

        this.setState({
            isBoxSelecting: true,
        });

        this.selectboxRef.current!.style.width = `${width}px`;
        this.selectboxRef.current!.style.height = `${height}px`;
        this.selectboxRef.current!.style.top = `${pointY}px`;
        this.selectboxRef.current!.style.left = `${pointX}px`;

        this.throttledSelect(e);

        this.mouseMoveStarted = false;
    };

    private getInitialCoordinates = (): Coordinate => {
        if (this.props.fixedPosition) {
            return {x: 0, y: 0}
        }

        const style = window.getComputedStyle(document.body);
        const t = style.getPropertyValue('margin-top');
        const l = style.getPropertyValue('margin-left');
        const mLeft = parseInt(l.slice(0, l.length - 2), 10);
        const mTop = parseInt(t.slice(0, t.length - 2), 10);

        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = this.rootRef.current && this.rootRef.current.getBoundingClientRect();

        return {
            x: elemRect ? Math.round(elemRect.left - bodyRect.left + mLeft) : 0,
            y: elemRect ? Math.round(elemRect.top - bodyRect.top + mTop) : 0,
        };
    };

    /**
     * Called when a user presses the mouse button. Determines if a select box should
     * be added, and if so, attach event listeners
     */
    private mouseDown = (e) => {
        const {onBeginSelection, preventDefault, enabled, disableClickOnItem} = this.props;

        if (!enabled || this.mouseDownStarted) {
            return;
        }

        if (this.registry.some(item => isNodeInRoot(e.target as any, item.node)) && disableClickOnItem) {
            return;
        }

        // Right clicks
        if (e.which === 3 || e.button === 2) {
            return;
        }

        this.mouseDownStarted = true;
        this.mouseUpStarted = false;

        if (onBeginSelection) {
            onBeginSelection(e);
        }

        const rootNode = this.rootRef.current;

        // if (e.which === 3 || e.button === 2) return;

        if (rootNode && !isNodeInRoot(e.target, rootNode)) {
            const bounds = getBoundsForNode(rootNode);

            const collides = doObjectsCollide(
                {
                    top: bounds.top,
                    left: bounds.left,
                    bottom: bounds.offsetHeight,
                    right: bounds.offsetWidth
                },
                {
                    top: e.pageY - this.rect.y,
                    left: e.pageX - this.rect.x,
                    offsetWidth: 0,
                    offsetHeight: 0
                }
            );

            if (!collides) {
                return;
            }
        }

        this.rect = this.getInitialCoordinates();

        this.mouseDownData = {
            boxLeft: e.pageX - this.rect.x,
            boxTop: e.pageY - this.rect.y,
            initialW: e.pageX - this.rect.x,
            initialH: e.pageY - this.rect.y
        };

        if (preventDefault) {
            e.preventDefault();
        }

        window.addEventListener('mousemove', this.updateSelectbox);
        window.addEventListener('mouseup', this.mouseUp);
    };


    /**
     * Called when the user has completed selection
     */
    private mouseUp = (e) => {
        if (this.mouseUpStarted) {
            return
        }

        const {onNonItemClick} = this.props;
        const {isBoxSelecting} = this.state;

        this.mouseDownStarted = false;
        this.mouseUpStarted = true;

        e.stopPropagation();

        window.removeEventListener('mousemove', this.updateSelectbox);
        window.removeEventListener('mouseup', this.mouseUp);

        if (!this.mouseDownData) {
            return;
        }

        // Mouse up when not box selecting is a heuristic for a "click"
        if (onNonItemClick && !isBoxSelecting) {
            if (this.registry.some(item => isNodeInRoot(e.target as any, item.node))) {
                onNonItemClick(e);
            }
        }

        this.selectElements(e, true);

        this.mouseDownData = null;
        this.setState({
            isBoxSelecting: false,
        });
    };

    /**
     * Selects multiple children given x/y coords of the mouse
     */
    private selectElements = (e, isEnd = false) => {
        const {tolerance, onSelection, onEndSelection} = this.props;

        const selectbox = this.selectboxRef.current;

        if (!selectbox) {
            return;
        }

        const currentItems: any[] = [];

        this.registry.forEach(item => {
            if (
                item.node
                && doObjectsCollide(selectbox, item.node, tolerance)
                && !currentItems.includes(item.key)
            ) {
                currentItems.push(item.key);
            }
        });

        if (isEnd) {
            if (onEndSelection) {
                onEndSelection(currentItems, e);
            }
        } else {
            if (onSelection) {
                onSelection(currentItems, e);
            }
        }
    };

    private throttledSelect = throttle(this.selectElements, 50);


    public render() {
        const {children, fixedPosition, className, selectingClassName, selectboxClassName} = this.props;
        const {isBoxSelecting} = this.state;
        const Component = this.props.component;

        const boxStyle: CSSProperties = {
            zIndex: 9000,
            position: fixedPosition ? 'fixed' : 'absolute',
            cursor: 'default'
        };

        const spanStyle: CSSProperties = {
            backgroundColor: 'transparent',
            border: '1px dashed #999',
            width: '100%',
            height: '100%',
            float: 'left'
        };

        const wrapperStyle: CSSProperties = {
            position: 'relative',
            overflow: 'visible'
        };


        return (
            <Component
                className={
                    classNames(
                        className,
                        isBoxSelecting ? selectingClassName : null,
                    )
                }
                style={wrapperStyle}
                ref={this.rootRef}
            >
                {isBoxSelecting && (
                    <div
                        className="selectbox"
                        style={boxStyle}
                        ref={this.selectboxRef}
                    >
                        <span style={spanStyle} className={selectboxClassName}/>
                    </div>
                )}
                <SelectableContext.Provider value={{
                    register: this.registerSelectable,
                    unregister: this.unregisterSelectable
                }}>
                    {children}
                </SelectableContext.Provider>
            </Component>
        );
    }
}

