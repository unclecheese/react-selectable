/**
 * Given a node, get everything needed to calculate its boundaries
 * @param  {HTMLElement} node
 * @return {Object}
 */
export const getBoundsForNode = (node: HTMLElement) => {
    const rect = node.getBoundingClientRect();

    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft,
        offsetWidth: node.offsetWidth,
        offsetHeight: node.offsetHeight
    };
};