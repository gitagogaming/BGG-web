const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/api/images', (req, res) => {
    const imagesDir = path.join(__dirname, '../public/uploads/teamLogos');

    const getFilesAndFolders = (dir) => {
        const items = [];
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                items.push({
                    name: file,
                    type: 'folder',
                    path: fullPath.replace(imagesDir, '')
                });
                // Recursively get files and folders within this folder
                items.push(...getFilesAndFolders(fullPath));
            } else if (/\.(png|jpg|jpeg|webm)$/i.test(file)) {
                items.push({
                    name: file,
                    type: 'file',
                    path: fullPath.replace(imagesDir, '')
                });
            }
        });

        return items;
    };

    try {
        const items = getFilesAndFolders(imagesDir);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Unable to scan directory' });
    }
});

module.exports = router;