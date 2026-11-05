// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=f202618082b57775';

export {mountControls} from './ui/controls.js?v=f202618082b57775';
export const cleanupControls=mountControls(document.body);
