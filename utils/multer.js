import multer from 'multer';
import path from 'path';
// Multer Configuration
export default multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  }
});
