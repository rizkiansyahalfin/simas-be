import type { Gallery } from "../../generated/client"

export type GalleryResponse = Gallery & {
  uploader: {
    id: number
    username: string
  }
}

export type CreateGalleryBody = {
  titles?: Array<string | undefined>
  captions?: Array<string | undefined>
}

export type CreateGalleryPayload = {
  title?: string | null
  caption?: string | null
  imageUrl: string
  uploadedBy: number
}
