// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=1ea07ad08c5dd4c5';

export {mountControls} from './ui/controls.js?v=1ea07ad08c5dd4c5';
export const cleanupControls=mountControls(document.body);
