import isNodeIn from './isNodeIn';

const isNodeInRoot = (node, root) => (
	isNodeIn(node, currentNode => currentNode === root)
);

export default isNodeInRoot;
