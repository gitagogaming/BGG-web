require('dotenv').config();

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
});



/////////////////////////
// Check Rate Limits
/////////////////////////
const checkRateLimits = async () => {
  try {
    const result = await cloudinary.api.usage();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/////////////////////////
// Uploads an image file
/////////////////////////
// const uploadImage = async (imagePath, cloudFolder) => {
//   const options = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: true,
//     folder: cloudFolder
//   };

//   try {
//     const result = await cloudinary.uploader.upload(imagePath, options);
//     console.log(result);
//     return result.public_id;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };


const uploadImage = async (fileBuffer, cloudFolder) => {
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      folder: cloudFolder
    };
  
    try {
      const result = await cloudinary.uploader.upload_stream(options, (error, result) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log(result);
        return result.public_id;
      }).end(fileBuffer);
      
      return result.public_id;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

/////////////////////////
// Check if folders exist and create them if they don't
/////////////////////////
const createFolders = async (folderNames) => {
  try {
    const { folders } = await cloudinary.api.root_folders();

    for (const folderName of folderNames) {
      const folderExists = folders.some(folder => folder.name === folderName);

      if (folderExists) {
        console.log(`Folder "${folderName}" already exists.`);
      } else {
        const result = await cloudinary.api.create_folder(folderName);
        console.log(`Folder "${folderName}" created:`, result);
      }
    }
    return 'Folders checked and created if necessary.';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/////////////////////////
// Generates a URL for an image file
/////////////////////////
const generateImageUrl = (publicId, transformations) => {
  const url = cloudinary.url(publicId, transformations);
  console.log(`Generated URL for image "${publicId}":`, url);
  return url;
};

/////////////////////////
// Rename an image and update display name
/////////////////////////
const renameImage = async (currentPublicId, newPublicId, newDisplayName) => {
  try {
    const renameResult = await cloudinary.uploader.rename(currentPublicId, newPublicId);
    console.log(`Image "${currentPublicId}" renamed to "${newPublicId}":`, renameResult);

    const updateResult = await cloudinary.api.update(newPublicId, {
      display_name: newDisplayName
    });
    console.log(`Display name for image "${newPublicId}" updated to "${newDisplayName}":`, updateResult);

    return `Image renamed and display name updated to "${newDisplayName}".`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/////////////////////////
// Deletes an image file
/////////////////////////
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    return `Image "${publicId}" deleted successfully.`;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/////////////////////////
// Fetch images from a folder
/////////////////////////
const fetchImages = async (folderName) => {
    try {
      const { resources } = await cloudinary.search
        .expression(`folder:${folderName}`)
        .sort_by('public_id', 'desc')
        .max_results(30)
        .execute();
  
      // Map over the resources to extract only the desired fields
      const filteredResources = resources.map(resource => ({
        public_id: resource.public_id,
        display_name: resource.display_name,
        folder: resource.asset_folder,
        filename: resource.filename,
        format: resource.format,
        url: resource.url,
        width: resource.width,
        height: resource.height,
        resource_type: resource.resource_type
      }));
  
      console.log(filteredResources);
      return filteredResources;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

// fetchImages('BGGTOOL-LOGOS');

// Export the functions for use in server.js
module.exports = {
  checkRateLimits,
  uploadImage,
  createFolders,
  generateImageUrl,
  renameImage,
  deleteImage,
  fetchImages
};














// 

/////////// Example Fetch Imagaes Data ///////////////

// {
//     asset_id: '7ae85ecf80dd6f53b9b7040deda34cbd',
//     public_id: 'new-bgg-bg',
//     asset_folder: 'BGGTOOL-LOGOS',
//     filename: 'new-bgg-bg',
//     display_name: 'New Display Name',
//     format: 'png',
//     version: 1727324644,
//     resource_type: 'image',
//     type: 'upload',
//     created_at: '2024-09-26T04:24:04+00:00',
//     uploaded_at: '2024-09-26T04:24:04+00:00',
//     bytes: 261284,
//     backup_bytes: 261284,
//     width: 1080,
//     height: 1080,
//     aspect_ratio: 1,
//     pixels: 1166400,
//     url: 'http://res.cloudinary.com/ddnp1mpva/image/upload/v1727324644/new-bgg-bg.png',
//     secure_url: 'https://res.cloudinary.com/ddnp1mpva/image/upload/v1727324644/new-bgg-bg.png',
//     status: 'active',
//     access_mode: 'public',
//     access_control: null,
//     etag: 'd667958d60cea5abcd39f3d6ea7d7d67',
//     created_by: {
//       access_key: '194437888465559',
//       custom_id: 'gitagogaming@gmail.com',
//       external_id: '5b80e61f020e683a4ed45324f9e5b5'
//     },
//     uploaded_by: {
//       access_key: '194437888465559',
//       custom_id: 'gitagogaming@gmail.com',
//       external_id: '5b80e61f020e683a4ed45324f9e5b5'
//     },
//     last_updated: {
//       context_updated_at: '2024-09-26T04:36:05+00:00',
//       updated_at: '2024-09-26T04:40:12+00:00',
//       public_id_updated_at: '2024-09-26T04:40:12+00:00'
//     }
//   },












