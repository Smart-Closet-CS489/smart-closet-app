// jsonHelpers.js
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/json-data';

async function getJsonFile(filename) {
  try {
    const res = await axios.get(`${BASE_URL}/${filename}`);
    return res.data;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    throw err;
  }
}

async function putJsonFile(filename, data) {
  try {
    await axios.put(`${BASE_URL}/${filename}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`Successfully wrote ${filename}`);
  } catch (err) {
    console.error(`Error writing ${filename}:`, err.message);
    throw err;
  }
}

module.exports = {
  getJsonFile,
  putJsonFile,
};
