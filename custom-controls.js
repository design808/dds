// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=7a9142d15652404b';

export {mountControls} from './ui/controls.js?v=7a9142d15652404b';
export const cleanupControls=mountControls(document.body);
