import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'text/csv') {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'));
  }
};

export const upload = multer({ storage, fileFilter });