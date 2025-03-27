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


/**
 * Delay helper that returns a Promise resolved after the specified milliseconds.
 * @param {number} ms - Milliseconds to wait.
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Initiates a traiing session per batch and busy waits until completion.
 *
 * @param {string} modelName
 * @param {Object} trainingPayload
 *   Example:
 *   {
 *     inputs: [[...], [...], [...], [...], [...], [...]],
 *     outputs: [[...], [...], [...], [...], [...], [...]]
 *   }
 * @returns {Promise<void>}
 * @throws {Error}
 */
async function trainModel(modelName, trainingPayload) {
    try {
        // post request
        const postUrl = `${baseUrl}/models/${modelName}/training-session`;
        const postResponse = await axios.post(postUrl, trainingPayload);
        console.log(`Training session initiated for model "${modelName}":`, postResponse.data);

        // busy waiting for sesh to finish, 2 seconds between polls
        const getUrl = `${baseUrl}/models/${modelName}/training-session`;
        let trainingActive = true;
        while (trainingActive) {
            await delay(2000);
            const getResponse = await axios.get(getUrl);
            trainingActive = getResponse.data.training_session_active;
            console.log(`Training status for model "${modelName}": ${trainingActive ? "active" : "complete"}`);
        }
        console.log(`Training session for model "${modelName}" completed.`);
    } catch (error) {
        console.error(`Error during training for model "${modelName}":`, error.message);
        throw error;
    }
}

/**
 * Runs one training session for the specified model using the provided training payload,
 * then, once the session completes, compiles the model by calling the compile endpoint.
 *
 * @param {string} modelName - Name of the model (must be one of the existing models).
 * @param {Object} trainingPayload - Payload with exactly 6 training input/output pairs.
 * @returns {Promise<Object>} - The response data from the compile endpoint.
 * @throws {Error} - If the training session or the compilation fails.
 */
async function trainAndCompileModel(modelName, trainingPayload) {
    try {
        await trainModel(modelName, trainingPayload);

        // compilation now that training has been completed
        const compileUrl = `${baseUrl}/models/compilations`;
        const compilePayload = { model_names: [modelName] };
        const compileResponse = await axios.post(compileUrl, compilePayload);
        console.log(`Compilation completed for model "${modelName}":`, compileResponse.data);
        return compileResponse.data;
    } catch (error) {
        console.error(`Error in trainAndCompileModel for model "${modelName}":`, error.message);
        throw error;
    }
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



