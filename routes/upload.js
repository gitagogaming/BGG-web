const express = require('express');
const path = require('path');
const fs = require('fs');
const upload = require('../middlewares/multer');

const router = express.Router();

/////////////////
// - LOCAL UPLOADS
////////////////

// Define the upload directory
const uploadDir = path.join(__dirname, '../public/uploads/teamLogos');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Use memory storage for file uploads

router.post('/upload', upload.single('teamLogo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const uploadDir = path.join(__dirname, '../src/uploads/teamLogos', req.body.path || '');
    const teamName = req.body.teamName || req.body.name || 'default';
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${teamName}${fileExtension}`;
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