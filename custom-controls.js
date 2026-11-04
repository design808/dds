// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=8d17f0c317923929';

export {mountControls} from './ui/controls.js?v=8d17f0c317923929';
export const cleanupControls=mountControls(document.body);
