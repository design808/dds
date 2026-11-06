// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=a2e5a753966dbe54';

export {mountControls} from './ui/controls.js?v=a2e5a753966dbe54';
export const cleanupControls=mountControls(document.body);
