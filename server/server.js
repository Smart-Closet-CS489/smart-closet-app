const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React app's build folder.
app.use(express.static(path.join(__dirname, 'build')));

// Example API route.
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Catch-all: serve the React app for any other requests.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
