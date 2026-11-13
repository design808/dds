// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=397886dd51872b8b';

export {mountControls} from './ui/controls.js?v=397886dd51872b8b';
export const cleanupControls=mountControls(document.body);
