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
 * @returns {Promise<Object>}
 *
 */
async function giveFeedback() {
    
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
