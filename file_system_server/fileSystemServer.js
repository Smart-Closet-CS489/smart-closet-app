const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 62333;

const JSON_DATA_DIR = '/home/shared/data/json_data';
const IMAGE_DIR = '/home/shared/data/images';
const IMAGE_STREAM_FILE = '/home/shared/repos/smart-closet-app/client/photo_from_stream.jpg';

// Middleware to handle raw file uploads
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));

app.use(express.raw({ type: '*/*', limit: '50mb' }));

app.get('/json-data/:filename', (req, res) => {
  const filePath = path.join(JSON_DATA_DIR, req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return res.status(404).send('File not found.');
    res.sendFile(filePath);
  });
});

app.put('/json-data/:filename', (req, res) => {
  const filePath = path.join(JSON_DATA_DIR, req.params.filename);
  let contentToWrite = req.body;

  try {
    const json = JSON.parse(req.body.toString());
    contentToWrite = JSON.stringify(json, null, 2);
  } catch (e) {}

  fs.writeFile(filePath, contentToWrite, (err) => {
    if (err) return res.status(500).send('Failed to write file.');
    res.send('File written successfully.');
  });
});

app.get('/images/:filename', (req, res) => {
  const filePath = path.join(IMAGE_DIR, req.params.filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) return res.status(404).send('Image not found.');
    res.sendFile(filePath);
  });
});

app.post('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imageStreamPath = IMAGE_STREAM_FILE;
  const newFilePath = path.join(IMAGE_DIR, filename);

  fs.access(imageStreamPath, fs.constants.F_OK, (err) => {
    if (err) return res.status(404).send('Image stream file not found.');

    fs.readFile(imageStreamPath, (err, data) => {
      if (err) return res.status(500).send('Failed to read the image stream.');

      fs.writeFile(newFilePath, data, (err) => {
        if (err) return res.status(500).send('Failed to save the image.');
        res.send(`Image ${filename} moved and renamed successfully.`);
      });
    });
  });
});

app.get('/new-id', (req, res) => {
  const currentIdFilePath = path.join(JSON_DATA_DIR, 'current_id.json');

  fs.readFile(currentIdFilePath, 'utf8', (err, data) => {
    let currentId = JSON.parse(data);
    const newId = currentId + 1;

    fs.writeFile(currentIdFilePath, JSON.stringify(newId), 'utf8', (err) => {
      res.json({ newId });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
