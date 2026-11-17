// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=74e8957c2df4664c';

export {mountControls} from './ui/controls.js?v=74e8957c2df4664c';
export const cleanupControls=mountControls(document.body);
