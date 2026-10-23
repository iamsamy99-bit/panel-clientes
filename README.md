# Nexus Core — Portal de Operaciones y Clientes

Panel de control para clientes corporativos y operaciones financieras, diseñado bajo las directivas de **/taste-skill** (Anti-Slop, Arquetipo *The Quiet Instrument* y Arquitectura *Double-Bezel* de alta precisión).

## Características

- **Fricción Cero:** Cinta de acciones en 1-clic (Transferencias SPEI, Facturación SAT CFDI 4.0, Extractos).
- **Conmutador de Modo Claro / Modo Oscuro:** Botón táctil en el header, atajo de teclado (`T`), prevención de FOUC y persistencia en `localStorage`.
- **Arquitectura de Doble Bisel:** Contenedores concéntricos con relieve sutil y bordes de alta definición.
- **Gráfico Interactivo:** Flujo de fondos con filtros de periodo (7D, 30D, 90D, 1A) y tooltips dinámicos.
- **Tabla con Búsqueda en Vivo:** Filtrado instantáneo por texto y pills de estado (Completado, Pendiente, En Revisión).
- **Concierge VIP 24/7:** Asistencia directa y personalizada con un clic.
- **Command Palette (`⌘K` / `Ctrl+K`):** Navegación completa por teclado.

## Demostración en Vivo

Puedes acceder a la versión desplegada en:
👉 [https://iamsamy99-bit.github.io/panel-clientes/](https://iamsamy99-bit.github.io/panel-clientes/)

## Ejecución Local

```bash
cd panel-clientes
python3 -m http.server 3000
```
Abre tu navegador en `http://localhost:3000`.
