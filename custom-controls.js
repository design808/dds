// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=a0e474a8a17e958f';

export {mountControls} from './ui/controls.js?v=a0e474a8a17e958f';
export const cleanupControls=mountControls(document.body);
