// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=1da6401975a34e58';

export {mountControls} from './ui/controls.js?v=1da6401975a34e58';
export const cleanupControls=mountControls(document.body);
