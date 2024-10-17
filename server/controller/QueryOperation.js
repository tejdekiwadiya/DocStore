import { existsCheck, readDir, JSONToObj, readFile, decrypt } from '../Common/commonModules.js';
import { Path } from '../Common/path.js';
import path from 'path';

/**
 * Handle querying documents by a specific field in the specified model.
 *
 * This function checks if the model exists, reads all documents within the model,
 * and returns those that contain the specified key.
 *
 * @param {Object} req - The request object containing model details.
 * @param {Object} req.body - The request body containing `modelName` and `key`.
 * @param {string} req.body.modelName - The name of the model to query.
 * @param {string} req.body.key - The field to search for in the model documents.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response with searched data or error details.
 */
export const handleQueryByField = async (req, res) => {
    const { modelName, key } = req.body;
    const startTime = performance.now();
    const dir = Path.Model + modelName;

    if (!modelName || !key) {
        return res.status(400).json({ error: `Please provide a model name and key ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    const files = readDir(dir).map(fileName => path.join(fileName));

    if (!files.length) {
        return res.status(404).json({ error: `The model is empty. 🚫` });
    }

    try {
        let data = [];

        for (let index = 0; index < files.length; index++) {
            const encryptedData = JSONToObj(readFile(dir + '/' + files[index], 'utf8'));
            const fileOpen = decrypt(encryptedData); // Decrypt the data
            if (fileOpen[key]) {
                data.push(fileOpen);
            }
        }

        if (data.length) {
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            return res.status(201).json({ message: "The data has been searched successfully ✅", data, ProcessTime: timeTaken });
        } else {
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            return res.status(404).json({ error: `The specified key does not exist in the model for search by field 🚫`, ProcessTime: timeTaken });
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            return res.status(404).json({ error: `Document not found: Unable to search by field in non-existent file 🚫` });
        } else if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to search by field the document 🚫` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};
