import { createContext } from 'react';
import { noop } from './utils';

export const SelectableContext = createContext({
    register: noop,
    unregister: noop,
});