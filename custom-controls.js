// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=fe0196f67fe7cf68';

export {mountControls} from './ui/controls.js?v=fe0196f67fe7cf68';
export const cleanupControls=mountControls(document.body);
