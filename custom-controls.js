// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=1fe6ce322b8635fc';

export {mountControls} from './ui/controls.js?v=1fe6ce322b8635fc';
export const cleanupControls=mountControls(document.body);
