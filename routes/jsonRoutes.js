const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

let jsonData = {};


router.post('/update-json', (req, res) => {
    jsonData = req.body;

    // writing to file here needs to move to 'exportData' as shown below 
    const filePath = path.join(__dirname, '../public', 'matchData.json');

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    });
});


// EXPORT DATA ROUTE -  Not used solely yet.. the above code needs to be removed besides receiving jsonData
// issue is when we do this then the 'last updated' data doesnt populate for the generateTeamSide.. is it reading form MatchData.json on bootup or whats going on?
router.post('/export-matchData', (req, res) => {
    // jsonData = req.body;
    const filePath = path.join(__dirname, '../public', 'matchData.json');

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    });
});



// this call is simply returning the json data we have in memory from a previous call to the server
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
