const axios = require('axios');

const baseUrl = 'http://localhost:5000'

model1_neurons = 6
model2_neurons = 6
model3_neurons = 6

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

/**
 * @param {}
 * @returns {}
 * @throws {Error}
 */
async function trainModel(modelNames) {
    
}

/**
 * @param {}
 * @returns {}
 * @throws {Error}
 */
async function trainAndCompileModel(modelNames) { //change to account for busy waiting
    
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

module.exports = {
    createModel,
    trainAndCompileModel,
    deleteModel,
    getModelInfo
};