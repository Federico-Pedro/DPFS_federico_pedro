const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images/db_images'));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const uniqueName = 'img-' + Date.now() + extension;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;