// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=99539125b4014e6b';

export {mountControls} from './ui/controls.js?v=99539125b4014e6b';
export const cleanupControls=mountControls(document.body);
