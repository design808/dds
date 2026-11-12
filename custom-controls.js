// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=027b0a50880ecefb';

export {mountControls} from './ui/controls.js?v=027b0a50880ecefb';
export const cleanupControls=mountControls(document.body);
