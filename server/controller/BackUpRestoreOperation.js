// import { unlinkSync } from 'fs';
import { backUpModel, restoreModel, existsCheck, readDir, removeDir } from '../Common/commonModules.js';
import { Path } from '../Common/path.js';
import path from 'path';

/**
 * Handles the backup of a specified database model.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.modelName - The name of the model to backup.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 */
export const handleBackupModel = async (req, res) => {
    const { modelName } = req.body;

    const startTime = performance.now();
    const dir = Path.Model + modelName;
    const storeDir = Path.BackUp;

    if (!modelName) {
        return res.status(400).json({ error: `Please provide a model name ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model found with the specified name 🚫` });
    }

    const files = readDir(dir).map(fileName => path.join(fileName));

    if (!files.length) {
        return res.status(404).json({ error: `The model is empty. 🚫` });
    }

    try {
        backUpModel(dir, storeDir, modelName).then((backupResult) => {
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            res.status(200).json({
                message: `Backup successfully created at ${backupResult.output} ✅`, ProcessTime: timeTaken
            });
        });
    } catch (e) {
        return res.status(404).json({
            error: `An error occurred from the end side: ${e.message}`
        });
    }
}

/**
 * Handles the restoration of a specified database model from a backup.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {string} req.body.modelName - The name of the model to restore.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Returns a promise that resolves to void.
 */
export const handleRestoreModel = async (req, res) => {
    const { modelName } = req.body;

    const startTime = performance.now();
    const dir = Path.BackUp + `${modelName}.zip`;
    const storeDir = Path.Model;

    if (!modelName) {
        return res.status(400).json({ error: `Please provide a model name ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No model backup found with the specified name 🚫` });
    }

    try {
        restoreModel(dir, storeDir, modelName).then((restoreResult) => {
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            res.status(200).json({
                message: `Restore successfully created at ${restoreResult.output} ✅`, ProcessTime: timeTaken
            });
        });
    } catch (e) {
        return res.status(404).json({
            error: `An error occurred from the end side: ${e.message}`
        });
    }
}

/**
 * Handle the deletion of a model.
 *
 * This function accepts a model name, checks for its existence,
 * and removes the corresponding model directory from the file system.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the model name.
 * @param {string} req.body.modelName - The name of the backup to be deleted.
 * @param {Object} res - The response object used to send back the response.
 * @returns {Object} - JSON response indicating success or error.
 */
export const handleDeleteBackup = async (req, res) => {
    const { modelName } = req.body;
    const dir = Path.BackUp + modelName + '.zip';

    if (!modelName) {
        return res.status(400).json({ error: `Please provide a model name ⚠️` });
    }

    if (!existsCheck(dir)) {
        return res.status(404).json({ error: `No backup found with the specified name 🚫` });
    }

    try {
        removeDir(dir);
        return res.status(201).json({ message: "The backup has been deleted successfully ✅" });
    } catch (e) {
        if (e.code === 'EACCES') {
            return res.status(500).json({ error: `Permission denied: Unable to delete the backup zip 🚫` });
        } else if (e.code === 'ENOSPC') {
            return res.status(500).json({ error: `No space left on device: Unable to delete backup ❌` });
        } else {
            return res.status(500).json({ error: `❌ File System Error: ${e.message}` });
        }
    }
};