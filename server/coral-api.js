const axios = require('axios');

const baseUrl = 'http://localhost:5000'

/**
 * @param {Object} modelData
 * @returns {Promise<Object>}
 *
 * Example modelData:
 * {
 *   model_name: "sample_model",
 *   input_size: 2,
 *   hidden_sizes: [128, 128, 128, 128],
 *   output_size: 1,
 *   model_type: "regression",
 *   memory_size: 1000
 * }
 */
async function createModel(modelData) {
    try {
      await axios.get(`${baseUrl}/models/${modelData.model_name}`);
      console.log(`Model "${modelData.model_name}" already exists; skipping creation.`);
      return { message: `Model "${modelData.model_name}" already exists.` };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        try {
          const response = await axios.post(`${baseUrl}/models`, modelData);
          return response.data;
        } catch (creationError) {
          console.error('Error creating model:', creationError);
          throw creationError;
        }
      } else {
        console.error('Error checking model existence:', error);
        throw error;
      }
    }
  }

