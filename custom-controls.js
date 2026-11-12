// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=124c9ad30d73cda6';

export {mountControls} from './ui/controls.js?v=124c9ad30d73cda6';
export const cleanupControls=mountControls(document.body);
