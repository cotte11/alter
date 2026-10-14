# ALTER — Guion del scroll

5 secciones. Cada una indica qué se ve, qué hace el 3D, el copy y las notas para mobile.
Los textos entre [corchetes] son pendientes.

---

## 1. Hero — La ronda

**Se ve:** los 4 envases en círculo, girando como en una ronda de comparsa, sobre un fondo con papel picado en los 4 colores de marca.

**3D:**
- La ronda gira lenta y continua. Además, cada envase rebota a un ritmo distinto, como bailando.
- Cuando un envase pasa por el frente, el fondo toma su color (transición suave).
- Con parámetro `?alter=X`: al cargar, la ronda frena ~1,5 s con ese personaje al frente y después sigue.
- Al empezar el scroll, la ronda se abre y los envases pasan a formar una fila (transición a la sección 2).

**Copy:**
- Logo ALTER
- *Tu mejor versión*
- Subtítulo: *¿Quién vas a ser hoy?*
- Indicador de scroll

**Mobile:** ronda vista un poco desde arriba (cámara inclinada) para que entre en vertical. Las botellas se ven más altas que las latas.

---

## 2. Manifiesto — Salen los personajes

**Se ve:** sección pinneada (~200vh). Los 4 envases alineados; al scrollear, cada personaje sale de su etiqueta.

**3D:**
- Cada personaje (PNG con alfa) arranca pequeño y pegado al envase, como parte de la etiqueta.
- Con el scroll: crece, se separa en Z y queda parado grande detrás de su envase. Desenfoque que se va limpiando al salir.
- Salida escalonada (stagger): de a uno, pero terminan los 4 juntos. Ninguno queda adelante.
- Confeti leve en los bordes.

**Copy (aparece por líneas, atado al scroll):**
1. *Detrás de una máscara no se esconde quién somos.*
2. *A veces se encuentra la posibilidad de ser aquello que normalmente no nos permitimos.*
3. *Transformarse no es dejar de ser uno mismo.*
4. *Elegí a quién vas a encarnar.*

**Mobile:** los 4 en fila no entran con los personajes grandes. Opción: grilla 2×2, o fila con la cámara haciendo un paneo horizontal atado al scroll.

---

## 3. Personajes — Uno por pantalla

**Se ve:** sección pinneada, 4 pasos. En cada paso, un personaje grande de fondo, su envase en primer plano y el fondo en su color.

**3D por paso:**
- El envase activo pasa al centro y los otros salen de cuadro.
- Rotación para mostrar la etiqueta completa.
- Apertura:
  - **Latas:** la anilla se levanta y sale un chorro de partículas del color del sabor.
  - **Botellas:** la tapa gira y sube (rotación Y + posición Y al mismo tiempo).
- Cambio de fondo por variable CSS.

**Orden sugerido:** Marimonda → Supay → Pujllay → Lucifer (alterna botella/lata y colores cálidos/fríos).

### Marimonda · amarillo · limón · botella 500 ml
- Carnaval de Barranquilla, Colombia
- Rasgos: irreverente, burlón, se ríe de todo y de todos.
- *Nació para burlarse de los que se toman demasiado en serio. Trompa larga, corbata y cero vergüenza.*
- **Esta noche soy Marimonda.**

### Supay · rojo · frutilla · lata 275 ml
- Diablada Pillareña, Ecuador
- Rasgos: intensidad, lo prohibido, el lado oscuro que todos tenemos.
- *El diablo de los Andes. El dueño de lo que pasa bajo tierra y de lo que no te animás a decir.*
- **Esta noche soy Supay.**

### Pujllay · celeste · arándano · botella 500 ml
- Carnaval de Humahuaca, Jujuy, Argentina
- Rasgos: juego, celebración, energía que no se corta. Pujllay significa "jugar" en quechua.
- *Pujllay es jugar. Espuelas, sombrero de cuernos y ganas de que la fiesta no termine.*
- **Esta noche soy Pujllay.**

### Lucifer · verde · manzana · lata 275 ml
- Carnaval de Oruro, Bolivia
- Rasgos: liderazgo, desafío, el que va adelante.
- *El que encabeza la diablada. No sigue a nadie: los demás lo siguen a él.*
- **Esta noche soy Lucifer.**

**Formatos (integrados en esta sección):**
- Lata 275 ml → *Para la previa.*
- Botella 500 ml → *Para aguantar todo el corso.*
Mostrar como una línea corta debajo del sabor en cada paso.

**Mobile:** personaje arriba (40% de la pantalla), envase al centro, texto abajo.

---

## 4. Carnaval — Imágenes vivas

**Se ve:** descanso del 3D. Fotos de corsos, comparsas, murgas y previas. Sin grilla estática.

**Efectos (combinar 2):**
- **Color que se enciende (principal):** las fotos entran en blanco y negro y se colorean al pasar por el centro de la pantalla. Es el concepto "alter" aplicado a la foto.
- **Distorsión por velocidad:** shader leve (RGB shift u ondulación) que responde a la velocidad del scroll.
- **Tira horizontal:** en mobile, las fotos corren de costado mientras el scroll es vertical.
- Alternativa: fotos recortadas dentro de siluetas de las máscaras de los personajes.

**Copy (3 momentos, uno por bloque de fotos):**
- *La previa.*
- *El corso.*
- *Cuando ya no queda nadie.*

**3D:** envases chicos o fuera de cuadro. Bajar `dpr` o pausar el render del canvas.

---

## 5. Cierre — La comparsa

**Se ve:** los 4 envases al centro en formación de comparsa (arco o V), con los 4 personajes detrás y confeti cayendo.

**3D:**
- Entrada de los 4 envases al mismo tiempo, sin jerarquía.
- Al terminar el scroll, la cámara sigue levemente al mouse (desktop) o al giroscopio (mobile, si hay permiso) para que la escena tenga vida quieta.

**Copy:**
- *ALTER. Dejalo salir.*
- CTA: [definir — dónde comprar / Instagram / distribuidores]

---

## Pendientes
- [ ] Carnaval de Supay y de Lucifer (¿los dos de la diablada de Oruro? Si comparten carnaval: presentarlos como "dos caras de la diablada").
- [ ] Revisar rasgos y copy de cada personaje.
- [ ] CTA final.
- [ ] Dominio definitivo y URLs de los QR (antes de imprimir etiquetas).
- [ ] Corregir "500 ml" en las etiquetas de lata → 275 ml.
- [ ] Hex exactos de la paleta y nombres de tipografías.
