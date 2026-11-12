// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=d9735dada5500b56';

export {mountControls} from './ui/controls.js?v=d9735dada5500b56';
export const cleanupControls=mountControls(document.body);
