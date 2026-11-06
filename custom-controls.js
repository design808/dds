// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=485f1f5fc9ef459b';

export {mountControls} from './ui/controls.js?v=485f1f5fc9ef459b';
export const cleanupControls=mountControls(document.body);
