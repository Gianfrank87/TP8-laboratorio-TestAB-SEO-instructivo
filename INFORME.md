# TP8 · Laboratorio A/B y SEO
**Programación Avanzada — Taller Norte**

## 1. Qué ve una persona asignada a B
La persona asignada a B ve el titular **«El curso empieza el 14 de abril. El cupo, no.»** y el CTA **«Reservar mi lugar»**. El title es **«Abril abre cupos: cursos de oficio en grupos de 12»** y la description es **«El 14 de abril empiezan grupos de doce. En la cohorte anterior, ocho de cada diez consiguieron trabajo en el rubro antes de los noventa días.»**. Este tratamiento enfatiza la fecha y el cupo. La oferta permanece igual que en A: el inicio es el 14 de abril, los cursos duran ocho semanas, son para doce personas por grupo y se puede estudiar carpintería, electricidad o cocina.

## 2. Qué debería ver un crawler
El crawler ve el control A en /practica, siempre. Un buscador puede no conservar cookies y recibir distintos textos en visitas sucesivas; por eso se fija A para agentes de búsqueda conocidos. El contenido comercial y la oferta no cambian: no se intenta engañar ni manipular el posicionamiento. El cloaking sí consiste en dar al buscador un contenido diferente al que reciben las personas para alterar los resultados.

## 3. Por qué el canonical no cambia
A y B son dos mensajes de una misma página, por eso los dos tienen canonical /practica. Indexar una ruta para cada variante o incluir el query en el canonical generaría duplicados y dispersaría las señales SEO. Los enlaces ?preview=a y ?preview=b se usan para revisar los mensajes: tienen noindex, no asignan cookies y no suman impresiones.

## Hash y comprobación
La función de asignación es **FNV-1a de 32 bits**. Se calcula el hash del identificador de visitante y se elige A si es par o B si es impar. Para **lab-visitor-demo-01** el resultado es estable en ejecuciones sucesivas; no existe sorteo durante el render. El identificador se mantiene 30 días mediante cookie httpOnly; las impresiones se deduplican por sesión de 30 minutos y las conversiones por visitante en una base SQLite/libSQL. El caso fijo se obtiene mediante división: A = 18/240 = **7,50%**, B = 31/236 = **13,14%**, diferencia = **5,64 pp**. Esa diferencia no basta para declarar ganador.
