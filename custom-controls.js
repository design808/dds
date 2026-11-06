// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=51550a0206825bac';

export {mountControls} from './ui/controls.js?v=51550a0206825bac';
export const cleanupControls=mountControls(document.body);
