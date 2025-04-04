import { getConfigValue } from './AppConfigService';

export const uploadToWasabi = async (s3,file, filePath) => {
  // const s3 = useWasabiS3();
  
  const params = {
    Bucket: getConfigValue('WASABI_MEDIA_FILES_BUCKET_NAME'), // Specify your Wasabi bucket
    Key: filePath, // The file path in your Wasabi bucket
    Body: file, // The actual file
    // ACL: 'public-read', // This ensures the file is publicly accessible
    ContentType: file.type, // MIME type of the file (e.g., 'audio/mp3')
  };

  try {
    // Upload the file to Wasabi
    const data = await s3.upload(params).promise();

    console.log('File uploaded successfully to Wasabi:', data.Location);
    return data.Location; // Return the public URL of the uploaded file
  } catch (error) {
    console.error('Error uploading file to Wasabi:', error);
    throw new Error('Wasabi upload failed');
  }
};

export const deleteFromWasabi = async (s3, filePath) => {
  // const s3 = useWasabiS3();
  const params = {
    Bucket: getConfigValue('WASABI_MEDIA_FILES_BUCKET_NAME'),
    Key: filePath,
  };

  try {
    // Delete the file from Wasabi
    await s3.deleteObject(params).promise();

    console.log('File deleted successfully from Wasabi:', filePath);
  } catch (error) {
    console.error('Error deleting file from Wasabi:', error);
    throw new Error('Wasabi delete failed');
  }
};

export const getWasabiFileUrl = (filePath) => {
  return `https://test-gl.s3.eu-central-1.wasabisys.com/${filePath}`;
};

// get signedurl for a given file path
export const getWasabiSignedUrl = async (filePath) => {
  console.info('Generating signed URL for file:', filePath);
  const params = {
    Bucket: getConfigValue('WASABI_MEDIA_FILES_BUCKET_NAME'),
    Key: filePath,
    Expires: 3600, // The link will expire in 1 hour
  };

  try {
    // Get the signed URL
    const url = await s3.getSignedUrlPromise('getObject', params);

    // console.debug('Signed URL generated successfully:', url);
    return url; // Return the signed URL
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Signed URL generation failed');
  }
};

export const fetchSignedUrlFromSupabaseEdgeFunction = async (fileKey) => {
  const response = await fetch('https://mldtimypnbudwihsnesc.supabase.co/functions/v1/get-signed-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' ,
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZHRpbXlwbmJ1ZHdpaHNuZXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5ODM4MjksImV4cCI6MjAzNTU1OTgyOX0.-tPDSDkDrzEyeeMwCDIjg5-y8JYPf6xSEM99dl13TN0',
    },
    body: JSON.stringify({ fileKey }),
  });

  const { signedUrl } = await response.json();
  // console.log('Signed URL:', signedUrl);
  return signedUrl;
};