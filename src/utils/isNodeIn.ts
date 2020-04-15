export const isNodeIn = (node: HTMLElement, predicate: Function): boolean => {
    if (typeof predicate !== 'function') {
        throw new Error('isNodeIn second parameter must be a function');
    }

    let currentNode = node;
    while (currentNode) {
        if (predicate(currentNode)) {
            return true;
        }
        currentNode = currentNode.parentNode as any;
    }

    return false;
};
