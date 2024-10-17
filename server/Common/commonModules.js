import { existsSync, mkdirSync, renameSync, rmSync, readdirSync, writeFileSync, readFileSync, unlinkSync } from "fs";
import AdmZip from 'adm-zip';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ENCRYPT_KEY = `HrOU3lsNaHFAnMYXFPwpopzoN+7yLEAFhwo1WrRbzm4/JF0Rht+kS9gVUrN7p7tf`;
const key = crypto.createHash('sha256').update(ENCRYPT_KEY).digest('base64').substr(0, 32);
const iv = crypto.randomBytes(16);

/**
 * Check if a directory exists.
 *
 * @param {string} dir - The path of the directory to check.
 * @returns {boolean} - True if the directory exists, otherwise false.
 */
export const existsCheck = (dir) => existsSync(dir);

/**
 * Create a directory recursively.
 *
 * @param {string} dir - The path of the directory to create.
 */
export const createDir = (dir) => mkdirSync(dir, { recursive: true });

/**
 * Rename a directory.
 *
 * @param {string} oldDir - The current path of the directory.
 * @param {string} newDir - The new path for the directory.
 */
export const renameDir = (oldDir, newDir) => renameSync(oldDir, newDir);

/**
 * Remove a directory and its contents.
 *
 * @param {string} dir - The path of the directory to remove.
 */
export const removeDir = (dir) => rmSync(dir, { recursive: true, force: true });

/**
 * Read the contents of a directory.
 *
 * @param {string} dir - The path of the directory to read.
 * @returns {Array<string>} - An array of the names of the files in the directory.
 */
export const readDir = (dir) => readdirSync(dir);

/**
 * Convert an object to a JSON string.
 *
 * @param {Object} data - The object to convert.
 * @returns {string} - The JSON string representation of the object.
 */
export const objToJSON = (data) => JSON.stringify(data, null, 2);

/**
 * Convert a JSON string to an object.
 *
 * @param {string} data - The JSON string to convert.
 * @returns {Object} - The object represented by the JSON string.
 */
export const JSONToObj = (data) => JSON.parse(data);

/**
 * Create a file with the specified data.
 *
 * @param {string} path - The path of the file to create.
 * @param {string} data - The data to write to the file.
 */
export const createFile = (path, data) => writeFileSync(path, data);

/**
 * Read the contents of a file.
 *
 * @param {string} location - The path of the file to read.
 * @param {string} decode - The encoding to use when reading the file.
 * @returns {string} - The contents of the file.
 */
export const readFile = (location, decode) => readFileSync(location, decode);

/**
 * Remove a file.
 *
 * @param {string} location - The path of the file to remove.
 */
export const removeFile = (location) => unlinkSync(location);

/**
 * Back up a model by zipping its directory.
 *
 * @param {string} dir - The directory of the model to back up.
 * @param {string} storeDir - The directory where the backup zip file will be stored.
 * @param {string} modelName - The name of the model for naming the zip file.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the output path of the backup.
 */
export const backUpModel = async (dir, storeDir, modelName) => {
    const zip = new AdmZip();
    zip.addLocalFolder(dir);

    const output = `${storeDir}${modelName}.zip`;

    try {
        await zip.writeZipPromise(output);
        return { output };
    } catch (error) {
        return { error };
    }
}

/**
 * Restore a model from a zip file.
 *
 * @param {string} dir - The path of the zip file to restore.
 * @param {string} storeDir - The directory where the model will be restored.
 * @param {string} modelName - The name of the model to restore.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the output path of the restored model.
 */
export const restoreModel = async (dir, storeDir, modelName) => {
    const zip = new AdmZip(dir);
    const output = `${storeDir}` + `${modelName}`;

    try {
        zip.extractAllToAsync(output);
        return { output };
    } catch (error) {
        return { error };
    }
}

/**
 * Encrypt data using AES-256-CBC algorithm.
 *
 * @param {Object} data - The data to encrypt.
 * @returns {Object} - An object containing the initialization vector and the encrypted data.
 */
export const encrypt = (data) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), encryptedData: encrypted };
};

/**
 * Decrypt encrypted data using AES-256-CBC algorithm.
 *
 * @param {Object} encryption - The object containing the initialization vector and encrypted data.
 * @returns {Object} - The decrypted data.
 */
export const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encryption.iv, 'hex'));
    let decrypted = decipher.update(encryption.encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
};