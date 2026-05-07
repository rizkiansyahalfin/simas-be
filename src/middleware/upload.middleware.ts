import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads/donations")
  },

  filename: (_, file, cb) => {
    const unique = Date.now() + path.extname(file.originalname)

    cb(null, unique)
  }
})

export const uploadDonationProof = multer({
  storage
})