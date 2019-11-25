const isNodeIn = (node, predicate) => {
  if (typeof predicate !== 'function') {
  	throw new Error('isNodeIn second parameter must be a function');
  }
  
  let currentNode = node;
  while (currentNode) {
    if (predicate(currentNode)) {
      return true;
    }
    currentNode = currentNode.parentNode;
  }

  return false;
};

export default isNodeIn;
