/*
 * Real de Miramar — frontend público cerrado por defecto.
 * No añadir endpoints, claves, snapshots ni datos del proyecto aquí.
 * La reapertura requiere identidad y autorización del lado del servidor.
 */
(function(){
  "use strict";
  ["rm_cache_v3","rm_unlock_v1","rm_fin_v1","pyod_clave_v1"].forEach(function(key){try{localStorage.removeItem(key);sessionStorage.removeItem(key);}catch(_){}});
  ["rm_edit_v1","rm_admin_v1","RM_PORTERO"].forEach(function(key){try{sessionStorage.removeItem(key);}catch(_){}});
  window.Board=Object.freeze({status:"MAINTENANCE",version:"secure-1"});
})();
