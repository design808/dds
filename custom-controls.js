// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=f2a2d87e2a7711af';

export {mountControls} from './ui/controls.js?v=f2a2d87e2a7711af';
export const cleanupControls=mountControls(document.body);
