<div align="center">

# au✳ — Alexander Ubeda

**Portafolio personal · Código, diseño & sonido**

Estudiante de Ingeniería en Computación en el Tecnológico de Costa Rica.
Programación, diseño web y producción audiovisual, con rumbo hacia la ciberseguridad.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Sin dependencias](https://img.shields.io/badge/dependencias-0-244b3b)
![Sin build](https://img.shields.io/badge/build-no%20necesario-d7f486?labelColor=20231f)

<!-- Cuando lo publiques, agrega aquí el enlace: [**Ver en vivo →**](https://tu-dominio) -->

[GitHub](https://github.com/ubeda-alex) · [LinkedIn](https://www.linkedin.com/in/ubeda-alex/) · [Instagram](https://www.instagram.com/ubeda_alex_/)

</div>

---

## Sobre el proyecto

Un sitio de una sola página, hecho a mano con **HTML, CSS y JavaScript puro**: sin frameworks, sin librerías y sin paso de compilación. La idea es que el propio sitio funcione como muestra de trabajo, con una interfaz de cristal inspirada en iOS, microinteracciones y atención a la accesibilidad.

## Lo que tiene

### Interfaz
- **Header de cristal tipo iOS**: degradado translúcido, `backdrop-filter` con blur y saturación, y un borde de luz hecho con máscaras.
- **Desenfoque progresivo**: cuatro capas con blur creciente y máscaras en degradado. El contenido se desenfoca poco a poco al pasar por detrás del header.
- **Modo claro / oscuro automático**: sigue la configuración del dispositivo, incluso si cambia en vivo. El botón sol/luna lo cambia durante la visita con una transición circular (View Transitions API).
- **Navegación con píldora deslizante**, como un *segmented control*: sigue al mouse y marca la sección visible.
- **Ventana de código** en el hero que se escribe sola, letra por letra.
- **Tarjetas con spotlight**: un brillo y un borde que siguen al cursor.

### Interacciones
- **Cursor personalizado**: un punto y un anillo con retraso (*lerp*) que cambia de forma sobre enlaces y proyectos.
- **Paleta de comandos** con <kbd>⌘</kbd> <kbd>K</kbd> / <kbd>Ctrl</kbd> <kbd>K</kbd> o <kbd>/</kbd>: navegar, abrir redes y copiar el enlace.
- **Texto *scramble*** en etiquetas y en la palabra que rota en el hero.
- **Contadores animados**, tilt 3D y botones magnéticos.
- **Ritmo con Web Audio**: una batería sintetizada en el navegador, sin archivos de audio.
- **Easter egg**: prueba el código Konami (↑ ↑ ↓ ↓ ← → ← → B A).

### Accesibilidad y rendimiento
- Respeta `prefers-reduced-motion`: sin animaciones para quien las desactiva.
- En pantallas táctiles se desactivan el cursor, el tilt y los efectos magnéticos.
- Enlace para saltar al contenido, `focus-visible`, `aria-*` y HTML semántico.
- Sin JavaScript, todo el contenido sigue visible.
- Los efectos de mouse se actualizan con `requestAnimationFrame` y listeners pasivos.

## Estructura

```
.
├── index.html   # Contenido y estructura
├── style.css    # Estilos, cristal, animaciones y responsive
├── script.js    # Interacciones (cursor, ⌘K, scramble, audio…)
└── README.md
```

## Correrlo localmente

No necesita instalar nada. Abre `index.html` en el navegador o, mejor, levanta un servidor local:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Publicarlo

Al ser un sitio estático, se puede publicar gratis en **GitHub Pages**, **Cloudflare Pages**, **Netlify** o **Vercel**: solo hay que apuntar a la raíz del repositorio. No hay comando de build.

## Personalizar

| Quiero cambiar… | Dónde |
|---|---|
| Colores | Variables en `:root`, al inicio de `style.css` |
| Proyectos | Sección `<!-- PROYECTOS -->` en `index.html` |
| Herramientas | Sección `<!-- HERRAMIENTAS -->` en `index.html` |
| Comandos de la paleta ⌘K | Arreglo `commands` en `script.js` |
| Palabras que rotan en el hero | Atributo `data-words` en `index.html` |

---

<div align="center">

Hecho con curiosidad en Costa Rica ✳ © Alexander Ubeda

</div>
