const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const fs = require('fs');
const multer = require('multer');


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Use memory storage
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('teamLogo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const teamName = req.body.teamName || 'default';
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${teamName}-${Date.now()}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFile(filepath, req.file.buffer, (err) => {
        if (err) {
            console.error('Error saving file:', err);
            return res.status(500).json({ message: 'Error saving file' });
        }

        console.log('Uploaded file:', {
            originalname: req.file.originalname,
            filename: filename,
            path: filepath,
            size: req.file.size
        });
        console.log('Team name:', teamName);

        res.status(200).json({
            message: 'File uploaded successfully',
            filename: filename,
            path: filepath,
            teamName: teamName
        });
    });
});

let jsonData = {};

// Serve static HTML files from the public/html directory
app.use(express.static(path.join(__dirname, '../public/html')));

// Serve static files from the scoreboard directory
app.use('/scoreboard', express.static(path.join(__dirname, '../public/scoreboard')));

app.post('/update-json', (req, res) => {
    jsonData = req.body;
    res.sendStatus(200);
});

// Endpoint to get the full JSON data
app.get('/getFullJson', (req, res) => {
    res.json(jsonData);
});

app.get('/getHeroFiles', (req, res) => {
  const heroesDir = path.join(__dirname, '../public/Scoreboard/Heroes');
  fs.readdir(heroesDir, (err, files) => {
      if (err) {
          return res.status(500).json({ error: 'Failed to read directory' });
      }
      const heroFiles = files.filter(file => file.endsWith('.hero'));
      res.json(heroFiles);
  });
});

// Endpoint to get a specific value from the JSON data
app.get('/getValue', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});