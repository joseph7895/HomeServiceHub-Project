import { v2 as cloudinary } from 'cloudinary';

// Check if credentials are present
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a file buffer to Cloudinary or falls back to a base64 data URI
 * @param {Object} file - The file object from Multer (file.buffer, file.mimetype)
 * @returns {Promise<string>} - The URL of the uploaded image
 */
const uploadImage = async (file) => {
  if (!file) return '';

  // Fallback: If Cloudinary is not configured, generate a base64 data URI
  if (!isCloudinaryConfigured()) {
    console.warn('Cloudinary not configured. Falling back to Base64 image storage.');
    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    return base64Image;
  }

  // Upload to Cloudinary using streams
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'local_service_marketplace',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

export { uploadImage };
