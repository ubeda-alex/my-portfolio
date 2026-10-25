document.documentElement.classList.add('js');

(() => {

  const root =
    document.documentElement;

  const reduced =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

  const finePointer =
    window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;

  const isMac =
    /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);


  /* =========================
     AÑO AUTOMÁTICO
  ========================= */

  const year =
    document.getElementById('year');

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* =========================
     RELOJ DE COSTA RICA
  ========================= */

  const clock =
    document.querySelector('.clock');

  if (clock) {

    const format =
      new Intl.DateTimeFormat('es-CR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Costa_Rica'
      });

    const tick = () => {
      clock.textContent = format.format(new Date());
    };

    tick();
    setInterval(tick, 15000);

  }


  /* =========================
     TOAST
  ========================= */

  const toastEl =
    document.querySelector('.toast');

  let toastTimer;

  const toast = (message) => {

    if (!toastEl) return;

    toastEl.textContent = message;
    toastEl.classList.add('is-on');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(
      () => toastEl.classList.remove('is-on'),
      2600
    );

  };


  /* =========================
     MODO OSCURO

     Manda el dispositivo: el <script> del
     <head> pone el tema inicial y aquí se
     sigue cualquier cambio del sistema.
     El botón solo lo cambia durante
     esta visita (no se guarda).
  ========================= */

  const themeMeta =
    document.querySelector('meta[name="theme-color"]');

  const themeButton =
    document.querySelector('[data-theme-toggle]');

  const applyTheme = (theme) => {

    root.dataset.theme = theme;

    if (themeMeta) {
      themeMeta.content = theme === 'dark' ? '#131814' : '#f2efe9';
    }

    if (themeButton) {
      themeButton.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }

  };


  const toggleTheme = (event) => {

    const next =
      root.dataset.theme === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition || reduced) {
      applyTheme(next);
      return;
    }

    // Centro del círculo: el clic, o el botón si fue con teclado
    let x = event && event.clientX;
    let y = event && event.clientY;

    if (!x && !y && themeButton) {
      const rect = themeButton.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    x = x || window.innerWidth / 2;
    y = y || 0;

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition =
      document.startViewTransition(() => applyTheme(next));

    transition.ready.then(() => {

      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 650,
          easing: 'cubic-bezier(.4, 0, .2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );

    });

  };


  applyTheme(root.dataset.theme || 'light');

  // Borra la preferencia que guardaba la versión anterior
  try {
    localStorage.removeItem('theme');
  } catch (e) {}

  if (themeButton) {
    themeButton.addEventListener('click', toggleTheme);
  }


  // Cambia en vivo si el dispositivo pasa a modo claro u oscuro
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      applyTheme(event.matches ? 'dark' : 'light');
    });


  /* =========================
     BARRA DE SCROLL
     + HEADER DE CRISTAL
  ========================= */

  // La de arriba (PC) y la del header (táctiles)
  const progressBars =
    document.querySelectorAll(
      '.scroll-progress span, .header-progress'
    );


  const updateProgress = () => {

    const max =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const value =
      max > 0
        ? window.scrollY / max
        : 0;

    progressBars.forEach((bar) => {
      bar.style.transform =
        `scaleX(${Math.min(1, Math.max(0, value))})`;
    });

    // Activa el blur progresivo y el header más "flotante"
    root.classList.toggle(
      'is-scrolled',
      window.scrollY > 24
    );

  };


  updateProgress();

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });


  /* =========================
     TEXTO SCRAMBLE

     Las letras se "revuelven" con
     símbolos y se van acomodando.
  ========================= */

  const GLYPHS = '!<>-_\\/[]{}=+*^?#01';

  const scramble = (el, finalText) => {

    const target =
      finalText ?? el.dataset.text ?? el.textContent.trim();

    if (reduced) {
      el.textContent = target;
      return;
    }

    cancelAnimationFrame(el._scramble);

    const start = performance.now();
    const duration = 650;

    const frame = (now) => {

      const progress =
        Math.min(1, (now - start) / duration);

      const fixed =
        Math.floor(progress * target.length);

      let out = '';

      for (let i = 0; i < target.length; i++) {

        const char = target[i];

        out +=
          i < fixed || char === ' '
            ? char
            : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

      }

      el.textContent = out;

      if (progress < 1) {
        el._scramble = requestAnimationFrame(frame);
      }

    };

    el._scramble = requestAnimationFrame(frame);

  };


  document
    .querySelectorAll('[data-scramble]')
    .forEach((el) => {
      el.dataset.text = el.textContent.trim();
    });


  /* =========================
     CONTADORES
  ========================= */

  const countUp = (el) => {

    const target = Number(el.dataset.count);

    if (reduced || !target) return;

    const start = performance.now();
    const duration = 1300;

    const frame = (now) => {

      const t = Math.min(1, (now - start) / duration);

      // easeOutCubic: rápido al inicio, suave al final
      const eased = 1 - Math.pow(1 - t, 3);

      el.textContent = Math.round(eased * target);

      if (t < 1) requestAnimationFrame(frame);

    };

    requestAnimationFrame(frame);

  };


  /* =========================
     APARICIÓN AL HACER SCROLL
  ========================= */

  const onReveal = (el) => {

    el
      .querySelectorAll('[data-scramble]')
      .forEach((item) => scramble(item));

    el
      .querySelectorAll('[data-count]')
      .forEach(countUp);

  };


  if (!reduced) {

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            if (entry.isIntersecting) {

              entry.target.classList.add('is-visible');

              onReveal(entry.target);

              observer.unobserve(entry.target);

            }

          });

        },

        {
          threshold: 0.13,
          rootMargin: '0px 0px -4% 0px'
        }

      );


    document
      .querySelectorAll('.reveal')
      .forEach((el, index) => {

        el.style.transitionDelay =
          `${Math.min(index % 4, 3) * 70}ms`;

        observer.observe(el);

      });

  }

  else {

    document
      .querySelectorAll('.reveal')
      .forEach((el) => el.classList.add('is-visible'));

  }


  /* =========================
     PALABRA QUE ROTA (HERO)
  ========================= */

  const rotator =
    document.querySelector('.rotator');

  if (rotator && !reduced) {

    const words =
      rotator.dataset.words.split(',');

    let index = 0;

    setInterval(() => {

      index = (index + 1) % words.length;

      scramble(rotator, words[index]);

    }, 2600);

  }


  /* =========================
     MÁQUINA DE ESCRIBIR

     Guarda el código del HTML,
     lo borra y lo escribe de nuevo.
  ========================= */

  const code =
    document.querySelector('.code code');

  if (code && !reduced) {

    const segments =
      [...code.childNodes].map((node) => ({
        cls: node.nodeType === 1 ? node.className : null,
        text: node.textContent
      }));

    const caret =
      document.createElement('span');

    caret.className = 'caret';

    code.textContent = '';

    let seg = 0;
    let pos = 0;
    let current = null;

    const type = () => {

      if (seg >= segments.length) {
        code.appendChild(caret);
        return;
      }

      const { cls, text } = segments[seg];

      if (!current) {

        current = cls
          ? Object.assign(document.createElement('span'), { className: cls })
          : document.createTextNode('');

        code.appendChild(current);

      }

      const char = text[pos];

      current.textContent += char;

      code.appendChild(caret);

      pos++;

      if (pos >= text.length) {
        seg++;
        pos = 0;
        current = null;
      }

      // Pausa más larga en los saltos de línea
      const delay =
        char === '\n'
          ? 140
          : 18 + Math.random() * 38;

      setTimeout(type, delay);

    };

    setTimeout(type, 700);

  }


  /* =========================
     NAV CON PÍLDORA DESLIZANTE
  ========================= */

  const nav =
    document.querySelector('nav');

  const indicator =
    nav && nav.querySelector('.nav-indicator');

  if (nav && indicator) {

    const links =
      [...nav.querySelectorAll('a')];

    let active = null;

    const moveTo = (link) => {

      // offsetParent es null si el link está oculto (móvil)
      if (!link || link.offsetParent === null) {
        indicator.classList.remove('is-on');
        return;
      }

      indicator.style.setProperty('--nav-x', `${link.offsetLeft}px`);
      indicator.style.setProperty('--nav-w', `${link.offsetWidth}px`);

      indicator.classList.add('is-on');

    };


    links.forEach((link) => {
      link.addEventListener('pointerenter', () => moveTo(link));
    });

    nav.addEventListener('pointerleave', () => moveTo(active));

    window.addEventListener('resize', () => moveTo(active), { passive: true });


    const sectionObserver =
      new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            active =
              links.find(
                (link) => link.getAttribute('href') === `#${entry.target.id}`
              ) || null;

            links.forEach((link) => {
              link.toggleAttribute('aria-current', link === active);
            });

            if (!nav.matches(':hover')) moveTo(active);

          });

        },

        {
          rootMargin: '-45% 0px -50% 0px'
        }

      );


    document
      .querySelectorAll('main section')
      .forEach((section) => sectionObserver.observe(section));

  }


  /* =========================
     RITMO CON WEB AUDIO

     Batería sintetizada: bombo,
     caja y hi-hat, sin archivos.
  ========================= */

  let audio = null;
  let noise = null;
  let playing = false;

  const getAudio = () => {

    if (!audio) {

      audio = new (window.AudioContext || window.webkitAudioContext)();

      noise = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);

      const data = noise.getChannelData(0);

      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

    }

    audio.resume();

    return audio;

  };


  const kick = (ctx, t) => {

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.12);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(gain).connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);

  };


  const hit = (ctx, t, freq, volume, length) => {

    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    src.buffer = noise;

    filter.type = 'highpass';
    filter.frequency.value = freq;

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + length);

    src.connect(filter).connect(gain).connect(ctx.destination);

    src.start(t);
    src.stop(t + length + 0.02);

  };


  const playButton =
    document.querySelector('.rhythm-play');

  const beats =
    [...document.querySelectorAll('.rhythm span')];


  const playRhythm = () => {

    if (playing) return;

    playing = true;

    const ctx = getAudio();

    // 2 compases de corcheas a 112 BPM
    const step = 60 / 112 / 2;
    const start = ctx.currentTime + 0.06;
    const steps = 16;

    if (playButton) {
      playButton.classList.add('is-playing');
      playButton.textContent = '♪ Sonando…';
    }

    for (let i = 0; i < steps; i++) {

      const t = start + i * step;
      const beat = i % 8;

      hit(ctx, t, 7000, 0.18, 0.05);

      if (beat === 0 || beat === 4 || i === 13) kick(ctx, t);

      if (beat === 2 || beat === 6) hit(ctx, t, 1200, 0.55, 0.16);

      setTimeout(() => {

        beats.forEach((b, index) => {
          b.classList.toggle('is-beat', index === beat);
        });

        const mark = document.querySelector('.sub-music');
        if (mark && (beat === 0 || beat === 2 || beat === 4 || beat === 6)) {
          mark.classList.add('is-beat');
          setTimeout(() => mark.classList.remove('is-beat'), 90);
        }

      }, (t - ctx.currentTime) * 1000);

    }

    setTimeout(() => {

      beats.forEach((b) => b.classList.remove('is-beat'));

      if (playButton) {
        playButton.classList.remove('is-playing');
        playButton.textContent = '▶︎ Escuchar el ritmo';
      }

      playing = false;

    }, (steps * step + 0.2) * 1000);

  };


  if (playButton) {
    playButton.addEventListener('click', playRhythm);
  }


  /* =========================
     MODO FIESTA (KONAMI)
     ↑ ↑ ↓ ↓ ← → ← → B A
  ========================= */

  // Lluvia de la marca: asteriscos y submarcas, cada una con su animación
  const RAIN = [
    { k: 'au',    light: '#244B3B', dark: '#D7F486' },
    { k: 'films', light: '#D9573F', dark: '#FF8A6B' },
    { k: 'music', light: '#6E9A1F', dark: '#D7F486' },
    { k: 'dev',   light: '#C2417F', dark: '#E25C9B' },
  ];
  let rain = null, rainTimer = null;

  const starSVG = () => {
    let lines = '';
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4;
      lines += `<line style="--i:${i}" pathLength="1" x1="0" y1="0" x2="${(Math.sin(a) * 115).toFixed(1)}" y2="${(-Math.cos(a) * 115).toFixed(1)}"/>`;
    }
    return `<svg viewBox="-140 -140 280 280"><g class="ast" stroke-width="50" stroke-linecap="round" fill="none">${lines}</g></svg>`;
  };

  const lockupSVG = (k) => {
    const src = k === 'au' ? document.querySelector('.brand-logo') : document.querySelector(`.sub-${k}`);
    if (!src) return null;
    const svg = src.cloneNode(true);
    svg.removeAttribute('class'); svg.removeAttribute('style');
    svg.removeAttribute('role'); svg.removeAttribute('aria-label');
    return svg.outerHTML;
  };

  const drop = () => {
    if (!rain || rain.childElementCount > 46) return;
    const t = RAIN[Math.floor(Math.random() * RAIN.length)];
    const lockup = Math.random() < .28;
    const html = lockup ? lockupSVG(t.k) : starSVG();
    if (!html) return;
    const el = document.createElement('div');
    el.className = 'au-drop';
    el.dataset.k = t.k;
    const dark = root.dataset.theme === 'dark';
    const dur = 3.6 + Math.random() * 3.2;
    el.style.cssText =
      `left:${Math.random() * 96}vw;--dur:${dur}s;--c:${dark ? t.dark : t.light};` +
      `--size:${lockup ? 16 + Math.random() * 12 : 16 + Math.random() * 30}px;` +
      `--drift:${(Math.random() - .5) * 160}px;` +
      `--r0:${lockup ? (Math.random() - .5) * 20 : Math.random() * 90}deg;` +
      `--r1:${lockup ? (Math.random() - .5) * 30 : 90 + Math.random() * 180}deg`;
    el.innerHTML = html;
    el.addEventListener('animationend', (e) => { if (e.target === el) el.remove(); });
    rain.appendChild(el);
  };

  const startRain = () => {
    if (reduced || rain) return;
    rain = document.createElement('div');
    rain.className = 'au-rain';
    rain.setAttribute('aria-hidden', 'true');
    document.body.appendChild(rain);
    for (let i = 0; i < 26; i++) setTimeout(drop, i * 55);   // ráfaga inicial
    rainTimer = setInterval(drop, 300);
  };

  const stopRain = () => {
    clearInterval(rainTimer); rainTimer = null;
    if (!rain) return;
    const r = rain; rain = null;
    r.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' });
    setTimeout(() => r.remove(), 650);
  };

  const toggleParty = () => {

    const on = root.classList.toggle('party');

    toast(on ? '✳︎ Modo fiesta · siempre hay algo más' : 'Modo fiesta desactivado');

    if (on) { playRhythm(); startRain(); } else { stopRain(); }

  };


  const konami = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  let konamiIndex = 0;

  window.addEventListener('keydown', (event) => {

    const key =
      event.key.length === 1 ? event.key.toLowerCase() : event.key;

    konamiIndex =
      key === konami[konamiIndex]
        ? konamiIndex + 1
        : key === konami[0] ? 1 : 0;

    if (konamiIndex === konami.length) {
      konamiIndex = 0;
      toggleParty();
    }

  });


  /* =========================
     PALETA DE COMANDOS (⌘K)
  ========================= */

  const palette =
    document.querySelector('.palette');

  const paletteInput =
    palette && palette.querySelector('input');

  const paletteList =
    palette && palette.querySelector('.palette-list');

  if (!isMac) {
    document
      .querySelectorAll('.k-key')
      .forEach((key) => { key.textContent = 'Ctrl K'; });
  }


  const closePalette = () => {
    if (palette && palette.open) palette.close();
  };


  const go = (hash) => {

    closePalette();

    const target = document.querySelector(hash);

    if (target) {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', hash);
    }

  };


  const openUrl = (url) => {
    closePalette();
    window.open(url, '_blank', 'noopener');
  };


  const copyLink = () => {

    closePalette();

    const url = location.href.split('#')[0];

    navigator.clipboard
      .writeText(url)
      .then(() => toast('Enlace copiado ✓'))
      .catch(() => toast('No se pudo copiar el enlace'));

  };


  const commands = [
    { group: 'Ir a', icon: '⌂', label: 'Inicio', run: () => go('#inicio') },
    { group: 'Ir a', icon: '01', label: 'Sobre mí', run: () => go('#sobre-mi') },
    { group: 'Ir a', icon: '02', label: 'Lo que hago', run: () => go('#universo') },
    { group: 'Ir a', icon: '03', label: 'Proyectos', run: () => go('#proyectos') },
    { group: 'Ir a', icon: '04', label: 'Herramientas', run: () => go('#herramientas') },
    { group: 'Ir a', icon: '05', label: 'Mi rumbo', run: () => go('#rumbo') },
    { group: 'Ir a', icon: '06', label: 'Contacto', run: () => go('#contacto') },

    { group: 'Enlaces', icon: '↗︎', label: 'GitHub', hint: 'ubeda-alex', run: () => openUrl('https://github.com/ubeda-alex') },
    { group: 'Enlaces', icon: '↗︎', label: 'LinkedIn', hint: 'ubeda-alex', run: () => openUrl('https://www.linkedin.com/in/ubeda-alex/') },
    { group: 'Enlaces', icon: '↗︎', label: 'Instagram', hint: 'ubeda_alex_', run: () => openUrl('https://www.instagram.com/ubeda_alex_/') },

    { group: 'Acciones', icon: '◐', label: 'Cambiar tema claro / oscuro', hint: 'tema', run: () => { closePalette(); toggleTheme(); } },
    { group: 'Acciones', icon: '⧉', label: 'Copiar enlace del portafolio', run: copyLink },
    { group: 'Acciones', icon: '♪', label: 'Escuchar el ritmo', run: () => { closePalette(); playRhythm(); } },
    { group: 'Acciones', icon: '✳︎', label: 'Modo fiesta', hint: 'secreto', run: () => { closePalette(); toggleParty(); } }
  ];


  // Quita tildes para que "sobre mi" encuentre "Sobre mí"
  const normalize = (text) =>
    text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase();


  let visible = [];
  let selected = 0;


  const renderPalette = () => {

    const query = normalize(paletteInput.value.trim());

    visible =
      commands.filter((cmd) =>
        normalize(`${cmd.group} ${cmd.label} ${cmd.hint || ''}`).includes(query)
      );

    selected = Math.min(selected, Math.max(visible.length - 1, 0));

    paletteList.textContent = '';

    if (!visible.length) {

      const empty = document.createElement('li');

      empty.className = 'palette-empty';
      empty.textContent = 'Nada por aquí… prueba con otra palabra.';

      paletteList.appendChild(empty);

      return;

    }

    let lastGroup = '';

    visible.forEach((cmd, index) => {

      if (cmd.group !== lastGroup) {

        const group = document.createElement('li');

        group.className = 'palette-group';
        group.setAttribute('role', 'presentation');
        group.textContent = cmd.group.toUpperCase();

        paletteList.appendChild(group);

        lastGroup = cmd.group;

      }

      const item = document.createElement('li');

      item.className = 'palette-item';
      item.id = `cmd-${index}`;
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', index === selected);

      item.innerHTML =
        `<span class="pi-icon" aria-hidden="true"></span><span></span>${cmd.hint ? '<small></small>' : ''}`;

      item.children[0].textContent = cmd.icon;
      item.children[1].textContent = cmd.label;

      if (cmd.hint) item.children[2].textContent = cmd.hint;

      item.addEventListener('pointermove', () => {
        if (selected !== index) {
          selected = index;
          updateSelection();
        }
      });

      item.addEventListener('click', () => cmd.run());

      paletteList.appendChild(item);

    });

    updateSelection();

  };


  const updateSelection = () => {

    paletteList
      .querySelectorAll('.palette-item')
      .forEach((item, index) => {

        const isSelected = index === selected;

        item.setAttribute('aria-selected', isSelected);

        if (isSelected) {
          item.scrollIntoView({ block: 'nearest' });
          paletteInput.setAttribute('aria-activedescendant', item.id);
        }

      });

  };


  const openPalette = () => {

    if (!palette || palette.open) return;

    paletteInput.value = '';
    selected = 0;

    renderPalette();

    root.classList.remove('has-cursor');

    palette.showModal();
    paletteInput.focus();

  };


  if (palette) {

    paletteInput.addEventListener('input', () => {
      selected = 0;
      renderPalette();
    });


    paletteInput.addEventListener('keydown', (event) => {

      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {

        event.preventDefault();

        if (!visible.length) return;

        const dir = event.key === 'ArrowDown' ? 1 : -1;

        selected = (selected + dir + visible.length) % visible.length;

        updateSelection();

      }

      if (event.key === 'Enter' && visible[selected]) {
        event.preventDefault();
        visible[selected].run();
      }

    });


    // Click fuera del cuadro (en el fondo) cierra
    palette.addEventListener('click', (event) => {
      if (event.target === palette) closePalette();
    });


    palette.addEventListener('close', () => {
      if (cursorOn) root.classList.add('has-cursor');
    });


    document
      .querySelectorAll('[data-palette-open]')
      .forEach((btn) => btn.addEventListener('click', openPalette));


    window.addEventListener('keydown', (event) => {

      const typing =
        /INPUT|TEXTAREA/.test(document.activeElement.tagName);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {

        event.preventDefault();

        palette.open ? closePalette() : openPalette();

      }

      else if (event.key === '/' && !typing && !palette.open) {

        event.preventDefault();

        openPalette();

      }

    });

  }


  /* =========================
     EFECTOS CON MOUSE
  ========================= */

  let cursorOn = false;

  if (
    finePointer &&
    !reduced
  ) {

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 4;

    let ticking = false;


    /*
       Movimiento global del fondo.
    */

    const paintPointer = () => {

      const nx = pointerX / window.innerWidth;
      const ny = pointerY / window.innerHeight;

      root.style.setProperty('--mx', `${(nx * 100).toFixed(2)}%`);
      root.style.setProperty('--my', `${(ny * 100).toFixed(2)}%`);

      root.style.setProperty('--dx', ((nx - 0.5) * 2).toFixed(3));
      root.style.setProperty('--dy', ((ny - 0.5) * 2).toFixed(3));

      ticking = false;

    };


    window.addEventListener(

      'pointermove',

      (event) => {

        pointerX = event.clientX;
        pointerY = event.clientY;

        if (!ticking) {
          requestAnimationFrame(paintPointer);
          ticking = true;
        }

      },

      { passive: true }

    );


    /* =========================
       CURSOR PERSONALIZADO

       El punto sigue al mouse exacto;
       el anillo lo persigue con retraso
       (interpolación lineal o "lerp").
    ========================= */

    const cursor = document.querySelector('.cursor');

    if (cursor) {

      const dot = cursor.querySelector('.cursor-dot');
      const ring = cursor.querySelector('.cursor-ring');
      const label = cursor.querySelector('.cursor-label');

      const labels = {
        ver: 'VER ↗︎',
        play: 'PLAY'
      };

      let ringX = pointerX;
      let ringY = pointerY;

      cursorOn = true;
      root.classList.add('has-cursor');

      // Oculto hasta que se mueva el mouse
      cursor.classList.add('is-hidden');


      window.addEventListener('pointermove', (event) => {

        dot.style.transform =
          `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;

        cursor.classList.remove('is-hidden');

      }, { passive: true });


      const follow = () => {

        ringX += (pointerX - ringX) * 0.18;
        ringY += (pointerY - ringY) * 0.18;

        ring.style.transform =
          `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;

        requestAnimationFrame(follow);

      };

      follow();


      document.addEventListener('pointerover', (event) => {

        const withLabel = event.target.closest('[data-cursor]');

        const clickable =
          event.target.closest('a, button, input, [data-palette-open], [data-theme-toggle]');

        cursor.classList.toggle('is-label', Boolean(withLabel));
        cursor.classList.toggle('is-hover', Boolean(clickable) && !withLabel);

        if (withLabel) {
          label.textContent = labels[withLabel.dataset.cursor] || '';
        }

      });


      document.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
      document.addEventListener('pointerup', () => cursor.classList.remove('is-down'));

      document.addEventListener('pointerout', (event) => {
        if (!event.relatedTarget) cursor.classList.add('is-hidden');
      });

    }


    /* =========================
       SPOTLIGHT EN TARJETAS
    ========================= */

    document
      .querySelectorAll('.spotlight')
      .forEach((card) => {

        card.addEventListener('pointermove', (event) => {

          const rect = card.getBoundingClientRect();

          card.style.setProperty('--x', `${event.clientX - rect.left}px`);
          card.style.setProperty('--y', `${event.clientY - rect.top}px`);

        });

      });


    /* =========================
       EFECTO TILT 3D
    ========================= */

    document
      .querySelectorAll('[data-tilt]')
      .forEach((card) => {

        const strength =
          Number(card.dataset.tiltStrength || 3);

        card.addEventListener('pointermove', (event) => {

          const rect = card.getBoundingClientRect();

          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;

          card.style.transform = `
            perspective(950px)
            rotateX(${(-py * strength).toFixed(2)}deg)
            rotateY(${(px * strength).toFixed(2)}deg)
            translateY(-2px)
          `;

        });

        card.addEventListener('pointerleave', () => {
          card.style.transform = '';
        });

      });


    /* =========================
       BOTONES MAGNÉTICOS
    ========================= */

    document
      .querySelectorAll('.magnetic')
      .forEach((el) => {

        el.addEventListener('pointermove', (event) => {

          const rect = el.getBoundingClientRect();

          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;

          el.style.transform =
            `translate(${(x * 0.1).toFixed(1)}px, ${(y * 0.12).toFixed(1)}px)`;

        });

        el.addEventListener('pointerleave', () => {
          el.style.transform = '';
        });

      });

  }


  /* =========================
     MENSAJE PARA CURIOSOS
  ========================= */

  console.log(
    '%c✳︎ Hola, curioso.%c\n¿Revisando el código? Me cae bien. Prueba ⌘K / Ctrl+K… o el código Konami.\n→ github.com/ubeda-alex',
    'font: 600 16px sans-serif; color: #244b3b;',
    'font: 13px sans-serif; color: #666a61;'
  );



  /* =========================
     MARCA au*
  ========================= */

  // "Tic" del asterisco en el encabezado: 45° (vuelve a su misma forma)
  const brand = document.querySelector('.brand');
  const brandStar = brand && brand.querySelector('.brand-logo .ast');
  let brandTurn = 0;
  if (brand && brandStar && !reduced) {
    brand.addEventListener('mouseenter', () => {
      brandTurn += 45;
      brandStar.style.transform = `rotate(${brandTurn}deg)`;
    });
  }

  // Entrada del logo: se dibuja y viaja hasta el encabezado
  const intro = document.querySelector('.au-intro');
  if (intro && root.classList.contains('au-intro-on')) {
    const finish = () => {
      root.classList.remove('au-intro-on');
      intro.remove();
      try { localStorage.setItem('au-intro', '1'); } catch (e) {}
    };
    const fly = () => {
      if (!intro.isConnected) return;
      const from = intro.querySelector('.au-intro-logo').getBoundingClientRect();
      const target = document.querySelector('.brand-logo');
      const to = target ? target.getBoundingClientRect() : null;
      if (!to || !to.width || !intro.animate) return finish();
      const s = to.width / from.width;
      const dx = to.left - from.left, dy = to.top - from.top;
      const logo = intro.querySelector('.au-intro-logo');
      logo.style.transformOrigin = '0 0';
      const move = logo.animate(
        [{ transform: 'none' }, { transform: `translate(${dx}px, ${dy}px) scale(${s})` }],
        { duration: 560, easing: 'cubic-bezier(.65, 0, .35, 1)', fill: 'forwards' }
      );
      intro.animate(
        [{ backgroundColor: getComputedStyle(intro).backgroundColor }, { backgroundColor: 'transparent' }],
        { duration: 460, easing: 'ease-out', fill: 'forwards' }
      );
      move.onfinish = finish;   // termina cuando el logo aterriza en el encabezado
    };
    const timer = setTimeout(fly, 1050);
    const skip = () => { clearTimeout(timer); finish(); };
    intro.addEventListener('click', skip);
    window.addEventListener('keydown', skip, { once: true });
  }

})();
