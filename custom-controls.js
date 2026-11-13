// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=eb518823ac99b3c2';

export {mountControls} from './ui/controls.js?v=eb518823ac99b3c2';
export const cleanupControls=mountControls(document.body);
