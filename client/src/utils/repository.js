import { getJsonFile,
    putJsonFile,
    writeImage,
    getImageUrl,
    getNextId } from './fileSystemHelper.js';
  
export async function createClothingArticle(clothingJson) {
    try {
        clothingJson.color.R = clothingJson.color.R / 255;
        clothingJson.color.G = clothingJson.color.G / 255;
        clothingJson.color.B = clothingJson.color.B / 255;
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

        if (clothingJson.category === 'tops') {
            const bottoms = Object.values(await getJsonFile('bottoms.json'));
            const outerwears = Object.values(await getJsonFile('outerwear.json'));
            const shoes = Object.values(await getJsonFile('shoes.json'));
            for (let vibe of clothingJson.vibes) {
                const filteredBottoms = bottoms.filter(outfit => outfit.vibes.includes(vibe));
                const filteredOuterwear = outerwears.filter(outfit => outfit.vibes.includes(vibe));
                const filteredShoes = shoes.filter(outfit => outfit.vibes.includes(vibe));
                for (let bottom of filteredBottoms) {
                    for (let outerwear of filteredOuterwear) {
                        for (let shoes of filteredShoes) {
                            const outfitId = await getNextId();
                            const newOutfit = {
                                id: outfitId,
                                top_id: clothingId,
                                outerwear_id: outerwear.id,
                                bottom_id: bottom.id,
                                shoes_id: shoes.id,
                                color_neurons: [outerwear.color.R, outerwear.color.G, outerwear.color.B,
                                    clothingJson.color.R, clothingJson.color.G, clothingJson.color.B,
                                    bottom.color.R, bottom.color.G, bottom.color.B,
                                    shoes.color.R, shoes.color.G, shoes.color.B],
                                style_neurons: [
                                    outerwear.style === 'sweatshirt' ? 1 : 0,
                                    outerwear.style === 'sweater' ? 1 : 0,
                                    outerwear.style === 'jacket' ? 1 : 0,
                                    outerwear.style === 'coat' ? 1 : 0,
                                    outerwear.style === 'cardigan' ? 1 : 0,
                                    outerwear.style === 'none' ? 1 : 0,
                                    clothingJson.style === 't-shirt' ? 1 : 0,
                                    clothingJson.style === 'long-sleeve' ? 1 : 0,
                                    clothingJson.style === 'collared-shirt' ? 1 : 0,
                                    clothingJson.style === 'tank-top' ? 1 : 0,
                                    clothingJson.style === 'crop' ? 1 : 0,
                                    bottom.style === 'pants' ? 1 : 0,
                                    bottom.style === 'shorts' ? 1 : 0,
                                    bottom.style === 'skirt' ? 1 : 0,
                                    bottom.style === 'leggings' ? 1 : 0,
                                    shoes.style === 'sneakers' ? 1 : 0,
                                    shoes.style === 'running' ? 1 : 0,
                                    shoes.style === 'open-toe' ? 1 : 0,
                                    shoes.style === 'heels' ? 1 : 0,
                                    shoes.style === 'boots' ? 1 : 0,
                                ],
                            };
                            const outfitData = await getJsonFile(`${vibe}_outfits.json`);
                            outfitData[String(outfitId)] = newOutfit;
                            await putJsonFile(`${vibe}_outfits.json`, outfitData);
                        }
                    }
                }
            }
        }
        else if (clothingJson.category === 'bottoms') {
            const tops = Object.values(await getJsonFile('tops.json'));
            const outerwears = Object.values(await getJsonFile('outerwear.json'));
            const shoes = Object.values(await getJsonFile('shoes.json'));
            for (let vibe of clothingJson.vibes) {
                const filteredTops = tops.filter(outfit => outfit.vibes.includes(vibe));
                const filteredOuterwear = outerwears.filter(outfit => outfit.vibes.includes(vibe));
                const filteredShoes = shoes.filter(outfit => outfit.vibes.includes(vibe));
                for (let top of filteredTops) {
                    for (let outerwear of filteredOuterwear) {
                        for (let shoes of filteredShoes) {
                            const outfitId = await getNextId();
                            const newOutfit = {
                                id: outfitId,
                                top_id: top.id,
                                outerwear_id: outerwear.id,
                                bottom_id: clothingId,
                                shoes_id: shoes.id,
                                color_neurons: [outerwear.color.R, outerwear.color.G, outerwear.color.B, 
                                    top.color.R, top.color.G, top.color.B,
                                    clothingJson.color.R, clothingJson.color.G, clothingJson.color.B,
                                    shoes.color.R, shoes.color.G, shoes.color.B],
                                style_neurons: [
                                    outerwear.style === 'sweatshirt' ? 1 : 0,
                                    outerwear.style === 'sweater' ? 1 : 0,
                                    outerwear.style === 'jacket' ? 1 : 0,
                                    outerwear.style === 'coat' ? 1 : 0,
                                    outerwear.style === 'cardigan' ? 1 : 0,
                                    outerwear.style === 'none' ? 1 : 0,
                                    top.style === 't-shirt' ? 1 : 0,
                                    top.style === 'long-sleeve' ? 1 : 0,
                                    top.style === 'collared-shirt' ? 1 : 0,
                                    top.style === 'tank-top' ? 1 : 0,
                                    top.style === 'crop' ? 1 : 0,
                                    clothingJson.style === 'pants' ? 1 : 0,
                                    clothingJson.style === 'shorts' ? 1 : 0,
                                    clothingJson.style === 'skirt' ? 1 : 0,
                                    clothingJson.style === 'leggings' ? 1 : 0,
                                    shoes.style === 'sneakers' ? 1 : 0,
                                    shoes.style === 'running' ? 1 : 0,
                                    shoes.style === 'open-toe' ? 1 : 0,
                                    shoes.style === 'heels' ? 1 : 0,
                                    shoes.style === 'boots' ? 1 : 0,
                                ],
                            };
                            const outfitData = await getJsonFile(`${vibe}_outfits.json`);
                            outfitData[String(outfitId)] = newOutfit;
                            await putJsonFile(`${vibe}_outfits.json`, outfitData);
                        }
                    }
                }
            }
        }
        else if (clothingJson.category === 'shoes') {
            const tops = Object.values(await getJsonFile('tops.json'));
            const bottoms = Object.values(await getJsonFile('bottoms.json'));
            const outerwears = Object.values(await getJsonFile('outerwear.json'));
            for (let vibe of clothingJson.vibes) {
                const filteredTops = tops.filter(outfit => outfit.vibes.includes(vibe));
                const filteredBottoms = bottoms.filter(outfit => outfit.vibes.includes(vibe));
                const filteredOuterwear = outerwears.filter(outfit => outfit.vibes.includes(vibe));
                for (let top of filteredTops) {
                    for (let bottom of filteredBottoms) {
                        for (let outerwear of filteredOuterwear) {
                            const outfitId = await getNextId();
                            const newOutfit = {
                                id: outfitId,
                                top_id: top.id,
                                outerwear_id: outerwear.id,
                                bottom_id: bottom.id,
                                shoes_id: clothingId,
                                color_neurons: [outerwear.color.R, outerwear.color.G, outerwear.color.B,
                                    top.color.R, top.color.G, top.color.B,
                                    bottom.color.R, bottom.color.G, bottom.color.B,
                                    clothingJson.color.R, clothingJson.color.G, clothingJson.color.B],
                                style_neurons: [
                                    outerwear.style === 'sweatshirt' ? 1 : 0,
                                    outerwear.style === 'sweater' ? 1 : 0,
                                    outerwear.style === 'jacket' ? 1 : 0,
                                    outerwear.style === 'coat' ? 1 : 0,
                                    outerwear.style === 'cardigan' ? 1 : 0,
                                    outerwear.style === 'none' ? 1 : 0,
                                    top.style === 't-shirt' ? 1 : 0,
                                    top.style === 'long-sleeve' ? 1 : 0,
                                    top.style === 'collared-shirt' ? 1 : 0,
                                    top.style === 'tank-top' ? 1 : 0,
                                    top.style === 'crop' ? 1 : 0,
                                    bottom.style === 'pants' ? 1 : 0,
                                    bottom.style === 'shorts' ? 1 : 0,
                                    bottom.style === 'skirt' ? 1 : 0,
                                    bottom.style === 'leggings' ? 1 : 0,
                                    clothingJson.style === 'sneakers' ? 1 : 0,
                                    clothingJson.style === 'running' ? 1 : 0,
                                    clothingJson.style === 'open-toe' ? 1 : 0,
                                    clothingJson.style === 'heels' ? 1 : 0,
                                    clothingJson.style === 'boots' ? 1 : 0,
                                ],
                            };
                            const outfitData = await getJsonFile(`${vibe}_outfits.json`);
                            outfitData[String(outfitId)] = newOutfit;
                            await putJsonFile(`${vibe}_outfits.json`, outfitData);
                        }
                    }
                }
            }
        }
        else if (clothingJson.category === 'outerwear') {
            const tops = Object.values(await getJsonFile('tops.json'));
            const bottoms = Object.values(await getJsonFile('bottoms.json'));
            const shoes = Object.values(await getJsonFile('shoes.json'));
            for (let vibe of clothingJson.vibes) {
                const filteredTops = tops.filter(outfit => outfit.vibes.includes(vibe));
                const filteredBottoms = bottoms.filter(outfit => outfit.vibes.includes(vibe));
                const filteredShoes = shoes.filter(outfit => outfit.vibes.includes(vibe));
                for (let top of filteredTops) {
                    for (let bottom of filteredBottoms) {
                        for (let shoes of filteredShoes) {
                            const outfitId = await getNextId();
                            const newOutfit = {
                                id: outfitId,
                                top_id: top.id,
                                outerwear_id: clothingId,
                                bottom_id: bottom.id,
                                shoes_id: shoes.id,
                                color_neurons: [clothingJson.color.R, clothingJson.color.G, clothingJson.color.B,
                                    top.color.R, top.color.G, top.color.B,
                                    bottom.color.R, bottom.color.G, bottom.color.B,
                                    shoes.color.R, shoes.color.G, shoes.color.B],
                                style_neurons: [
                                    clothingJson.style === 'sweatshirt' ? 1 : 0,
                                    clothingJson.style === 'sweater' ? 1 : 0,
                                    clothingJson.style === 'jacket' ? 1 : 0,
                                    clothingJson.style === 'coat' ? 1 : 0,
                                    clothingJson.style === 'cardigan' ? 1 : 0,
                                    clothingJson.style === 'none' ? 1 : 0,
                                    top.style === 't-shirt' ? 1 : 0,
                                    top.style === 'long-sleeve' ? 1 : 0,
                                    top.style === 'collared-shirt' ? 1 : 0,
                                    top.style === 'tank-top' ? 1 : 0,
                                    top.style === 'crop' ? 1 : 0,
                                    bottom.style === 'pants' ? 1 : 0,
                                    bottom.style === 'shorts' ? 1 : 0,
                                    bottom.style === 'skirt' ? 1 : 0,
                                    bottom.style === 'leggings' ? 1 : 0,
                                    shoes.style === 'sneakers' ? 1 : 0,
                                    shoes.style === 'running' ? 1 : 0,
                                    shoes.style === 'open-toe' ? 1 : 0,
                                    shoes.style === 'heels' ? 1 : 0,
                                    shoes.style === 'boots' ? 1 : 0,
                                ],
                            };
                            const outfitData = await getJsonFile(`${vibe}_outfits.json`);
                            outfitData[String(outfitId)] = newOutfit;
                            await putJsonFile(`${vibe}_outfits.json`, outfitData);
                        }
                    }
                }
            }
        }

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
        vibe = vibe.toLowerCase();
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


export async function refreshData() {
    // clears the *_outfits.json files and recomputes the cartesian product for them, as done in createClothingArticle
    const vibes = ['casual', 'formal', 'party', 'athletic'];

    for (let vibe of vibes) {
        console.log(`Starting refresh for vibe: ${vibe}`);
        const outfitData = await getJsonFile(`${vibe}_outfits.json`);
        const tops = Object.values(await getJsonFile('tops.json'));
        const bottoms = Object.values(await getJsonFile('bottoms.json'));
        const shoes = Object.values(await getJsonFile('shoes.json'));
        const outerwears = Object.values(await getJsonFile('outerwear.json'));
        const filteredTops = tops.filter(outfit => outfit.vibes.includes(vibe));
        const filteredBottoms = bottoms.filter(outfit => outfit.vibes.includes(vibe));
        const filteredShoes = shoes.filter(outfit => outfit.vibes.includes(vibe));
        const filteredOuterwears = outerwears.filter(outfit => outfit.vibes.includes(vibe));
        for (let top of filteredTops) {
            for (let bottom of filteredBottoms) {
                for (let shoes of filteredShoes) {
                    for (let outerwear of filteredOuterwears) {
                        const outfitId = await getNextId();
                        const newOutfit = {
                            id: outfitId,
                            top_id: top.id,
                            outerwear_id: outerwear.id,
                            bottom_id: bottom.id,
                            shoes_id: shoes.id,
                            color_neurons: [outerwear.color.R, outerwear.color.G, outerwear.color.B,
                                top.color.R, top.color.G, top.color.B,
                                bottom.color.R, bottom.color.G, bottom.color.B,
                                shoes.color.R, shoes.color.G, shoes.color.B],
                            style_neurons: [
                                outerwear.style === 'sweatshirt' ? 1 : 0,
                                outerwear.style === 'sweater' ? 1 : 0,
                                outerwear.style === 'jacket' ? 1 : 0,
                                outerwear.style === 'coat' ? 1 : 0,
                                outerwear.style === 'cardigan' ? 1 : 0,
                                outerwear.style === 'none' ? 1 : 0,
                                top.style === 't-shirt' ? 1 : 0,
                                top.style === 'long-sleeve' ? 1 : 0,
                                top.style === 'collared-shirt' ? 1 : 0,
                                top.style === 'tank-top' ? 1 : 0,
                                top.style === 'crop' ? 1 : 0,
                                bottom.style === 'pants' ? 1 : 0,
                                bottom.style === 'shorts' ? 1 : 0,
                                bottom.style === 'skirt' ? 1 : 0,
                                bottom.style === 'leggings' ? 1 : 0,
                                shoes.style === 'sneakers' ? 1 : 0,
                                shoes.style === 'running' ? 1 : 0,
                                shoes.style === 'open-toe' ? 1 : 0,
                                shoes.style === 'heels' ? 1 : 0,
                                shoes.style === 'boots' ? 1 : 0,
                            ],
                        };
                        outfitData[String(outfitId)] = newOutfit;
                    }
                    console.log("did something")
                }
            }
        }
        console.log(`Overwriting data for vibe: ${vibe}`);
        await putJsonFile(`${vibe}_outfits.json`, outfitData);
        console.log(`Successfully refreshed data for vibe: ${vibe}`);
    }
}

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
