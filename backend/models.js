const fs = require('fs');
const path = require('path');

// Simulated Database Model
const OrganModel = {
    getOrganData: (organName) => {
        try {
            const filePath = path.join(__dirname, '../data', `${organName}.json`);
            const rawData = fs.readFileSync(filePath);
            return JSON.parse(rawData);
        } catch (error) {
            console.error("Error reading data:", error);
            return null;
        }
    }
};

module.exports = OrganModel;
