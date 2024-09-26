// const  env from 'dotenv';
require('dotenv').config();


// Access environment variables
const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

// const CLOUD_NAME = 'ddnp1mpva';
// const API_KEY = '466897286673334'; // Replace with your API key
// const API_SECRET = '41_86GBmz5xY0P_bi-fgg3K8Syc'; // Replace with your API secret

const cloudinary = require('cloudinary').v2;
// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true
  });
  
  // Log the configuration
  console.log(cloudinary.config());
  








  // should probably just wait for actions that use rate limit and then keep that tracked in the state
const checkRateLimits = async () => {
    try {
        const result = await cloudinary.api.usage();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};
// Call the checkRateLimits function
// checkRateLimits();










/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath, cloudFolder) => {
    // Folder would be TEAMLOGOS, HEROLOGOS, etc?  

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: cloudFolder
    };

    try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
    } catch (error) {
    console.error(error);
    }
};
//   uploadImage('public/bgg-bg.png', 'BGGTOOL'); 







/////////////////////////
// Check if folders exist and create them if they don't
/////////////////////////
const createFolders = async (folderNames) => {
    try {
      // List all folders
      const { folders } = await cloudinary.api.root_folders();
  
      // Check if each folder exists
      for (const folderName of folderNames) {
        const folderExists = folders.some(folder => folder.name === folderName);
  
        if (folderExists) {
          console.log(`Folder "${folderName}" already exists.`);
        } else {
          // If the folder does not exist, create it
          const result = await cloudinary.api.create_folder(folderName);
          console.log(`Folder "${folderName}" created:`, result);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
// Call the createFolders function with the folder names
//   createFolders(['BGGTOOL-LOGOS', 'BGGTOOL-IMAGES']);







/////////////////////////
// Generates a URL for an image file
/////////////////////////
  const generateImageUrl = (publicId, transformations) => {
    const url = cloudinary.url(publicId, transformations);
    console.log(`Generated URL for image "${publicId}":`, url);
    return url;
  };
//   generateImageUrl('bgg-bg', { width: 300, height: 300, crop: 'fill' });










/////////////////////////
// Rename an image and update display name
/////////////////////////
const renameImage = async (currentPublicId, newPublicId, newDisplayName) => {
    try {
      // Rename the image
      const renameResult = await cloudinary.uploader.rename(currentPublicId, newPublicId);
      console.log(`Image "${currentPublicId}" renamed to "${newPublicId}":`, renameResult);
  
      // Update the display name
      const updateResult = await cloudinary.api.update(newPublicId, {
        display_name: newDisplayName
      });
      console.log(`Display name for image "${newPublicId}" updated to "${newDisplayName}":`, updateResult);
  
      // Check the updated display name
      console.log(`Updated display name: ${updateResult.display_name}`);
    } catch (error) {
      console.error(error);
    }
  };
  

const newName = 'new-bgg-bg';
//renameImage('ABSS_EARLY_COLLEGE_u1f9kx', newName, newName); 







/////////////////////////
// Deletes an image file
/////////////////////////
 const deleteImage = async (publicId) => {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };
// Call the deleteImage function with the public ID
//   deleteImage('bgg-bg'); 










const fetchImages = async (folderName) => {
    try {
      const { resources } = await cloudinary.search
        .expression(`folder:${folderName}`)
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();
      console.log(resources);
      return resources;
    } catch (error) {
      console.error(error);
    }
  };
  
// Call the fetchImages function with the folder name
//   fetchImages('BGGTOOL'); // Replace with your folder name