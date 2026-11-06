// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=1d5b404f43a62e77';

export {mountControls} from './ui/controls.js?v=1d5b404f43a62e77';
export const cleanupControls=mountControls(document.body);
