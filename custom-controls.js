// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=30a3948cfc3adddc';

export {mountControls} from './ui/controls.js?v=30a3948cfc3adddc';
export const cleanupControls=mountControls(document.body);
