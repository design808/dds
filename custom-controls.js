// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=f963c57c0fc718c6';

export {mountControls} from './ui/controls.js?v=f963c57c0fc718c6';
export const cleanupControls=mountControls(document.body);
