import { existsCheck, objToJSON, createFile, readDir, JSONToObj, readFile, removeFile, encrypt, decrypt } from '../Common/commonModules.js';
import { uniqueID } from '../Common/uniqueID.js';
import { DateTime } from '../Common/DateTime.js';
import { Path } from '../Common/path.js';
import path from 'path';

/**
 * Handle the creation of a new document in the specified model.
 *
 * This function accepts a model name and data, validates the input,
 * checks if the model directory exists, and writes a new JSON document
 * to the specified model directory.
 *
 * @param {Object} req - The request object containing model details.
 * @param {Object} req.body - The request body containing `modelName` and `data`.
 * @param {string} req.body.modelName - The name of the model to which the document will be added.
 * @param {Object} req.body.data - The data to be stored in the new document.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success with a message or error details.
 */
export const handleCreateDoc = async (req, res) => {
    const { modelName, data } = req.body;
    const dir = Path.Model + modelName;

    if (!modelName || !data) {
        return res.status(400).json({ error: `Please provide a model name and data ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    try {
        data["_id"] = uniqueID();
        data.createdAt = DateTime;

        // Encrypt the data before storing
        const encryptedData = encrypt(data);
        const location = dir + `/` + `${data["_id"]}.json`;

        createFile(location, objToJSON(encryptedData));
        return res.status(201).json({ message: "The data has been inserted successfully ✅" });

    } catch (e) {
        if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to write to the model directory 🚫` });
        } else if (e.code === 'ENOSPC') {
            return res.status(500).json({ error: `No space left on device: Unable to save document ❌` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};

/**
 * Handle the update of an existing document in the specified model.
 *
 * This function accepts a model name, data to update, and a key-value
 * pair to identify the document to be updated. It validates the input,
 * checks if the model directory exists, and updates the corresponding JSON document.
 *
 * @param {Object} req - The request object containing model details.
 * @param {Object} req.body - The request body containing `modelName`, `data`, `key`, and `value`.
 * @param {string} req.body.modelName - The name of the model where the document exists.
 * @param {Object} req.body.data - The data to be updated in the existing document.
 * @param {string} req.body.key - The key used to find the document to be updated.
 * @param {string} req.body.value - The value associated with the key to identify the document.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success with a message or error details.
 */
export const handleUpdateDoc = async (req, res) => {
    const { modelName, data, key, value } = req.body;
    const dir = Path.Model + modelName;

    if (!modelName || !data || !key) {
        return res.status(400).json({ error: `Please provide a model name, data, key and value ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    const files = readDir(dir).map(fileName => path.join(fileName));

    if (!files.length) {
        return res.status(404).json({ error: `The model is empty. 🚫` });
    }

    try {
        let fileName = null;
        let id = null;
        let createdAt = null;

        for (let index = 0; index < files.length; index++) {
            const encryptedData = JSONToObj(readFile(dir + '/' + files[index], 'utf8'));
            const fileOpen = decrypt(encryptedData); // Decrypt the data
            if (fileOpen[key] == value) {
                fileName = files[index];
                id = fileOpen['_id'];
                createdAt = fileOpen["createdAt"];
                break;
            }
        }

        if (fileName != null) {
            data["_id"] = id;
            data.createdAt = createdAt;
            data.updatedAt = DateTime;
            const location = dir + `/` + fileName;

            // Encrypt the updated data
            const encryptedData = encrypt(data);
            createFile(location, objToJSON(encryptedData));

            return res.status(201).json({ message: "The data has been updated successfully ✅", location });
        } else {
            return res.status(404).json({ error: `The specified key and value do not exist in the model for data update 🚫` });
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            return res.status(404).json({ error: `Document not found: Unable to update non-existent file 🚫` });
        } else if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to update the document 🚫` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};

/**
 * Handle the deletion of a document in the specified model.
 *
 * This function accepts a model name and a key-value pair to identify
 * the document to be deleted. It validates the input, checks if the model
 * directory exists, and removes the corresponding JSON document from the file system.
 *
 * @param {Object} req - The request object containing model details.
 * @param {Object} req.body - The request body containing `modelName`, `key`, and `value`.
 * @param {string} req.body.modelName - The name of the model from which the document will be deleted.
 * @param {string} req.body.key - The key used to find the document to be deleted.
 * @param {string} req.body.value - The value associated with the key to identify the document.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success with a message or error details.
 */
export const handleDeleteDoc = async (req, res) => {
    const { modelName, key, value } = req.body;

    if (!modelName || !key || !value) {
        return res.status(400).json({ error: `Please provide a model name, key and value ⚠️` });
    }

    const dir = Path.Model + modelName;

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    const files = readDir(dir).map(fileName => path.join(fileName));

    if (!files.length) {
        return res.status(404).json({ error: `The model is empty 🚫` });
    }

    try {
        let fileName = null;

        for (let index = 0; index < files.length; index++) {
            const encryptedData = JSONToObj(readFile(dir + '/' + files[index], 'utf8'));
            const fileOpen = decrypt(encryptedData); // Decrypt the data
            if (fileOpen[key] == value) {
                fileName = files[index];
                break;
            }
        }

        if (fileName != null) {
            const location = dir + `/` + fileName;
            removeFile(location);
            return res.status(201).json({ message: "The data has been deleted successfully ✅", location });
        } else {
            return res.status(404).json({ error: `The specified key and value do not exist in the model for data deletion 🚫` });
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            return res.status(404).json({ error: `Document not found: Unable to delete non-existent file 🚫` });
        } else if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to delete the document 🚫` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};

/**
 * Handle the reading of a document in the specified model.
 *
 * This function accepts a model name and a key-value pair to identify
 * the document to be read. It validates the input, checks if the model
 * directory exists, and retrieves the corresponding JSON document from the file system.
 *
 * @param {Object} req - The request object containing model details.
 * @param {Object} req.body - The request body containing `modelName`, `key`, and `value`.
 * @param {string} req.body.modelName - The name of the model from which the document will be read.
 * @param {string} req.body.key - The key used to find the document to be read.
 * @param {string} req.body.value - The value associated with the key to identify the document.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success with the document data or error details.
 */
export const handleReadDoc = async (req, res) => {
    const { modelName, key, value } = req.body;
    const startTime = performance.now();
    const dir = Path.Model + modelName;

    if (!modelName || !key || !value) {
        return res.status(400).json({ error: `Please provide a model name, key and value ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    const files = readDir(dir).map(fileName => path.join(fileName));

    if (!files.length) {
        return res.status(404).json({ error: `The model is empty. 🚫` });
    }

    try {
        let fileName = null;

        for (let index = 0; index < files.length; index++) {
            const encryptedData = JSONToObj(readFile(dir + '/' + files[index], 'utf8'));
            const fileOpen = decrypt(encryptedData); // Decrypt the data
            if (fileOpen[key] == value) {
                fileName = files[index];
            }
        }

        if (fileName != null) {
            const location = dir + `/` + fileName;
            const data = decrypt(JSONToObj(readFile(location, 'utf8'))); // Decrypt the retrieved data
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            return res.status(201).json({ message: "The data has been fetched successfully ✅", data, ProcessTime: timeTaken });
        } else {
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            return res.status(404).json({ error: `The specified key and value do not exist in the model for data update 🚫`, ProcessTime: timeTaken });
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            return res.status(404).json({ error: `Document not found: Unable to read non-existent file 🚫` });
        } else if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to read the document 🚫` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};