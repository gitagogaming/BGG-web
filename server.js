const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { createProxyMiddleware } = require('http-proxy-middleware'); // Proxy middleware for development

const app = express();
const PORT = process.env.PORT || 8080;

// Determine if we're in production mode
const isProduction = false;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the upload directory
const uploadDir = path.join(__dirname, 'public/uploads/teamLogos');

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Use memory storage for file uploads
const upload = multer({ storage: multer.memoryStorage() });


// // File upload route - Original
// app.post('/upload', upload.single('teamLogo'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const teamName = req.body.teamName || 'default';
//     const fileExtension = path.extname(req.file.originalname);
//     const filename = `${teamName}${fileExtension}`;
//     const filepath = path.join(uploadDir, filename);

//     fs.access(filepath, fs.constants.F_OK, (err) => {
//         if (!err) {
//             console.log(`File ${filename} already exists, skipping overwrite.`);
//             return res.status(200).json({
//                 message: 'File already exists, skipping overwrite',
//                 filename: filename,
//                 path: filepath,
//                 teamName: teamName
//             });
//         } else {
//             fs.writeFile(filepath, req.file.buffer, (err) => {
//                 if (err) {
//                     console.error('Error saving file:', err);
//                     return res.status(500).json({ message: 'Error saving file' });
//                 }

//                 console.log(`File saved: ${filename}`);

//                 res.status(200).json({
//                     message: 'File uploaded successfully',
//                     filename: filename,
//                     path: filepath,
//                     teamName: teamName
//                 });
//             });
//         }
//     });
// });


// File upload route


app.post('/upload', upload.single('teamLogo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const teamName = req.body.teamName || 'default';
    const fileExtension = path.extname(req.file.originalname);
    const filename = `${teamName}${fileExtension}`;
    const filepath = path.join(uploadDir, filename);

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


// JSON data update route
let jsonData = {};
app.post('/update-json', (req, res) => {
    jsonData = req.body;
    const filePath = path.join(__dirname, 'matchData.json');

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    });
});



// Endpoint to serve the full JSON data
app.get('/getFullJson', (req, res) => {
    console.log('GET /getFullJson');
    res.json(jsonData);
});

// Serving hero files
app.get('/getHeroFiles', (req, res) => {
    const heroesDir = path.join(__dirname, './public/Scoreboard/Heroes');
    fs.readdir(heroesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }
        const heroFiles = files.filter(file => file.endsWith('.hero'));
        res.json(heroFiles);
    });
});

// Endpoint to retrieve specific values from JSON data
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






// In production, serve the built React app
if (isProduction) {
    app.use(express.static(path.join(__dirname, 'build')));

    // Serve the index.html on any unknown route (for SPA support)
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
} else {
    // Setting up the 'dev' enviroment
    console.log("Dont forget to start the dev server with npm start");

    // Serving static HTML files from the public/html directory
    app.use(express.static(path.join(__dirname, './public/html')));

    app.get('/matchData.json', (req, res) => {
        const filePath = path.join(__dirname, 'matchData.json');
        res.sendFile(filePath);
    });

    app.use(
        createProxyMiddleware({
            target: 'http://localhost:3000',
            changeOrigin: true,
        })
    );
}



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





























// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const path = require('path');
// const app = express();
// const PORT = process.env.PORT || 8080;
// const fs = require('fs');
// const multer = require('multer');


// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));



// // Serve static files from the uploads directory


// const uploadDir = path.join(__dirname, 'public/uploads/teamLogos');

// // Ensure the directory exists
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// // Use memory storage
// const upload = multer({ storage: multer.memoryStorage() });

// app.post('/upload', upload.single('teamLogo'), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const teamName = req.body.teamName || 'default';
//     const fileExtension = path.extname(req.file.originalname);
//     const filename = `${teamName}${fileExtension}`; // Original file without timestamp
//     const filepath = path.join(uploadDir, filename); // Path for original file

//     // Check if the original file already exists before writing it
//     fs.access(filepath, fs.constants.F_OK, (err) => {
//         if (!err) {
//             console.log(`File ${filename} already exists, skipping overwrite.`);
//             return res.status(200).json({
//                 message: 'File already exists, skipping overwrite',
//                 filename: filename,
//                 path: filepath,
//                 teamName: teamName
//             });
//         } else {
//             // Save the original file in the teamLogos folder
//             fs.writeFile(filepath, req.file.buffer, (err) => {
//                 if (err) {
//                     console.error('Error saving file:', err);
//                     return res.status(500).json({ message: 'Error saving file' });
//                 }

//                 console.log(`File saved: ${filename}`);

//                 res.status(200).json({
//                     message: 'File uploaded successfully',
//                     filename: filename,  // Return the original file name
//                     path: filepath,  // Return the original file path
//                     teamName: teamName
//                 });
//             });
//         }
//     });
// });

// let jsonData = {};

// // Serve static HTML files from the public/html directory

// // Serve static files from the build directory (React app)
// app.use(express.static(path.join(__dirname, 'build')));

// // Serve the index.html on any unknown route (React app SPA routing)
// // app.get('*', (req, res) => {
// //     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// // });

// // Serve static files from the uploads, scoreboard, and other directories
// app.use('/uploads', express.static(path.join(__dirname, './public/uploads')));
// app.use('/scoreboard', express.static(path.join(__dirname, './public/scoreboard')));
// app.post('/update-json', (req, res) => {
//     jsonData = req.body;
//     const filePath = path.join(__dirname, 'matchData.json');

//     fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
//         if (err) {
//             console.error('Error writing to file', err);
//             return res.sendStatus(500);
//         }
//         res.sendStatus(200);
//     });
// });

// // Endpoint to get the full JSON data
// app.get('/getFullJson', (req, res) => {
//     console.log('GET /getFullJson');
//     res.json(jsonData);
// });

// app.get('/getHeroFiles', (req, res) => {
//   const heroesDir = path.join(__dirname, './public/Scoreboard/Heroes');
//   fs.readdir(heroesDir, (err, files) => {
//       if (err) {
//           return res.status(500).json({ error: 'Failed to read directory' });
//       }
//       const heroFiles = files.filter(file => file.endsWith('.hero'));
//       res.json(heroFiles);
//   });
// });

// // Endpoint to get a specific value from the JSON data
// app.get('/getValue', (req, res) => {
//     const { path } = req.query;
//     let result = jsonData;

//     if (path) {
//         const keyPath = path.split('.');
//         for (const key of keyPath) {
//             if (result && result[key] !== undefined) {
//                 result = result[key];
//             } else {
//                 result = null;
//                 break;
//             }
//         }
//     }

//     if (typeof result === 'string') {
//         res.send(result); // Send plain text response for strings
//     } else {
//         res.json(result); // Send JSON response for other types
//     }
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });







