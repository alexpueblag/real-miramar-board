# Real de Miramar · Ruta de Valor

Tablero interno de tramitología del desarrollo Real de Miramar (Guaymas, Sonora),
co-desarrollo YoDesarrollo. No se indexa.

## Acceso (Portero YOD) — cierre de seguridad 2026-07-14

El acceso lo gobierna el **Portero YOD** (liga mágica de 90 días, clave de equipo o Google),
en **gate duro**: sin credencial válida el board no muestra nada.

- Toda lectura y escritura viaja con la credencial del Portero (`k`), y **el servidor la valida**
  server-to-server (board=RM, respeta permisos por-board de ACCESOS). Sin ella el backend
  responde `{ ok:false, error:'liga' }` y no entrega ni un dato (fail-closed).
- La caché local solo se pinta si hay credencial; al rechazarla se limpia y el Portero vuelve a pedir acceso.
- **Antes de este cierre**, `?recurso=board` servía los datos sin credencial y la "clave de vista"
  era solo del cliente (bypasseable) — el board confidencial quedaba abierto a cualquiera con la URL.
- La clave **financiera** (`fin`, para cuentas/dirección) sigue siendo una segunda capa encima,
  validada por el servidor. **Portero = ver el board · fin = ver el dinero.**

### Pendiente (una vez) para activar el cierre en el servidor
1. Pega `apps-script/portero-auth.gs` en el Apps Script de Miramar.
2. En `doGet` (`recurso=board`) y `doPost`, exige `credencialValida_(k)` al inicio (instrucciones dentro del archivo).
3. Deja intacta la validación de la clave financiera (`fin`).
4. Implementar → Administrar implementaciones → ✏️ → Nueva versión (conserva la URL `/exec`).

Los montos financieros y la escritura requieren sus propias claves (no incluidas en este repo).
