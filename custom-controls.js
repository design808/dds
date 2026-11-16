// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=e0a33ceb6c034018';

export {mountControls} from './ui/controls.js?v=e0a33ceb6c034018';
export const cleanupControls=mountControls(document.body);
