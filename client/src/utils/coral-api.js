import { getOutfitById, getInferenceSampleByVibe } from './repository';
import { getJsonFile, putJsonFile } from './fileSystemHelper';
import { getWeather } from './weather-api';
import axios from 'axios';


const baseUrl = 'http://localhost:7000'

/**
 * @returns {Promise<Boolean>}
 *
 */
export async function createModels() {
    const models = [
      {
        model_name: "color_model",
        input_size: 12,
        hidden_sizes: [48, 48],
        output_size: 1,
        model_type: "regression",
        memory_size: 1000
      },
      {
        model_name: "weather_model",
        input_size: 21,
        hidden_sizes: [64, 64, 64],
        output_size: 1,
        model_type: "regression",
        memory_size: 1000
      },
      {
        model_name: "style_model",
        input_size: 20,
        hidden_sizes: [64, 64, 64],
        output_size: 1,
        model_type: "regression",
        memory_size: 1000
      }
    ];
  
    try {
      await Promise.all(models.map(async (modelData) => {
        try {
          await axios.get(`${baseUrl}/models/${modelData.model_name}`);
          console.log(`Model "${modelData.model_name}" already exists; skipping creation.`);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            try {
              const response = await axios.post(`${baseUrl}/models`, modelData);
              if (response) {
                console.log(`Model "${modelData.model_name}" created successfully.`);
                await compileModels(['color_model', 'weather_model', 'style_model']);
              }
            } catch (creationError) {
              console.error(`Error creating model "${modelData.model_name}":`, creationError.message);
              throw creationError;
            }
          } else {
            console.error(`Error checking existence for model "${modelData.model_name}":`, error.message);
            throw error;
          }
        }
      }));
      return true;

    } catch (err) {
      console.error('Error in createModels:', err.message);
      throw err;
    }
  }

/**
 * samples outfits by vibe, augments them with weather_neurons,
 * runs them through the three Coral models, aggregates their scores,
 * and returns one randomly chosen top-5 outfit
 *
 * @param {'formal'|'casual'|'party'|'athletic'} vibe
 * @returns {Promise<Number>}
 */
export async function generateOutfit(vibe) {
    // get a randomized sample of outfits for this vibe
    const sampled = await getInferenceSampleByVibe(vibe);
    if (!Array.isArray(sampled) || sampled.length == 0) {
      throw new Error(`No outfits found for vibe "${vibe}"`);
    }
  
    // fetch current temperature in fahrenheit and normalize
    const { temperature } = await getWeather();
    const normalizedTemp = parseFloat((temperature / 100).toFixed(2));
  
    // augment each outfit with weather_neurons, aka [normalizedTemp, ...style_neurons]
    const outfits = sampled.map(o => ({
      ...o,
      weather_neurons: [normalizedTemp, ...o.style_neurons]
    }));
  
    // build the batched inputs for each model
    const colorInputs   = outfits.map(o => o.color_neurons);
    const styleInputs   = outfits.map(o => o.style_neurons);
    const weatherInputs = outfits.map(o => o.weather_neurons);
  
    // call inference endpoints in parallel
    const colorRes = await axios.post(`${baseUrl}/models/color_model/inference`,   { inputs: colorInputs   })
    const weatherRes = await axios.post(`${baseUrl}/models/weather_model/inference`, { inputs: weatherInputs })
    const styleRes = await axios.post(`${baseUrl}/models/style_model/inference`,   { inputs: styleInputs   })
  
    const colorOut   = colorRes.data.outputs;
    const weatherOut = weatherRes.data.outputs;
    const styleOut   = styleRes.data.outputs;
  
    // aggregate scores per outfit index
    const aggregates = outfits.map((_, i) => {
      const sumArray = arr => arr.reduce((a, b) => a + b, 0);
      const totalScore =
        sumArray(colorOut[i]) +
        sumArray(weatherOut[i]) +
        sumArray(styleOut[i]);
      return { idx: i, score: totalScore };
    });
  
    // select top 5 and choose 1
    aggregates.sort((a, b) => b.score - a.score);
    const top5Indices = aggregates.slice(0, 5).map(a => a.idx);
    const chosenIdx = top5Indices[Math.floor(Math.random() * top5Indices.length)];
    const chosenId  = outfits[chosenIdx].id;

    console.log("This is the returned outfit ID: ", chosenId)
  
    return chosenId;
  }


/**
 * @param {string} modelName
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export async function deleteModel(modelName) {
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
export async function getModelInfo(modelName) {
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
      const outfit = await getOutfitById(outfitId);

      // creating field for weather neurons
      const weatherData = await getWeather();
      const temp = weatherData.temperature;
      const normalizedTemp = temp / 100; // converting to 0-1 scale
  
      outfit.weather_neurons = [...outfit.style_neurons, normalizedTemp];

      // slightly randomize scores for model training purposes
      for (let i = 0; i < 3; i++) {
        const randomizer = Math.random() * 0.1 - 0.05
        scores[i] = Math.max(Math.min((scores[i] - 1) / 4 + randomizer, 1), 0)
      }
  
      // the scores array is ordered as: [color, weather, type]
      await appendToFile(WEATHER_BUFFER_FILE, { input: outfit.weather_neurons, output: [scores[0]] });
      await appendToFile(COLOR_BUFFER_FILE, { input: outfit.color_neurons, output: [scores[1]] });
      await appendToFile(STYLE_BUFFER_FILE, { input: outfit.style_neurons, output: [scores[2]] });
  
      // check if all buffers contain at least 6 training pairs
      const colorBuffer   = await readBuffer(COLOR_BUFFER_FILE);
      const weatherBuffer = await readBuffer(WEATHER_BUFFER_FILE);
      const styleBuffer    = await readBuffer(STYLE_BUFFER_FILE);
  
      if (colorBuffer.length >= 6 && weatherBuffer.length >= 6 && styleBuffer.length >= 6) {
        // busy-wait until no training session is active for any model
        while (
          await isTrainingSessionActive('color_model') ||
          await isTrainingSessionActive('weather_model') ||
          await isTrainingSessionActive('style_model')
        ) {
          await delay(2000);
        }
  
        // retrieve 6 training pairs from each buffer
        const colorData   = await takePairs(COLOR_BUFFER_FILE, 6);
        const weatherDataBuffered = await takePairs(WEATHER_BUFFER_FILE, 6);
        const styleData    = await takePairs(STYLE_BUFFER_FILE, 6);
  
        // trigger training sessions concurrently
        await Promise.all([
          callTrainingSession('color_model', colorData),
          callTrainingSession('weather_model', weatherDataBuffered),
          callTrainingSession('style_model', styleData)
        ]);
  
        // busy-wait until all training sessions have completed
        while (
          await isTrainingSessionActive('color_model') ||
          await isTrainingSessionActive('weather_model') ||
          await isTrainingSessionActive('style_model')
        ) {
          await delay(2000);
        }
  
        // finally, trigger the co–compile endpoint for the three models
        await compileModels(['color_model', 'weather_model', 'style_model']);
      }
    } catch (error) {
      console.error('Error in giveFeedback:', error);
    }
  }

