// Documentation-only entry point. Services import mountControls and choose a root.
import {mountControls} from './ui/controls.js?v=6259b05e21604bbd';

export {mountControls} from './ui/controls.js?v=6259b05e21604bbd';
export const cleanupControls=mountControls(document.body);
