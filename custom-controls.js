// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=fbe7d307629a0ab1';

export {mountControls} from './ui/controls.js?v=fbe7d307629a0ab1';
export const cleanupControls=mountControls(document.body);
