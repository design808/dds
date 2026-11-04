// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=25f3c2e2c9757209';

export {mountControls} from './ui/controls.js?v=25f3c2e2c9757209';
export const cleanupControls=mountControls(document.body);
