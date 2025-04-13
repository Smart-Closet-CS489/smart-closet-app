import { getOutfitByID, getClothingByID } from './repository';
import { getJsonFile, putJsonFile } from './fileSystemHelper';


const baseUrl = 'http://localhost:5000'

/**
 * @returns {Promise<Boolean>}
 *
 * }
 */
async function createModels() {
    try {
        await axios.get(`${baseUrl}/models/${modelData.model_name}`);
        console.log(`Model "${modelData.model_name}" already exists; skipping creation.`);
        return { message: `Model "${modelData.model_name}" already exists.` };
    } catch (error) {
        
    }
}

/**
 * @returns {Promise<Boolean>}
 *
 * }
 */
async function generateOutfit() {
    
}


/**
 * @param {string} modelName
 * @returns {Promise<Object>}
 * @throws {Error}
 */
async function deleteModel(modelName) {
    try {
        const response = await axios.delete(`${baseUrl}/models/${modelName}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting model:', error);
        throw error;
    }
}


/**
 * @param {string} modelName
 * @returns {Promise<Object>}
 * @throws {Error}
 */
async function getModelInfo(modelName) {
    try {
        const response = await axios.get(`${baseUrl}/models/${modelName}`);
        return response.data;
    } catch (error) {
        console.error('Error getting model info:', error);
        throw error;
    }
}

const WEATHER_BUFFER_FILE = 'weather_buffer.json';
const COLOR_BUFFER_FILE   = 'color_buffer.json';
const TYPE_BUFFER_FILE    = 'type_buffer.json';

/**
 * helper to delay for given number of seconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * helper to parse clothing items into input feature arrays for each model
 * @param {Array<Object>} clothingItems
 * @returns {{ weatherInput: number[], colorInput: number[], typeInput: number[] }}
 */
function parseInputsForModels(clothingItems) {
  return {
    weatherInput: Array(21).fill(0).map(() => Math.random() * 100),
    colorInput:   Array(12).fill(0).map(() => Math.floor(Math.random() * 256)),
    typeInput:    Array(20).fill(0).map(() => Math.random() * 10)
  };
}

/**
 * reads a JSON buffer file (returns [] for errors or in case the file doesn't exist)
 * @param {string} filename
 * @returns {Promise<Array>}
 */
async function readBuffer(filename) {
  try {
    const data = await getJsonFile(filename);
    return data;
  } catch (e) {
    console.error(`Error reading ${filename}:`, e.message);
    return [];
  }
}

/**
 * appends a training pair to the given JSON buffer file
 * @param {string} filename
 * @param {{input: Array, output: number}} pair 
 */
async function appendToFile(filename, pair) {
  const buffer = await readBuffer(filename);
  buffer.push(pair);
  await putJsonFile(filename, buffer);
}

/**
 * removes and returns the first `count` pairs from the file and updates it with remaining training pairs
 * @param {string} filename 
 * @param {number} count 
 * @returns {Promise<{inputs: Array, outputs: Array}>}
 */
async function takePairs(filename, count) {
  const buffer = await readBuffer(filename);
  const pairsToUse = buffer.slice(0, count);
  const remaining = buffer.slice(count);
  await putJsonFile(filename, remaining);
  const inputs = pairsToUse.map(pair => pair.input);
  const outputs = pairsToUse.map(pair => pair.output);
  return { inputs, outputs };
}

/**
 * checks if a training session is active for a given model
 * @param {string} modelName 
 * @returns {Promise<boolean>}
 */
async function isTrainingSessionActive(modelName) {
  const response = await fetch(`${BASE_URL}/models/${modelName}/training-session`);
  const data = await response.json();
  return data.training_session_active;
}

/**
 * calls the training session endpoint for a given model, with provided training data
 * @param {string} modelName 
 * @param {{inputs: Array, outputs: Array}} trainingData 
 * @returns {Promise<any>}
 */
async function callTrainingSession(modelName, trainingData) {
  const response = await fetch(`${BASE_URL}/models/${modelName}/training-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trainingData)
  });
  if (!response.ok) {
    throw new Error(`Training session failed for ${modelName}: ${await response.text()}`);
  }
  return await response.json();
}

/**
 * calls the co-compile endpoint for the given model names
 * @param {Array<string>} modelNames 
 * @returns {Promise<any>}
 */
async function compileModels(modelNames) {
  const response = await fetch(`${baseUrl}/models/compilations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model_names: modelNames })
  });
  if (!response.ok) {
    throw new Error(`Compilation failed: ${await response.text()}`);
  }
  return await response.json();
}

/**
 * main function to collect feedback, persist training data, and trigger training/compilation
 * @param {number} outfitId
 * @param {number[]} scores
 */
export async function giveFeedback(outfitId, scores) {
  try {
    const outfit = await getOutfitByID(outfitId);
    const clothingIds = outfit.items;
    const clothingItems = await Promise.all(clothingIds.map(id => getClothingByID(id)));

    // parse clothing items into arrays for each model
    const { weatherInput, colorInput, typeInput } = parseInputsForModels(clothingItems);

    // map scores to models (order: color, weather, type)
    await appendToFile(COLOR_BUFFER_FILE, { input: colorInput, output: scores[0] });
    await appendToFile(WEATHER_BUFFER_FILE, { input: weatherInput, output: scores[1] });
    await appendToFile(TYPE_BUFFER_FILE, { input: typeInput, output: scores[2] });

    // check each buffer for at least six training pairs.
    const colorBuffer   = await readBuffer(COLOR_BUFFER_FILE);
    const weatherBuffer = await readBuffer(WEATHER_BUFFER_FILE);
    const typeBuffer    = await readBuffer(TYPE_BUFFER_FILE);

    if (colorBuffer.length >= 6 && weatherBuffer.length >= 6 && typeBuffer.length >= 6) {
      // wait until no active training session is found for any model
      while (
        await isTrainingSessionActive('color_model') ||
        await isTrainingSessionActive('weather_model') ||
        await isTrainingSessionActive('type_model')
      ) {
        await delay(2000);
      }

      // retrieve six training pairs from each buffer
      const colorData   = await takePairs(COLOR_BUFFER_FILE, 6);
      const weatherData = await takePairs(WEATHER_BUFFER_FILE, 6);
      const typeData    = await takePairs(TYPE_BUFFER_FILE, 6);

      // trigger training sessions concurrently
      await Promise.all([
        callTrainingSession('color_model', colorData),
        callTrainingSession('weather_model', weatherData),
        callTrainingSession('type_model', typeData)
      ]);

      // wait until all training sessions have finished
      while (
        await isTrainingSessionActive('color_model') ||
        await isTrainingSessionActive('weather_model') ||
        await isTrainingSessionActive('type_model')
      ) {
        await delay(2000);
      }

      // call the co-compile endpoint
      await compileModels(['color_model', 'weather_model', 'type_model']);
    }
  } catch (error) {
    console.error('Error in giveFeedback:', error);
  }
}
