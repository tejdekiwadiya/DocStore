import express from 'express';
import { handleCreateModel, handleRenameModel, handleDeleteModel, handleAccessModel } from "../controller/ModelOperation.js";
import { handleCreateDoc, handleUpdateDoc, handleDeleteDoc, handleReadDoc } from '../controller/DataOperation.js';
import { handleQueryByField } from '../controller/QueryOperation.js';
import { handleBackupModel, handleRestoreModel } from '../controller/BackUpRestoreOperation.js';

const routes = express.Router();

/**
 * @route POST /models
 * @desc Create a new model
 * @access Public
 * @returns {Object} - Confirmation message and created model object in JSON format.
 * @throws {Object} - Error messages for validation and processing issues.
 */
routes.post('/models', handleCreateModel);

/**
 * @route PUT /models/:oldName
 * @desc Rename an existing model
 * @access Public
 * @returns {Object} - Confirmation message and updated model object in JSON format.
 * @throws {Object} - Error messages for non-existent models or invalid names.
 */
routes.put('/models/:oldName', handleRenameModel);

/**
 * @route DELETE /models/:name
 * @desc Delete a model
 * @access Public
 * @returns {Object} - Confirmation message indicating model deletion.
 * @throws {Object} - Error message if the model does not exist.
 */
routes.delete('/models/:name', handleDeleteModel);

/**
 * @route POST /models/access
 * @desc Access model data
 * @access Public
 * @returns {Object} - Requested model data in JSON format.
 * @throws {Object} - Error message if the model does not exist or access is unauthorized.
 */
routes.post('/models/access', handleAccessModel);

/**
 * @route POST /data
 * @desc Create a new document
 * @access Public
 * @returns {Object} - Confirmation message indicating document creation.
 * @throws {Object} - Error messages for validation errors or creation issues.
 */
routes.post('/data', handleCreateDoc);

/**
 * @route POST /data/update
 * @desc Update an existing document
 * @access Public
 * @returns {Object} - Confirmation message indicating document update.
 * @throws {Object} - Error messages for validation errors or update issues.
 */
routes.post('/data/update', handleUpdateDoc);

/**
 * @route POST /data/delete
 * @desc Delete an existing document
 * @access Public
 * @returns {Object} - Confirmation message indicating document deletion.
 * @throws {Object} - Error messages for validation errors or non-existent documents.
 */
routes.post('/data/delete', handleDeleteDoc);

/**
 * @route POST /data/read
 * @desc Read an existing document
 * @access Public
 * @returns {Object} - Confirmation message and requested document data.
 * @throws {Object} - Error messages for non-existent documents or access issues.
 */
routes.post('/data/read', handleReadDoc);

/**
 * @route POST /query
 * @desc Query data by field in a specified model
 * @access Public
 * @returns {Object} - Confirmation message and queried data.
 * @throws {Object} - Error messages for invalid queries or model access issues.
 */
routes.post('/query', handleQueryByField);

/**
 * @route POST /backup
 * @desc Backup the specified model
 * @access Public
 * @returns {Object} - Confirmation message indicating successful backup.
 * @throws {Object} - Error messages for backup failures or invalid model names.
 */
routes.post('/backup', handleBackupModel);

/**
 * @route POST /restore
 * @desc Restore the specified model from backup
 * @access Public
 * @returns {Object} - Confirmation message indicating successful restoration.
 * @throws {Object} - Error messages for restoration failures or invalid model names.
 */
routes.post('/restore', handleRestoreModel);

export default routes;