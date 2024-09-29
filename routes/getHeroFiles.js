
const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/getHeroFiles', (req, res) => {
    const heroesDir = path.join(__dirname, '../public/Scoreboard/Heroes');
    fs.readdir(heroesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }
        const heroFiles = files.filter(file => file.endsWith('.hero'));
        res.json(heroFiles);
    });
});


router.get('/getLogoFiles', (req, res) => {
    const logosDir = path.join(__dirname, '../src/uploads/teamLogos');

    fs.readdir(logosDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }
    
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
        const logoFiles = files.filter(file => 
            allowedExtensions.some(ext => file.endsWith(ext))
        );
    
        res.json(logoFiles);
    });
});

module.exports = router;



// app.get('/getHeroFiles', (req, res) => {
//     const heroesDir = path.join(__dirname, 'public/Scoreboard/Heroes');
//     fs.readdir(heroesDir, (err, files) => {
//         if (err) {
//             return res.status(500).json({ error: 'Failed to read directory' });
//         }
//         const heroFiles = files.filter(file => file.endsWith('.hero'));
//         res.json(heroFiles);
//     });
// });
