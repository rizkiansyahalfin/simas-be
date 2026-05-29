import type {
  Request,
  Response,
  NextFunction
} from "express"

import {
  ArticleCategoryService
} from "./article-category.service"

import {
  createArticleCategorySchema,
  updateArticleCategorySchema
} from "./article-category.validation"

const parseId = (
  value: unknown
): number => {

  const id = Number(value)

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error("INVALID_CATEGORY_ID")
  }

  return id
}

export const getAll = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const data =
      await ArticleCategoryService.getAll()

    res.json({
      status: "success",
      data
    })

  } catch (err) {
    next(err)
  }
}

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const payload =
      createArticleCategorySchema.parse(
        req.body
      )

    const result =
      await ArticleCategoryService.create(
        payload
      )

    res.status(201).json({
      status: "success",
      data: result
    })

  } catch (err) {
    next(err)
  }
}

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const id =
      parseId(req.params.id)

    const payload =
      updateArticleCategorySchema.parse(
        req.body
      )

    const result =
      await ArticleCategoryService.update(
        id,
        payload
      )

    res.json({
      status: "success",
      data: result
    })

  } catch (err) {
    next(err)
  }
}

export const deleteCategory =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const id =
        parseId(req.params.id)

      await ArticleCategoryService.delete(
        id
      )

      res.json({
        status: "success",
        message:
          "Category deleted successfully"
      })

    } catch (err) {
      next(err)
    }
  }