import { existsCheck, createDir, renameDir, removeDir, readDir } from '../Common/commonModules.js';
import { Path } from '../Common/path.js';

/**
 * Handle the creation of a new model.
 *
 * This function accepts a model name, checks for its existence,
 * and creates a new directory for the model if it doesn't already exist.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the model name.
 * @param {string} req.body.modelName - The name of the model to be created.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success or error.
 */
export const handleCreateModel = async (req, res) => {
    const { modelName } = req.body;
    const dir = Path.Model + modelName;

    if (!modelName) {
        return res.status(400).json({ error: `Please provide a model name ⚠️` });
    }

    if (existsCheck(dir)) {
        return res.status(403).json({ error: `A model with this name already exists ⚠️` });
    }

    try {
        createDir(dir);
        return res.status(201).json({ message: "The model has been created successfully ✅" });
    } catch (e) {
        if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to write to the model directory 🚫` });
        } else if (e.code === 'ENOSPC') {
            return res.status(500).json({ error: `No space left on device: Unable to save model ❌` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};

/**
 * Handle renaming an existing model.
 *
 * This function accepts the old and new model names, checks for their validity,
 * and renames the specified model directory.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the old and new model names.
 * @param {string} req.body.modelOldName - The current name of the model to be renamed.
 * @param {string} req.body.modelNewName - The new name for the model.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success or error.
 */
export const handleRenameModel = async (req, res) => {
    const { modelOldName, modelNewName } = req.body;
    const oldDir = './database/' + modelOldName;
    const newDir = './database/' + modelNewName;

    if (!modelNewName || !modelOldName) {
        return res.status(400).json({ error: `Please enter both the old and new model names ⚠️` });
    }

    if (modelNewName === modelOldName) {
        return res.status(400).json({ error: `The new model name must be different from the old name ⚠️` });
    }

    if (!existsCheck(oldDir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    if (existsCheck(newDir)) {
        return res.status(403).json({ error: `A model with this name already exists ⚠️` });
    }

    try {
        renameDir(oldDir, newDir);
        return res.status(201).json({ message: "The model has been renamed successfully ✅" });
    } catch (e) {
        if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to rename the model directory 🚫` });
        } else if (e.code === 'ENOSPC') {
            return res.status(500).json({ error: `No space left on device: Unable to rename model ❌` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};

/**
 * Handle the deletion of a model.
 *
 * This function accepts a model name, checks for its existence,
 * and removes the corresponding model directory from the file system.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the model name.
 * @param {string} req.body.modelName - The name of the model to be deleted.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success or error.
 */
export const handleDeleteModel = async (req, res) => {
    const { modelName } = req.body;
    const dir = Path.Model + modelName;

    if (!modelName) {
        return res.status(400).json({ error: `Please provide a model name ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    try {
        removeDir(dir);
        return res.status(201).json({ message: "The model has been deleted successfully ✅" });
    } catch (e) {
        if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to delete the model directory 🚫` });
        } else if (e.code === 'ENOSPC') {
            return res.status(500).json({ error: `No space left on device: Unable to delete model ❌` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};

/**
 * Handle access to model files.
 *
 * This function accepts a model name, checks for its existence,
 * and retrieves the files within the specified model directory.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the model name.
 * @param {string} req.body.modelName - The name of the model to access.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response with model files or error details.
 */
export const handleAccessModel = async (req, res) => {
    const { modelName } = req.body;
    const dir = Path.Model + modelName;

    if (!modelName) {
        return res.status(400).json({ error: `Please provide a model name ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    try {
        const files = readDir(dir);

        if (!files.length) {
            return res.status(404).json({ error: `The model is empty. Please add data to proceed 🚫` });
        }

        return res.status(200).json({ message: "The model files have been successfully fetched ✅", files });
    } catch (e) {
        if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to access the model directory 🚫` });
        } else if (e.code === 'ENOSPC') {
            return res.status(500).json({ error: `No space left on device: Unable to access model ❌` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};