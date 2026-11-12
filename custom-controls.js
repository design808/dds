// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=2a22c87422b484f5';

export {mountControls} from './ui/controls.js?v=2a22c87422b484f5';
export const cleanupControls=mountControls(document.body);
