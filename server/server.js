import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/userRoutes.js';

// Load environment variables from the .env file
dotenv.config({
    path: './.env' // Specify the path to the .env file for loading environment variables
});

// Initialize the Express application
const app = express();

// Set the port to listen on, defaulting to 3001 if not specified in the environment variables
const PORT = process.env.PORT || 3001; // This allows for flexible port configuration based on the environment

// Middleware to parse JSON request bodies
app.use(express.json()); // Enables the application to parse incoming JSON requests

/**
 * @route /v1/api
 * @desc User-related operations
 * @access Public
 */
app.use('/v1/api', userRoutes); // Sets up a base URL for all user-related API endpoints

// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`🌐 DocStore Server is running on ${PORT}`); // Logs the server's running status and the port
});