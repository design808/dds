// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=37572f4be3f4fe6a';

export {mountControls} from './ui/controls.js?v=37572f4be3f4fe6a';
export const cleanupControls=mountControls(document.body);
