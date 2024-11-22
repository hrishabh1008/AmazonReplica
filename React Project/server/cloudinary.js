const cloudinary = require('cloudinary').v2; // Import cloudinary using CommonJS syntax

cloudinary.config({ 
  cloud_name: 'derwkntcf', 
  api_key: '275476184715554', 
  api_secret: 'w_PWugkOwIoUPatKdP0FJ7HGblw' 
});

const uploadOnCloud = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer || fileBuffer.length === 0) {
      console.log("File buffer not found");
      reject("File buffer not found");
      return;
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);  // Reject with the error
          return;
        }

        resolve(result);  // Resolve with the result
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = uploadOnCloud; // Export the uploadOnCloud function
