// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=4d6e4bc925033bb2';

export {mountControls} from './ui/controls.js?v=4d6e4bc925033bb2';
export const cleanupControls=mountControls(document.body);
