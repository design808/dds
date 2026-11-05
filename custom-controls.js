// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=cbfddd8310a75f76';

export {mountControls} from './ui/controls.js?v=cbfddd8310a75f76';
export const cleanupControls=mountControls(document.body);
