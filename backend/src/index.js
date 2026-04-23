const express = require('express');
const cors = require('cors');

require('dotenv').config();



const bookRoutes = require('./routes/books');
const chapterRoutes = require('./routes/chapters');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Lector EPUB API',
    status: 'online',
    version: '0.1.0'
  });
});

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/chapters', chapterRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
