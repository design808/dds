// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=ef54ffa1d3086c30';

export {mountControls} from './ui/controls.js?v=ef54ffa1d3086c30';
export const cleanupControls=mountControls(document.body);
