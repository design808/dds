// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=a996fa47ec4a3cf0';

export {mountControls} from './ui/controls.js?v=a996fa47ec4a3cf0';
export const cleanupControls=mountControls(document.body);
