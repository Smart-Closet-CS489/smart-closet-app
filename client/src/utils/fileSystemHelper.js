import axios from 'axios';

const BASE_URL = 'http://localhost:62333';

export async function getJsonFile(filename) {
  try {
    const res = await axios.get(`${BASE_URL}/json-data/${filename}`);
    return res.data;
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
    throw err;
  }
}

export async function putJsonFile(filename, data) {
  try {
    await axios.put(`${BASE_URL}/json-data/${filename}`, data, {
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

export async function writeImage(filename) {
    try {
        await axios.post(`${BASE_URL}/images/${filename}`);
        console.log(`Triggered image write to ${filename}`);
    } catch (err) {
        console.error(`Error triggering image write for ${filename}:`, err.message);
        throw err;
    }
  }
  
export async function getImageUrl(filename) {
    return `${BASE_URL}/images/${filename}`;
}
  
export async function getNextId() {
    try {
        const res = await axios.get(`${BASE_URL}/new-id`);
        return res.data.newId;
    } catch (err) {
        console.error(`Error getting next ID:`, err.message);
        throw err;
    }
}
  
//   module.exports = {
//     getJsonFile,
//     putJsonFile,
//     writeImage,
//     getImageUrl,
//     getNextId,
//   };
