const fs = require('fs/promises');
const { getJsonFile, putJsonFile } = require('./file_system_helper');

// Function to generate a new ID
async function newId() {
    try {
        const data = await fs.readFile('/home/shared/data/json-data/current_id.json', 'utf8');
        let lastId = parseInt(data.trim());
        lastId++;
        await fs.writeFile('/home/shared/data/json-data/current_id.json', lastId.toString());
        return lastId;
    } catch (error) {
        console.error('Error reading or writing lastId:', error);
        throw error;
    }
}

/*
{
    "category": "Top",
    "style": "Casual",
    "color": {
        "R": 255,
        "G": 0, 
        "B": 0},
    "vibes": ["Casual", "Formal"],
    "imageId": 23
}
*/
async function createClothingArticle(clothingJson) {
    
}

// (async () => {
//     try {
//       const data = await getJsonFile('tops.json');
//       console.log('Original data:', data);
  
//       // Modify and save
//       data.updatedBy = 'your-awesome-app';
//       await putJsonFile('tops.json', data);
//     } catch (err) {
//       console.error('Something went wrong:', err.message);
//     }
//   })();

(async () => {
  const newData = {
    items: ['tshirt', 'sweater', 'hoodie'],
    updatedAt: new Date().toISOString(),
    source: 'test script'
  };

  try {
    await putJsonFile('tops.json', newData);
    console.log('Successfully overwrote tops.json with test data.');
  } catch (err) {
    console.error('Failed to overwrite tops.json:', err.message);
  }
})();
