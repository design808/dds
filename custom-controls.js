// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=6cad35b561008178';

export {mountControls} from './ui/controls.js?v=6cad35b561008178';
export const cleanupControls=mountControls(document.body);
