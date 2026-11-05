/** Media is available only on the device-check and interview screens. */
export async function prepareNavigation(currentRoute,nextRoute,status,{pause,stopRecording,stopDevice}){
 if(currentRoute==='interview'&&status==='active'&&nextRoute!=='interview')await pause();
 if(!['guide','interview'].includes(nextRoute)){await stopRecording();stopDevice();}
}
