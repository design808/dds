// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=610ff83a2c7af4db';

export {mountControls} from './ui/controls.js?v=610ff83a2c7af4db';
export const cleanupControls=mountControls(document.body);
