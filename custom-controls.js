// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=fb3ed366538b2432';

export {mountControls} from './ui/controls.js?v=fb3ed366538b2432';
export const cleanupControls=mountControls(document.body);
