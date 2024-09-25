const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

let jsonData = {};


router.post('/update-json', (req, res) => {
    jsonData = req.body;
    const filePath = path.join(__dirname, '../public', 'matchData.json');

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    });
});

router.get('/getFullJson', (req, res) => {
    console.log('GET /getFullJson');
    res.json(jsonData);
});


router.get('/getValue', (req, res) => {
    const { path } = req.query;
    let result = jsonData;

    if (path) {
        const keyPath = path.split('.');
        for (const key of keyPath) {
            if (result && result[key] !== undefined) {
                result = result[key];
            } else {
                result = null;
                break;
            }
        }
    }

    if (typeof result === 'string') {
        res.send(result); // Send plain text response for strings
    } else {
        res.json(result); // Send JSON response for other types
    }
});

module.exports = router;
