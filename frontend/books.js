// Configuración
const API_BASE_URL = 'http://localhost:3000/api';

// Estado
let books = [];
let selectedBooks = new Set();

/**
 * Carga los libros desde el backend
 */
async function loadBooks() {
  try {
    console.log("Hello world")
    // Mostrar loading
    document.getElementById('loading').style.display = 'flex';
    document.getElementById('books-grid').style.display = 'none';
    document.getElementById('empty-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'none';

    // Hacer fetch
    const response = await fetch(`${API_BASE_URL}/books`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    books = await response.json();
    console.log(books)
    // Ocultar loading
    document.getElementById('loading').style.display = 'none';

    // Mostrar resultados
    if (books.length === 0) {
      
      document.getElementById('empty-state').style.display = 'flex';
    } else {
      renderBooks();
      document.getElementById('books-grid').style.display = 'grid';
    }
  } catch (error) {
    console.error('Error loading books:', error);

    // Ocultar loading
    document.getElementById('loading').style.display = 'none';

    // Mostrar error
    document.getElementById('error-message').textContent = error.message;
    document.getElementById('error-state').style.display = 'flex';
  }
}

/**
 * Renderiza los libros en el grid
 */
function renderBooks() {
  const booksGrid = document.getElementById('books-grid');
  booksGrid.innerHTML = '';

  books.forEach((book) => {
    const bookCard = createBookCard(book);
    booksGrid.appendChild(bookCard);
  });
}

/**
 * Crea un elemento de tarjeta de libro
 */
function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.id = `book-${book.id}`;

  // Cover
  const cover = document.createElement('div');
  cover.className = 'book-cover';

  if (book.cover_url) {
    const img = document.createElement('img');
    img.src = book.cover_url;
    img.alt = book.title;
    img.onerror = function() {
      this.parentElement.innerHTML = '<div class="book-cover-placeholder">📖</div>';
    };
    cover.appendChild(img);
  } else {
    cover.innerHTML = '<div class="book-cover-placeholder">📖</div>';
  }

  // Content
  const content = document.createElement('div');
  content.className = 'book-content';

  // Title
  const title = document.createElement('h3');
  title.className = 'book-title';
  title.textContent = book.title || 'Sin título';
  title.style.cursor = 'pointer'; // Indicate it's clickable
  title.onclick = () => {
    // Navigate to a dedicated reader page using the book's title
    window.location.href = `/books/${encodeURIComponent(book.title)}`;
  };
  title.title = book.title;

  // Author
  const author = document.createElement('p');
  author.className = 'book-author';
  author.textContent = book.author ? `por ${book.author}` : 'Autor desconocido';

  // Description
  const description = document.createElement('p');
  description.className = 'book-description';
  description.textContent = book.description || 'Sin descripción disponible';

  // Metadata
  const meta = document.createElement('div');
  meta.className = 'book-meta';

  const chapterCount = document.createElement('div');
  chapterCount.className = 'book-meta-item';
  chapterCount.innerHTML = `<span>📄</span> <span>${book.chapter_count || 0} capítulos</span>`;

  meta.appendChild(chapterCount);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'book-actions';

  const selectBtn = document.createElement('button');
  selectBtn.className = 'select-button';
  selectBtn.textContent = selectedBooks.has(book.id) ? '✓ Seleccionado' : 'Seleccionar';
  selectBtn.onclick = () => toggleSelectBook(book.id, selectBtn);

  const infoBtn = document.createElement('button');
  infoBtn.className = 'info-button';
  infoBtn.textContent = 'ℹ️';
  infoBtn.title = 'Ver detalles';
  infoBtn.onclick = () => showBookInfo(book);

  actions.appendChild(selectBtn);
  actions.appendChild(infoBtn);

  // Agregar elementos al contenedor
  content.appendChild(title);
  content.appendChild(author);
  content.appendChild(description);
  content.appendChild(meta);
  content.appendChild(actions);

  // Agregar contenido a la tarjeta
  card.appendChild(cover);
  card.appendChild(content);

  return card;
}

/**
 * Alterna la selección de un libro
 */
function toggleSelectBook(bookId, button) {
  if (selectedBooks.has(bookId)) {
    selectedBooks.delete(bookId);
    button.textContent = 'Seleccionar';
  } else {
    selectedBooks.add(bookId);
    button.textContent = '✓ Seleccionado';
  }

  console.log('Libros seleccionados:', Array.from(selectedBooks));
}

/**
 * Muestra información detallada del libro (placeholder para implementación futura)
 */
function showBookInfo(book) {
  console.log('Información del libro:', book);
  // TODO: Implementar modal o página de detalles
  alert(`Libro: ${book.title}\nAutor: ${book.author || 'Desconocido'}\nCapítulos: ${book.chapter_count || 0}`);
}

/**
 * Obtiene los libros seleccionados
 */
function getSelectedBooks() {
  return books.filter(book => selectedBooks.has(book.id));
}

// Cargar libros al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

// Handle upload button click
document.getElementById('upload-button').addEventListener('click', () => {
  const fileInput = document.getElementById('upload-book');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file to upload.');
    return;
  }

  const formData = new FormData();
  formData.append('book', file);

  fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        alert('Book uploaded successfully!');
      } else {
        alert('Failed to upload book.');
      }
    })
    .catch(error => {
      console.error('Error uploading book:', error);
      alert('An error occurred while uploading the book.');
    });
});
