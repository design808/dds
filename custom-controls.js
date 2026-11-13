// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=0f53a279b3f975a6';

export {mountControls} from './ui/controls.js?v=0f53a279b3f975a6';
export const cleanupControls=mountControls(document.body);
