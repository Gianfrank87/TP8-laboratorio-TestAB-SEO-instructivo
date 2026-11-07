# TP8 — Taller Norte
Laboratorio A/B y SEO · Programación Avanzada 2026.

## Ejecutar
Requiere Node.js 20+. Instalar dependencias con npm install, copiar .env.example a .env.local y ejecutar npm run dev.

- Práctica: http://localhost:3000/practica
- Bitácora: http://localhost:3000/bitacora
- Preview A: http://localhost:3000/practica?preview=a
- Preview B: http://localhost:3000/practica?preview=b

SQLite local se crea automáticamente como local.db. Para desplegar en plataformas sin almacenamiento persistente configurar DATABASE_URL y DATABASE_AUTH_TOKEN de una base libSQL remota. Definir NEXT_PUBLIC_SITE_URL con el dominio final para obtener el canonical correcto.

## Pruebas
Ejecutar npm test. La asignación utiliza FNV-1a y cookies httpOnly, el preview no afecta la asignación y lleva noindex, los eventos se almacenan en la base y se deduplican.

El informe está en INFORME.md. La bitácora calcula A = 7,50%, B = 13,14% y la diferencia de 5,64 pp sin valores de tasa escritos manualmente.
