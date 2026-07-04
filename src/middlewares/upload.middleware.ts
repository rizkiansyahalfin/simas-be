import fs from "fs"
import multer from "multer"
import path from "path"

function ensureDirectoryExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const storage = multer.diskStorage({

  destination: (_, __, cb) => {
    const destinationPath = path.join(__dirname, '..', 'uploads')
    ensureDirectoryExists(destinationPath)
    cb(null, destinationPath)
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
        const destinationPath = path.join(
          __dirname,
          '..',
          'uploads',
          'profiles'
        )
        ensureDirectoryExists(destinationPath)

        cb(
          null,
          destinationPath
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
    const destinationPath = path.join(__dirname, '..', 'uploads', 'donations')
    ensureDirectoryExists(destinationPath)
    cb(null, destinationPath)
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

  const EventPosterStorage =
  multer.diskStorage({

    destination: (_, __, cb) => {
      const destinationPath = path.join(
        __dirname,
        "..",
        "uploads",
        "events"
      )
      ensureDirectoryExists(destinationPath)
      cb(null, destinationPath)
    },

    filename: (_, file, cb) => {

      const unique =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9)

      cb(
        null,
        unique +
        path.extname(file.originalname)
      )
    }
  })

  const InventoryStorage =
  multer.diskStorage({
    destination: (_, __, cb) => {
      const destinationPath = path.join(
        __dirname,
        "..",
        "uploads",
        "inventories"
      )
      ensureDirectoryExists(destinationPath)
      cb(null, destinationPath)
    },

    filename: (_, file, cb) => {
      const unique =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9)

      cb(
        null,
        unique +
        path.extname(file.originalname)
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

const RestoreStorage =
  multer.diskStorage({

    destination:
      (_, __, cb) => {
        const destinationPath = path.join(
          process.cwd(),
          "storage",
          "restore-temp"
        )
        ensureDirectoryExists(destinationPath)
        cb(null, destinationPath)
      },

    filename:
      (_, file, cb) => {

        const unique =
          Date.now() +
          "-" +
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

const restoreFileFilter:
  multer.Options["fileFilter"] =
(
  _req,
  file,
  cb
) => {

  if (
    !file.originalname
      .toLowerCase()
      .endsWith(
        ".sql.gz"
      )
  ) {

    return cb(
      new Error(
        "INVALID_BACKUP_FORMAT"
      )
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

  export const uploadCongregationImport =
  multer({
    storage
  })

  export const uploadEventPoster =
  multer({
    storage: EventPosterStorage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  })

  export const uploadInventoryPhoto =
  multer({
    storage: InventoryStorage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  })

  export const uploadRestoreBackup =
  multer({

    storage:
      RestoreStorage,

    fileFilter:
      restoreFileFilter,

    limits: {
      fileSize:
        100 *
        1024 *
        1024
    }
  })