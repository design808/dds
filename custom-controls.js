// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=189cfecb45f30e1e';

export {mountControls} from './ui/controls.js?v=189cfecb45f30e1e';
export const cleanupControls=mountControls(document.body);
