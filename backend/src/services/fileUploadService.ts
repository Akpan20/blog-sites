import AWS from 'aws-sdk';
import multer from 'multer';
import sharp from 'sharp';
import express, { Request, Response } from 'express';

const app = express();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory as buffers
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
});

// Define file and S3 upload interfaces
interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

interface S3UploadParams {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ContentType: string;
}

interface S3UploadResult {
  Location: string;
}

// Function to upload a file to S3
export const uploadToS3 = async (file: UploadFile, type: 'post' | 'avatar' = 'post'): Promise<string> => {
  let buffer: Buffer = await sharp(file.buffer)
    .resize({
      width: type === 'avatar' ? 200 : 1200,
      height: type === 'avatar' ? 200 : 800,
      fit: 'inside',
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  const params: S3UploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${type}/${Date.now()}-${file.originalname}`,
    Body: buffer,
    ContentType: file.mimetype,
  };

  const result: S3UploadResult = await s3.upload(params).promise();
  return result.Location;
};

// Route to handle file uploads
app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return; // Ensure the function exits after sending the response
    }

    const file: UploadFile = {
      buffer: req.file.buffer,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
    };

    // Upload the file to S3
    const fileUrl = await uploadToS3(file, req.body.type || 'post');
    res.status(200).json({ message: 'File uploaded successfully', fileUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
