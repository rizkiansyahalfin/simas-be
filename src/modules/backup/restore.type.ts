export type RestoreMetadata = {
  filePath: string
  originalName: string
  createdAt: string
}

export type ValidateRestoreResponse = {
  restoreToken: string
  fileName: string
  expiresIn: number
}

export type ConfirmRestoreRequest = {
  restoreToken: string
  confirmation: "RESTORE_DATABASE"
}