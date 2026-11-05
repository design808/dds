// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=2f0a2393132f45ea';

export {mountControls} from './ui/controls.js?v=2f0a2393132f45ea';
export const cleanupControls=mountControls(document.body);
