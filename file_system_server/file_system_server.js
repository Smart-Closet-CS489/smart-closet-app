const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const JSON_DATA_DIR = '/home/shared/data/json_data';
const IMAGE_DIR = '/home/shared/data/json_images';

// Middleware to handle raw file uploads
app.use(express.raw({ type: '*/*', limit: '50mb' }));

// Serve any file via GET
app.get('/json-data/:filename', (req, res) => {
  const filePath = path.join(JSON_DATA_DIR, req.params.filename);
  if (filePath.startsWith(JSON_DATA_DIR)) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) return res.status(404).send('File not found.');
      res.sendFile(filePath);
    });
  } else {
    res.status(400).send('Invalid file path.');
  }
});

// Overwrite or create a file via PUT
app.put('/json-data/:filename', (req, res) => {
    const filePath = path.join(JSON_DATA_DIR, req.params.filename);
    if (!filePath.startsWith(JSON_DATA_DIR)) {
      return res.status(400).send('Invalid file path.');
    }
  
    let contentToWrite = req.body;
    
    try {
      const json = JSON.parse(req.body.toString());
      contentToWrite = JSON.stringify(json, null, 2); // 2-space indent
    } catch (e) {
    }
  
    fs.writeFile(filePath, contentToWrite, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to write file.');
      }
      res.send('File written successfully.');
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
