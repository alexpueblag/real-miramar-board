/**
 * Real de Miramar · Cierre de seguridad con el Portero YOD
 * =====================================================================
 * ANTES: `?recurso=board` servía los datos del board (trámites, hitos,
 * documentos, avance) SIN credencial — la "clave de vista" era solo del
 * lado del cliente (bypasseable con F12) y el /exec es público. Board
 * confidencial servido a cualquiera.
 *
 * AHORA: el front (board.js) manda la credencial del Portero (`k`) en cada
 * lectura y escritura. Este módulo la valida server-to-server contra el
 * Portero (board=RM) y sin credencial válida responde
 * { ok:false, error:'liga' } y no entrega ni un dato (fail-closed).
 *
 * La clave FINANCIERA (`fin`) sigue igual: es una segunda capa encima de
 * esta, para cuentas/dirección. Portero = ver el board · fin = ver el dinero.
 *
 * ---------------------------------------------------------------------
 * CÓMO CONECTAR (una vez, en el Apps Script de Real de Miramar):
 *   1. Pega este archivo completo como un .gs más del proyecto.
 *   2. En tu doGet, al INICIO del manejo de `recurso=board` (y de cualquier
 *      otro recurso que devuelva datos), agrega:
 *
 *        var k = (e.parameter && e.parameter.k) || '';
 *        if (!credencialValida_(k)) return salidaJson_({ ok:false, error:'liga' });
 *
 *   3. En tu doPost (escrituras: config, trámites, etc.), al inicio:
 *
 *        if (!credencialValida_((payload && payload.k) || '')) {
 *          return salidaJson_({ ok:false, error:'liga' });
 *        }
 *
 *      (Sustituye salidaJson_ por tu helper real de respuesta JSON.)
 *   4. Deja INTACTA la validación de la clave financiera (`fin`): es capa aparte.
 *   5. Implementar → Administrar implementaciones → ✏️ (lápiz) → Nueva versión
 *      → Implementar. (Edita la EXISTENTE; NO crees una nueva o cambia la URL /exec.)
 */

// Endpoint del Portero YOD (potenciales-yod) — valida ligas, claves y sesiones.
var PORTERO_EXEC = 'https://script.google.com/macros/s/AKfycbwlDDCWWzOWYZsUpBU9uqsQ7aenQ469PF6s6FkNlBFS1_cJSU5njG9oQmuyELy5zlqzFg/exec';
var AUTH_TTL_OK  = 600;  // 10 min de caché para credenciales válidas
var AUTH_TTL_BAD = 60;   // 1 min para rechazadas (reintentos rápidos tras dar de alta)

/**
 * Valida la credencial del Portero (server-to-server) con board=RM, así que
 * respeta los permisos por-board de ACCESOS (solo entra quien tenga RM o '*').
 * Caché por hash para no golpear al Portero en cada request. Fail-closed.
 */
function credencialValida_(k) {
  k = String(k || '').trim();
  if (k.length < 4) return false;

  var cache = CacheService.getScriptCache();
  var ck = 'auth_' + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, k)).slice(0, 24);
  var hit = cache.get(ck);
  if (hit) return hit === '1';

  var ok = false;
  try {
    var r = UrlFetchApp.fetch(PORTERO_EXEC + '?recurso=canje&board=RM&t=' + encodeURIComponent(k),
      { muteHttpExceptions: true, followRedirects: true });
    var j = JSON.parse(r.getContentText());
    ok = !!(j && j.ok);
  } catch (err) {
    ok = false;  // Portero inaccesible → fail-closed
  }
  cache.put(ck, ok ? '1' : '0', ok ? AUTH_TTL_OK : AUTH_TTL_BAD);
  return ok;
}
