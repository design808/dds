// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=c0b7fefa1c3d8659';

export {mountControls} from './ui/controls.js?v=c0b7fefa1c3d8659';
export const cleanupControls=mountControls(document.body);
