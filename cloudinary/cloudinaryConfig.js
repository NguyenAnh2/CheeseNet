import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: 'diqiey8rm',
  api_key: '395985428849522',
  api_secret: '9g1ATzVHKL-WueuMq2rV9Sqt60c',
});

export default cloudinary;