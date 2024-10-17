# DocStore

![License](https://img.shields.io/badge/license-ISC-blue.svg)

## Description

DocStore is a custom database server designed for managing document storage and retrieval. It provides RESTful API endpoints for creating, accessing, updating, and deleting models and documents, as well as for backing up and restoring data.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Dynamic Model Management**: Effortlessly create, rename, and delete models, providing a flexible structure for your data storage needs. Each model acts as a unique container, tailored to your specific data requirements.

- **Robust Document Operations**: Seamlessly create, read, update, and delete documents within your models. This functionality allows for comprehensive data management, ensuring that you can manipulate your data exactly how you need.

- **Intuitive Querying**: Easily search for documents by specific fields, enabling you to find the exact information you need without hassle. This powerful querying capability makes retrieving relevant data quick and efficient.

- **Effortless Backup and Restore**: Protect your valuable data with built-in backup and restore functionality. Create secure backups of your models and restore them with ease, ensuring that your data is always safe and recoverable.

- **User-Friendly API**: Designed with a clean and intuitive RESTful API, allowing for straightforward integration with front-end applications or third-party services. Developers can easily connect to the DocStore for smooth data operations.

- **Comprehensive Error Handling**: Robust error handling provides meaningful feedback for various scenarios, from validation errors to permission issues. This ensures that users are always informed about the state of their operations.

- **Performance Tracking**: Each API call logs the time taken for operations, helping to identify performance bottlenecks and optimize data handling processes. Monitor the efficiency of your database operations effortlessly.

- **Customizable Environment**: Utilize a simple `.env` file to configure server settings, such as the port number, allowing for easy adjustments to fit your deployment needs.

- **Secure Data Management**: With data encryption capabilities, ensure that your documents are stored securely, safeguarding sensitive information against unauthorized access.

- **Open Source Contribution**: Join a growing community of contributors. The project welcomes pull requests, allowing you to enhance the system and make your mark in the DocStore ecosystem.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/tejdekiwadiya/DocStore.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd DocStore
   cd server
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Create a `.env` file** in the root directory and set your environment variables:

   ```plaintext
   PORT=8080
   ```

## Usage

1. **Start the server**:

   ```bash
   npm run nodemon
   ```

2. **Access the API**:

   The server will be running at `http://localhost:8080/v1/api`. Use a tool like Postman or cURL to interact with the API endpoints.

## API Endpoints

| Method | Endpoint             | Description                               |
|--------|----------------------|-------------------------------------------|
| POST   | `/models`            | Create a new model                        |
| PUT    | `/models/:oldName`   | Rename an existing model                  |
| DELETE | `/models/:name`      | Delete a model                            |
| POST   | `/models/access`     | Access model data                         |
| POST   | `/data`              | Create a new document                     |
| POST   | `/data/update`       | Update an existing document               |
| POST   | `/data/delete`       | Delete an existing document               |
| POST   | `/data/read`         | Read an existing document                 |
| POST   | `/query`             | Query data by field in a specified model |
| POST   | `/backup`            | Backup the specified model                |
| POST   | `/restore`           | Restore the specified model from backup   |

## Environment Variables

- `PORT`: The port on which the server will run (default is `8080`).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/YourFeature
   ```
5. Open a pull request.

Here’s a **References** section that you can include in your README file, formatted for clarity and readability:

## References

- **Working with Folders in Node.js**: [Node.js Documentation](https://nodejs.org/en/learn/manipulating-files/working-with-folders-in-nodejs)

- **Read/Write JSON Files with Node.js**: [Hey Node](https://heynode.com/tutorial/readwrite-json-files-nodejs/)

- **How to Work with Files in Node.js**: [FreeCodeCamp](https://www.freecodecamp.org/news/how-to-work-with-files-in-node-js/)

- **How to Work with Zip Files in Node.js**: [DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-work-with-zip-files-in-node-js)

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
````
ISC License

Copyright (c) 2024 Tej Dekiwadiya

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to use, copy, modify, merge, publish, distribute, and sublicense the Software, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

2. Any modifications made to the Software must be documented in the accompanying documentation.

3. Redistribution of the Software in its original or modified form must include a copy of this license.

4. The name of the author or contributors may not be used to endorse or promote products derived from this Software without specific prior written permission.

5. The Software may not be sold or used for commercial purposes without express permission from the author.

6. Users of this Software assume all risks associated with its use, including but not limited to any issues that may arise from modifications or integrations into other projects.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```