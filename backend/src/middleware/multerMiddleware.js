const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary"); // Asegúrate que esté correcto este path

// Configura el almacenamiento con Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "MediTrack", // Puedes cambiarlo si quieres
    allowed_formats: ["jpg", "png"],
  },
});

// Limita tamaño y tipo de archivo
const upload = multer({
  storage,
  limits: {
    fileSize: 4* 1024 * 1024, // 4 MB
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

// Middleware personalizado para manejar errores de multer
const uploadPhoto = (req, res, next) => {
  const singleUpload = upload.single("photo");

  singleUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "La imagen supera el tamaño máximo de 2MB." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = { uploadPhoto };
