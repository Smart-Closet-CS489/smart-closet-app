import { getOutfitByID, getClothingByID } from './repository';
import { getJsonFile, putJsonFile } from './fileSystemHelper';
import { getWeather } from './weather-api';

const baseUrl = 'http://localhost:5000'

/**
 * @returns {Promise<Boolean>}
 *
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

const COLOR_BUFFER_FILE   = 'color_buffer.json';
const WEATHER_BUFFER_FILE = 'weather_buffer.json';
const STYLE_BUFFER_FILE    = 'style_buffer.json';

/**
 * helper to delay for given number of seconds
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  const response = await fetch(`${baseUrl}/models/${modelName}/training-session`);
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
  const response = await fetch(`${baseUrl}/models/${modelName}/training-session`, {
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

      // creating field for weather neurons
      const weatherData = await getWeather();
      const temp = weatherData.temperature;
      const normalizedTemp = temp / 100; // converting to 0-1 scale
  
      outfit.weather_neurons = [...outfit.style_neurons, normalizedTemp];
  
      // the scores array is ordered as: [color, weather, type]
      await appendToFile(COLOR_BUFFER_FILE, { input: outfit.color_neurons, output: scores[0] });
      await appendToFile(WEATHER_BUFFER_FILE, { input: outfit.weather_neurons, output: scores[1] });
      await appendToFile(STYLE_BUFFER_FILE, { input: outfit.style_neurons, output: scores[2] });
  
      // check if all buffers contain at least 6 training pairs
      const colorBuffer   = await readBuffer(COLOR_BUFFER_FILE);
      const weatherBuffer = await readBuffer(WEATHER_BUFFER_FILE);
      const typeBuffer    = await readBuffer(STYLE_BUFFER_FILE);
  
      if (colorBuffer.length >= 6 && weatherBuffer.length >= 6 && typeBuffer.length >= 6) {
        // busy-wait until no training session is active for any model
        while (
          await isTrainingSessionActive('color_model') ||
          await isTrainingSessionActive('weather_model') ||
          await isTrainingSessionActive('type_model')
        ) {
          await delay(2000);
        }
  
        // retrieve 6 training pairs from each buffer
        const colorData   = await takePairs(COLOR_BUFFER_FILE, 6);
        const weatherDataBuffered = await takePairs(WEATHER_BUFFER_FILE, 6);
        const typeData    = await takePairs(STYLE_BUFFER_FILE, 6);
  
        // trigger training sessions concurrently
        await Promise.all([
          callTrainingSession('color_model', colorData),
          callTrainingSession('weather_model', weatherDataBuffered),
          callTrainingSession('type_model', typeData)
        ]);
  
        // busy-wait until all training sessions have completed
        while (
          await isTrainingSessionActive('color_model') ||
          await isTrainingSessionActive('weather_model') ||
          await isTrainingSessionActive('type_model')
        ) {
          await delay(2000);
        }
  
        // finally, trigger the co–compile endpoint for the three models
        await compileModels(['color_model', 'weather_model', 'type_model']);
      }
    } catch (error) {
      console.error('Error in giveFeedback:', error);
    }
  }

