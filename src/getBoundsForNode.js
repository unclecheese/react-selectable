/**
 * Given a node, get everything needed to calculate its boundaries
 * @param  {HTMLElement} node
 * @return {Object}
 */
export default node => {
	const rect = node.getBoundingClientRect();

	return {
		top: rect.top,
		left: rect.left,
		offsetWidth: node.offsetWidth,
		offsetHeight: node.offsetHeight
	};
};
