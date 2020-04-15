import {isNodeIn} from './isNodeIn';
import {isNodeInRoot} from './nodeInRoot';
import {doObjectsCollide} from './doObjectsCollide';
import {getBoundsForNode} from './getBoundsForNode';

const noop = () => ({});

export {noop, isNodeIn, isNodeInRoot, doObjectsCollide, getBoundsForNode};