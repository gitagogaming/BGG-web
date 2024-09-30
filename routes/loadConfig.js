const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const xml2js = require('xml2js');

const CONFIG_DIR = path.join(__dirname, '../public/configs');

// Function to simplify the parsed JSON structure
const simplifyJson = (obj) => {
    if (Array.isArray(obj) && obj.length === 1) {
        return simplifyJson(obj[0]);
    } else if (typeof obj === 'object') {
        for (const key in obj) {
            if (key === '$') {
                Object.assign(obj, obj[key]);
                delete obj[key];
            } else {
                obj[key] = simplifyJson(obj[key]);
            }
        }
    }
    return obj;
};

// Endpoint to get the list of XAML files
router.get('/config', (req, res) => {
    fs.readdir(CONFIG_DIR, (err, files) => {
        if (err) {
            console.error('Error reading config directory:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const xamlFiles = files.filter(file => file.endsWith('.xaml'));
        const configs = {};

        xamlFiles.forEach(file => {
            const filePath = path.join(CONFIG_DIR, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            xml2js.parseString(fileContent, (err, result) => {
                if (err) {
                    console.error('Error parsing XAML file:', err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                const simplifiedConfig = simplifyJson(result);
                const gameName = simplifiedConfig.config.game.trim();
                configs[gameName] = simplifiedConfig.config;
            });
        });

        res.json(configs);
    });
});

module.exports = router;