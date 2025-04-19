// utils/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "meditrack", // puedes personalizar el nombre de la carpeta
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});


// ✅ Limitar tamaño a 2MB (en bytes)
const upload = multer({
    storage,
    limits: {
      fileSize: 4 * 1024 * 1024, // 2 MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimeTypes = ["image/jpeg", "image/png"];
      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Tipo de archivo no permitido. Solo JPG y PNG."));
      }
    },
  });


//const upload = multer({ storage });


module.exports = upload;
