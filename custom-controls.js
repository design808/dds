// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=5ea18bdc1c6e31ff';

export {mountControls} from './ui/controls.js?v=5ea18bdc1c6e31ff';
export const cleanupControls=mountControls(document.body);
