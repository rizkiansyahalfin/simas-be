import multer from "multer"
import path from "path"

const storage = multer.diskStorage({

  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },

  filename: (_, file, cb) => {

    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9)

    cb(
      null,
      unique + path.extname(file.originalname)
    )
  }
})

const ProfileStorage =
  multer.diskStorage({

    destination:
      (_, __, cb) => {

        cb(
          null,
          path.join(
            __dirname,
            '..',
            'uploads',
            'profiles'
          )
        )
      },

    filename:
      (_, file, cb) => {

        const unique =
          Date.now() +
          '-' +
          Math.round(
            Math.random() * 1e9
          )

        cb(
          null,
          unique +
          path.extname(
            file.originalname
          )
        )
      }
  })

const DonationProofStorage = multer.diskStorage({

  destination: (_, __, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'donations'))
  },

  filename: (_, file, cb) => {
    const unique =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9)

    cb(
      null,
      unique + path.extname(file.originalname)
    )
  }
})

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
]

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {

  if (!allowedMimeTypes.includes(file.mimetype)) {

    return cb(
      new Error("INVALID_FILE_TYPE")
    )
  }

  cb(null, true)
}

export const uploadImage = multer({

  storage,

  fileFilter,

  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }

})

export const uploadDonationProof = multer({
  storage: DonationProofStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

export const uploadProfileImage =
  multer({
    storage: ProfileStorage,
    fileFilter,
    limits: {
      fileSize:
        2 * 1024 * 1024
    }
  })