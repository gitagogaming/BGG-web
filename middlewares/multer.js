const multer = require('multer');

// Multer setup for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory as Buffer objects
// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
//   fileFilter: (req, file, cb) => {
//     // Accept only certain file types
//     const allowedMimeTypes = [
//       'image/jpeg',
//       'image/png',
//       'image/gif',
//       'video/mp4',
//       'video/mpeg',
//       // 'application/xml',
//       // 'text/xml',
//       // 'application/xaml+xml',
//       'application/x-bgg+zip' // Custom MIME type for .BGG files
//     ];

//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(null, false); // Reject the file without throwing an error
//     }
//   }
// });

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  }
});


module.exports = upload;