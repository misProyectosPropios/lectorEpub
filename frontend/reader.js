document.addEventListener('DOMContentLoaded', () => {
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
        flow: "scrolled-doc"
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
      if (fontSelect) {
        fontSelect.onchange = (e) => {
          console.log(rendition)
          const fontValue = e.target.value;

          if (fontValue === 'Default') {
          rendition.themes.select(null); // vuelve al default del EPUB
          } else {
            rendition.themes.register("custom-font", {
            "body, p, div, span, *": {
              "font-family": `${fontValue} !important`
            }
          });

          rendition.themes.select("custom-font");
          }
        };
      }

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
});