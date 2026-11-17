// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=52d03817fac7e7b9';

export {mountControls} from './ui/controls.js?v=52d03817fac7e7b9';
export const cleanupControls=mountControls(document.body);
