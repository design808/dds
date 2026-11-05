// Documentation thumbnails use a logical scene, never the gallery card as a device.
// These are presentation widths; no service component or breakpoint is changed.
const widths=Object.freeze({
  button:320,'icon-button':240,checkbox:320,radio:280,switch:320,
  chip:440,tabs:400,breadcrumb:440,pagination:400,stepper:520,sidebar:280,
  avatar:440,card:360,table:640,alert:440,empty:360,
  'action-area':440,'button-group':360,'toggle-group':280,'filter-button':400,
  calendar:320,'segmented-control':400,'framed-style':440,'time-picker':360,
  'top-navigation':1100,'bottom-navigation':400,category:440,command:400,
  snackbar:480,'aspect-ratio':400,'play-badge':400,'list-card':440,attachment:480,
  carousel:400,resizable:480,'scroll-area':360,'message-scroller':440,
});

export function thumbnailSceneWidth(id){
  return widths[id]||(id==='chart'||id?.includes('chart')||id==='contributions'?640:360);
}

/** The complete scene fits both axes. There is no lower scale that can clip it. */
export function fitThumbnailScene(availableWidth,availableHeight,sceneWidth,sceneHeight){
  const dimensions=[availableWidth,availableHeight,sceneWidth,sceneHeight];
  if(!dimensions.every(value=>Number.isFinite(value)&&value>0))return null;
  const scale=Math.min(1,availableWidth/sceneWidth,availableHeight/sceneHeight);
  return {scale,width:sceneWidth*scale,height:sceneHeight*scale};
}
