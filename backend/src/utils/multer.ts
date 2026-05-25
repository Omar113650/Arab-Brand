// import multer from "multer";
// import path from "path";

// const storage = multer.memoryStorage();

// function fileFilter(req:Request, file, cb) {
//   const allowedTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = allowedTypes.test(file.mimetype);
//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"));
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// export default upload;













import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.memoryStorage();

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  const allowedTypes = /jpeg|jpg|png|gif/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;