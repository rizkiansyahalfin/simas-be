import type {
  Request,
  Response
} from "express"

import { asyncHandler } from "../../utils/async-handler"

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

export const getAll = asyncHandler(async (
  _req: Request,
  res: Response
) => {
    const data =
      await ArticleCategoryService.getAll()

    res.json({
      status: "success",
      data
    })
})

export const create = asyncHandler(async (
  req: Request,
  res: Response
) => {
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
})

export const update = asyncHandler(async (
  req: Request,
  res: Response
) => {
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
})

export const deleteCategory =
  asyncHandler(async (
    req: Request,
    res: Response
  ) => {
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
  })