import { backUpModel, restoreModel, existsCheck, readDir } from '../Common/commonModules.js';
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