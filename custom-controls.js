// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=f9086ddd38cf7f33';

export {mountControls} from './ui/controls.js?v=f9086ddd38cf7f33';
export const cleanupControls=mountControls(document.body);
