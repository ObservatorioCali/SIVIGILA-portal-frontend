Convenciones de tipos (JS)
===========================

Se migraron las definiciones TypeScript a JSDoc para:

- Mantener autocompletado en editores.
- Evitar dependencia de compilación TS.
- Facilitar futura re-introducción de TS si se desea (solo revertir a .ts).

Patrones:

1. Tipos de objetos mediante bloques `@typedef {Object} Nombre`.
2. Genéricos simples con `@template T`.
3. Constantes enumeradas con `Object.freeze`.
4. Fechas serializadas en API como `string` (ISO) para evitar confusión.

Si agregas nuevos tipos, usa el mismo estilo y agrúpalos por dominio.
