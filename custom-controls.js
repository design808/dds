// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=dda57a46ecc92c81';

export {mountControls} from './ui/controls.js?v=dda57a46ecc92c81';
export const cleanupControls=mountControls(document.body);
