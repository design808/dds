// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=ec6f1fc7745acd41';

export {mountControls} from './ui/controls.js?v=ec6f1fc7745acd41';
export const cleanupControls=mountControls(document.body);
