// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=0633938e4f032d79';

export {mountControls} from './ui/controls.js?v=0633938e4f032d79';
export const cleanupControls=mountControls(document.body);
