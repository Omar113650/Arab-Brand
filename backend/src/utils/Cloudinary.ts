// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";
// import dotenv from "dotenv";
// import multer from "multer";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export const cloudinaryUploadImage = async (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "auto" },
//       (error, result) => {
//         if (result) resolve(result);
//         else reject(error);
//       }
//     );
//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

// export const cloudinaryRemoveImage = async (ImagePublic) => {
//   try {
//     const data = await cloudinary.uploader.destroy(ImagePublic);
//     return data;
//   } catch (error) {
//     return error;
//   }
// };

// export const cloudinaryRemoveMultipleImage = async (PublicIds) => {
//   try {
//     const result = await cloudinary.api.delete_resources(PublicIds);
//     return result;
//   } catch (error) {
//     return error;
//   }
// };
// multer;











import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const cloudinaryUploadImage = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const cloudinaryRemoveImage = async (publicId: string) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

export const cloudinaryRemoveMultipleImage = async (publicIds: string[]) => {
  try {
    return await cloudinary.api.delete_resources(publicIds);
  } catch (error) {
    throw error;
  }
};