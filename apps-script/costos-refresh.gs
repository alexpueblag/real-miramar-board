/** Real de Miramar · verificador de fuentes oficiales de costos.
 * Integrar en doPost con tipo=actualizar_costos después de validar Portero/admin.
 */
var COSTOS_FUENTES_ = [
  {id:'ley_guaymas_2026',url:'https://gestion.api.congresoson.gob.mx/assets/archivos/2025/12/oh_cgsfqGwj_0GaF5qPsad3N0WBHw31e.pdf'},
  {id:'uma_2026',url:'https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/uma/uma2026.pdf'}
];
function actualizarFuentesCostos_(){
  var ahora=new Date(), ss=SpreadsheetApp.getActive(), sh=ss.getSheetByName('FUENTES_COSTO')||ss.insertSheet('FUENTES_COSTO');
  if(sh.getLastRow()===0)sh.appendRow(['fuente_id','url','http_status','verificado_el','hash_contenido','nota']);
  var out=[];
  COSTOS_FUENTES_.forEach(function(f){var status=0,hash='',nota='';try{var r=UrlFetchApp.fetch(f.url,{muteHttpExceptions:true,followRedirects:true});status=r.getResponseCode();hash=Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,r.getBlob().getBytes())).slice(0,32);}catch(e){nota=String(e)}out.push([f.id,f.url,status,ahora,hash,nota]);});
  if(out.length)sh.getRange(sh.getLastRow()+1,1,out.length,out[0].length).setValues(out);
  return {ok:out.every(function(x){return x[2]>=200&&x[2]<400}),verificado_el:ahora.toISOString(),fuentes:out.map(function(x){return{fuente_id:x[0],status:x[2],hash:x[4]}})};
}
