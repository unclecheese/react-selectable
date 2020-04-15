import {isNodeIn} from './isNodeIn';

export const isNodeInRoot = (node: HTMLElement, root: HTMLElement): boolean => (
    isNodeIn(node, currentNode => currentNode === root)
);
