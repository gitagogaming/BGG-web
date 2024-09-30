const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const upload = require('../middlewares/multer');
const unzipper = require('unzipper');


/////////////////
// - LOCAL UPLOADS
////////////////


// Handling Uploads for Game Config files on the local side
router.post('/upload/config', upload.single('configFile'), async (req, res) => {
    if (!req.file) {
        console.log('No Config file uploaded or invalid file type');
        return res.status(400).json({ message: 'No file uploaded or invalid file type' });
    }

    console.log("Upload Config:", req.body);
    const uploadDir = path.join(__dirname, '../public/configs', req.body.path || '');
    const filename = req.file.originalname;
    const filepath = path.join(uploadDir, filename);

    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Save the uploaded .BGG file temporarily
    const tempFilePath = path.join(uploadDir, 'temp.bgg');
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Extract the .BGG file
    fs.createReadStream(tempFilePath)
        .pipe(unzipper.Extract({ path: uploadDir }))
        .on('close', () => {
            // Remove the temporary .BGG file
            fs.unlinkSync(tempFilePath);

            console.log(`File extracted and saved: ${filename}`);

            res.status(200).json({
                message: 'File uploaded and extracted successfully',
                filename: filename,
            });
        })
        .on('error', (err) => {
            console.error('Error extracting file:', err);
            res.status(500).json({ message: 'Error extracting file' });
        });
});



// Handling Uploads for Team Logos on the local side
router.post('/upload', upload.single('teamLogo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadDir = path.join(__dirname, '../public/uploads/teamLogos', req.body.path || '');
    const teamName = req.body.teamName || req.body.name || 'default';
    const filename = `${teamName}`;

    // Saving the file based on teamName sent in the request - perhaps this should be another way but for now...
    const filepath = path.join(uploadDir, filename);

    // Ensure the directory exists
    fs.mkdirSync(uploadDir, { recursive: true });

    // Saving Logo.. - Do we want to limit an overwrite.. file size, etc?
    fs.writeFile(filepath, req.file.buffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).json({ message: 'Error saving file' });
        }

        console.log(`File saved: ${filename}`);

        res.status(200).json({
            message: 'File uploaded successfully',
            filename: filename,
            path: filepath,
            teamName: teamName
        });
    });
});




module.exports = router;





















//---------- Decided to go the .zip file route with EVERYTHING packaged inside
// router.post('/upload/config', upload.single('configFile'), (req, res) => {
//     if (!req.file) {
//         console.log('No Config file uploaded or invalid file type');
//         return res.status(400).json({ message: 'No file uploaded or invalid file type' });
//     }

//     console.log("Upload Config:", req.body);
//     const uploadDir = path.join(__dirname, '../public/configs', req.body.path || '');
//     const filename = req.file.originalname;
//     const filepath = path.join(uploadDir, filename);

//     // Ensure the directory exists
//     fs.mkdirSync(uploadDir, { recursive: true });

//     // Saving Config.. - Do we want to limit an overwrite.. file size, etc?
//     fs.writeFile(filepath, req.file.buffer, (err) => {
//         if (err) {
//             console.error('Error saving file:', err);
//             return res.status(500).json({ message: 'Error saving file' });
//         }

//         console.log(`File saved: ${filename}`);

//         res.status(200).json({
//             message: 'File uploaded successfully',
//             filename: filename,
//         });
//     });
// });