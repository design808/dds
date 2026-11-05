// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=b011fb4a3d820cd2';

export {mountControls} from './ui/controls.js?v=b011fb4a3d820cd2';
export const cleanupControls=mountControls(document.body);
