const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer


// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



router.post('/api/uploadImage', upload.single('teamLogo'), async (req, res) => {
    const file = req.file;
    const cloudFolder = req.body.folder;
  
    console.log("file", file);
    console.log("Cloud Folder:", cloudFolder);
  
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
  
    try {
      const publicId = await uploadImage(file.buffer, cloudFolder);
      res.json({ publicId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  
  router.post('/api/createFolders', async (req, res) => {
    const { folderNames } = req.body;
    try {
      const message = await createFolders(folderNames);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/api/generateImageUrl', (req, res) => {
    const { publicId, transformations } = req.query;
    try {
      const url = generateImageUrl(publicId, JSON.parse(transformations));
      res.json({ url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.post('/api/renameImage', async (req, res) => {
    const { currentPublicId, newPublicId, newDisplayName } = req.body;
    try {
      const message = await renameImage(currentPublicId, newPublicId, newDisplayName);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.delete('/api/deleteImage', async (req, res) => {
    const { publicId } = req.body;
    try {
      const message = await deleteImage(publicId);
      res.json({ message });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.get('/api/fetchImages', async (req, res) => {
    const { folderName } = req.query;
    try {
      const resources = await fetchImages(folderName);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;