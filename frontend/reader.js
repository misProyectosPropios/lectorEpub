const API_BASE_URL = 'http://localhost:3000/api';
const pathSegments = window.location.pathname.split('/');
const bookTitleEncoded = pathSegments[pathSegments.length - 1];
const bookTitle = decodeURIComponent(bookTitleEncoded);

const titleDisplay = document.getElementById('book-title-display');
if (titleDisplay && bookTitle) {
  titleDisplay.textContent = `${bookTitle.split('.')[0]}`;
}

const fetchBookFile = async (name) => {
  try {
    console.log(`Solicitando archivo para: ${name}...`);
    const response = await fetch(`${API_BASE_URL}/books/name/${encodeURIComponent(name)}`);
    
    if (!response.ok) {
      throw new Error('No se pudo encontrar el archivo del libro en el servidor.');
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('EPUB recibido:', arrayBuffer);

    // Inicializar el libro con ePub.js
    const book = ePub(arrayBuffer, {
      replacements: "blobUrl"
    });
    console.log("Se ha inicializado el libro");

    const rendition = book.renderTo("book-content", {
      width: "100%",
      height: "100%",
      flow: "scrolled-doc",
      sandbox: "allow-same-origin allow-scripts allow-popups allow-forms"
    });

    // Configurar botones de navegación
    const prevBtn = document.getElementById('prev-chapter');
    const nextBtn = document.getElementById('next-chapter');

    if (prevBtn && nextBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        rendition.prev();
      };

      nextBtn.onclick = (e) => {
        e.preventDefault();
        rendition.next();
      };

      // Actualizar estado de los botones (deshabilitar si estamos al inicio/final)
      rendition.on('relocated', (location) => {
        if (location.atStart) {
          prevBtn.disabled = true;
        } else {
          prevBtn.disabled = false;
        }

        if (location.atEnd) {
          nextBtn.disabled = true;
        } else {
          nextBtn.disabled = false;
        }
      });
    }

    // Configurar selector de fuentes
    const fontSelect = document.getElementById('font-family-select');
    const fontSizeSelect = document.getElementById('font-size-select');
    const themeSelect = document.getElementById('theme-select');

    const themes = {
      light: { bg: '#ffffff', fg: '#333333' },
      dark: { bg: '#121212', fg: '#e0e0e0' },
      sepia: { bg: '#f4ecd8', fg: '#5b4636' },
      dim: { bg: '#2c3e50', fg: '#ecf0f1' },
      solarized: { bg: '#fdf6e3', fg: '#657b83' },
      pinkish: { bg: '#fff0f5', fg: '#5d2e46' }
    };

    const applyStylesToIframes = () => {
      const fontValue = fontSelect ? fontSelect.value : 'Default';
      const fontSizeValue = fontSizeSelect ? fontSizeSelect.value : '100%';
      const themeValue = themeSelect ? themeSelect.value : 'light';
      const theme = themes[themeValue] || themes.light;
      
      const iframes = document.querySelectorAll('#book-content iframe');
      const bookContent = document.getElementById('book-content');
      if (bookContent) bookContent.style.backgroundColor = theme.bg;
      
      iframes.forEach(iframe => {
        try {
          const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
          if (iframeDoc && iframeDoc.body) {
            // Aplicar tipografía
            iframeDoc.body.style.setProperty('font-family', fontValue === 'Default' ? '' : fontValue, 'important');
            // Aplicar tamaño de fuente
            iframeDoc.body.style.setProperty('font-size', fontSizeValue, 'important');
            // Aplicar colores del tema
            iframeDoc.body.style.setProperty('background-color', theme.bg, 'important');
            iframeDoc.body.style.setProperty('color', theme.fg, 'important');
          }
        } catch (err) {
          console.warn('No se pudo acceder al iframe para aplicar estilos:', err);
        }
      });
    };

    if (fontSelect) fontSelect.onchange = applyStylesToIframes;
    if (fontSizeSelect) fontSizeSelect.onchange = applyStylesToIframes;
    if (themeSelect) themeSelect.onchange = applyStylesToIframes;

    // Configurar regla de lectura
    const readingRulerToggle = document.getElementById('reading-ruler-toggle');
    const bookViewer = document.getElementById('book-viewer');
    const bookContent = document.getElementById('book-content');
    
    // Crear el elemento de la regla si no existe
    let readingRuler = document.getElementById('reading-ruler');
    if (!readingRuler) {
      readingRuler = document.createElement('div');
      readingRuler.id = 'reading-ruler';
      bookViewer.appendChild(readingRuler);
    }

    let isDragging = false;
    let startY, startTop;

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      let newTop = startTop + deltaY;

      // Límites: considerando los 20px de los bordes opacos
      const padding = 20; 
      const minTop = bookContent.offsetTop + padding;
      const maxTop = bookContent.offsetTop + bookContent.offsetHeight - readingRuler.offsetHeight - padding;

      newTop = Math.max(minTop, Math.min(newTop, maxTop));
      readingRuler.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      isDragging = false;
      readingRuler.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    readingRuler.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startTop = readingRuler.offsetTop;
      readingRuler.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });

    readingRulerToggle.addEventListener('change', () => {
      if (readingRulerToggle.checked) {
        readingRuler.style.display = 'block';
        readingRuler.classList.add('active');
        readingRuler.style.width = `${bookContent.offsetWidth}px`;
        // Posición inicial centrada
        readingRuler.style.top = `${bookContent.offsetTop + (bookContent.offsetHeight / 2) - 15}px`;
      } else {
        readingRuler.style.display = 'none';
        readingRuler.classList.remove('active');
      }
    });

    // Re-aplicar estilos cada vez que se renderice una sección o capítulo nuevo
    rendition.on('rendered', () => {
      applyStylesToIframes();
      if (readingRulerToggle.checked) {
        readingRuler.style.width = `${bookContent.offsetWidth}px`;
      }
    });

    // Extraer y mostrar la portada en la parte superior del TOC
    book.coverUrl().then(url => {
      if (url) {
        const tocSidebar = document.getElementById('toc-sidebar');
        if (tocSidebar) {
          const img = document.createElement('img');
          img.id = 'book-cover-nav';
          img.src = url;
          img.alt = "Portada del libro";
          tocSidebar.prepend(img);
        }
      }
    });

    // Generar Tabla de Contenidos
    book.loaded.navigation.then((nav) => {
      const tocList = document.getElementById('toc-list');
      if (!tocList) return;
      
      tocList.innerHTML = '';
      
      const createTocItems = (chapters, container) => {
        const ul = document.createElement('ul');
        chapters.forEach(chapter => {
          const li = document.createElement('li');
          const link = document.createElement('a');
          link.textContent = chapter.label;
          link.href = "#";
          link.onclick = (e) => {
              console.log("Se cambió al chapter ", chapter.label);
              e.preventDefault();
              rendition.display(chapter.href);
          };
          li.appendChild(link);
          
          if (chapter.subitems && chapter.subitems.length > 0) {
            createTocItems(chapter.subitems, li);
          }
          ul.appendChild(li);
        });
        container.appendChild(ul);
      };

      createTocItems(nav.toc, tocList);
    });

    console.log("Se ha empezado el renderizado el libro");
    await rendition.display();
    
  } catch (error) {
    console.error('Error:', error);
    const content = document.getElementById('book-content');
    if (content) {
      content.innerHTML = `
        <div style="padding: 1rem; background-color: #f8d7da; color: #721c24; border-radius: 4px; border: 1px solid #f5c6cb; margin-top: 1rem;">
          ❌ Error: ${error.message}
        </div>`;
    }
  }
};

if (bookTitle) {
  fetchBookFile(bookTitle);
}