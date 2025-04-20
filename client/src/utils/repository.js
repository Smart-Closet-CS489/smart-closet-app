import { getJsonFile,
    putJsonFile,
    writeImage,
    getImageUrl,
    getNextId } from './fileSystemHelper.js';
  
export async function createClothingArticle(clothingJson) {
    try {
      const data = await getJsonFile(clothingJson.category + '.json');
      const clothingId = await getNextId();
      const newClothingData = {
        id: clothingId,
        style: clothingJson.style,
        color: {
          R: clothingJson.color.R,
          G: clothingJson.color.G,
          B: clothingJson.color.B,
        },
        vibes: clothingJson.vibes,
      };
      data[String(clothingId)] = newClothingData;
      await putJsonFile(clothingJson.category + '.json', data);
      await writeImage(`${clothingId}.jpg`);
      console.log('Successfully added new clothing article to', clothingJson.category + '.json');
    } catch (err) {
      console.error('Failed to add clothing article:', err.message);
    }
}

export async function getOutfitById(id) {
    try {
        let vibes = ['casual', 'formal', 'party', 'athletic'];
        for (let vibe of vibes) {
            const data = await getJsonFile(vibe + '_outfits.json');
            if (data[String(id)]) {
                return data[String(id)];
            }
        }
    } catch (err) {
        console.error('Failed to retrieve outfit:', err.message);
        return null;
    }
}

export async function getInferenceSampleByVibe(vibe) {
    try {
        const data = await getJsonFile(`${vibe}_outfits.json`);
        const outfits = Object.values(data);
        const sampleSize = Math.max(1, Math.min(1000, Math.floor(outfits.length * 0.2)));
        for (let i = outfits.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [outfits[i], outfits[j]] = [outfits[j], outfits[i]];
          }
          
        const sampledOutfits = outfits.slice(0, sampleSize);
        return sampledOutfits;
    } catch (err) {
        console.error('Failed to retrieve inference sample:', err.message);
        return null;
    }
}

export async function getImageUrlsByOutfitId(id) {
    try {
        let outfit = await getOutfitById(id);
        return {
            top_img_url: await getImageUrl(`${outfit.top_id}.jpg`),
            outerwear_img_url: await getImageUrl(`${outfit.outerwear_id}.jpg`),
            bottom_img_url: await getImageUrl(`${outfit.bottom_id}.jpg`),
            shoes_img_url: await getImageUrl(`${outfit.shoes_id}.jpg`)
        }
    } catch (err) {
        console.error('Failed to retrieve image URLs:', err.message);
        return null;
    }
}



  
//   const testClothing = {
//     category: 'tops',
//     style: 't-shirt',
//     color: { R: 255, G: 0, B: 0 },
//     vibes: ['casual', 'formal'],
//   };
  
//   createClothingArticle(testClothing);


// async function test() {
//     const testId = 1; // <-- change this to test different IDs
//     const outfit = await getOutfitById(testId);
  
//     if (outfit) {
//       console.log(`Outfit ID ${testId} found:`, outfit);
//     } else {
//       console.log(`Outfit ID ${testId} not found in any vibe.`);
//     }
//   }
  
//   test();


// (async () => {
//     const vibe = 'athletic'; // try 'formal', 'party', etc. if available
//     const sample = await getInferenceSampleByVibe(vibe);
  
//     if (sample) {
//       console.log(`Retrieved ${sample.length} outfit(s) for vibe "${vibe}":`);
//       console.dir(sample, { depth: null });
//     } else {
//       console.log(`No outfits found for vibe "${vibe}".`);
//     }
//   })();
