// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=a2951f06bdfb22b5';

export {mountControls} from './ui/controls.js?v=a2951f06bdfb22b5';
export const cleanupControls=mountControls(document.body);
