// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=07d93ae023b5f009';

export {mountControls} from './ui/controls.js?v=07d93ae023b5f009';
export const cleanupControls=mountControls(document.body);
