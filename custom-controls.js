// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=2ba405c41d82bf19';

export {mountControls} from './ui/controls.js?v=2ba405c41d82bf19';
export const cleanupControls=mountControls(document.body);
