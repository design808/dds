// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=80f7f2182aeb104b';

export {mountControls} from './ui/controls.js?v=80f7f2182aeb104b';
export const cleanupControls=mountControls(document.body);
