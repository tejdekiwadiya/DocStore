import { writeFileSync, readFileSync } from 'fs';

const dataUniqueIDPath = './unique/dataUniqueId.json';

/**
 * Generate a unique identifier by ensuring it does not already exist in the storage.
 * 
 * @returns {number} - A unique identifier as a number.
 * 
 * This function reads existing IDs from a JSON file, generates a new random ID, 
 * checks for its uniqueness, and saves it if it is indeed unique.
 */
function uniqueID() {
    const file = readFileSync(dataUniqueIDPath); 
    const readFile = JSON.parse(file); 

    const uniqueGen = Math.floor(Math.random() * 1e12); 

    if (readFile[uniqueGen] == uniqueGen) {
        return uniqueID();
    }

    readFile[uniqueGen] = uniqueGen; 
    writeFileSync(dataUniqueIDPath, JSON.stringify(readFile, null, 2)); 

    return uniqueGen; 
}

export { uniqueID };