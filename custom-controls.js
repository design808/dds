// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=888f0c1451ec7763';

export {mountControls} from './ui/controls.js?v=888f0c1451ec7763';
export const cleanupControls=mountControls(document.body);
