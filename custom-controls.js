// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=8eb0841135cc71ad';

export {mountControls} from './ui/controls.js?v=8eb0841135cc71ad';
export const cleanupControls=mountControls(document.body);
