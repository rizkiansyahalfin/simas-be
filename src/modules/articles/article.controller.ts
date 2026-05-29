import { Request, Response, NextFunction } from "express"
import { ArticleService } from "./article.service"
import { createArticleSchema, updateArticleSchema } from "./article.validation"

const parseArticleId = (value: unknown): number => {
  const id = Number(value)
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("INVALID_ARTICLE_ID")
  }
  return id
}

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : undefined

    const data =
      await ArticleService.findAll(
        category
      )

    res.json({
      status: "success",
      data
    })

  } catch (err) {
    next(err)
  }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createArticleSchema.parse(req.body)
    const userId = req.user!.id

    const result = await ArticleService.create(payload, userId)

    res.status(201).json({ status: "success", data: result })
  } catch (err) {
    next(err)
  }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseArticleId(req.params.id)
    const user = req.user!
    const payload = updateArticleSchema.parse(req.body)

    const result = await ArticleService.update(id, payload, user)

    res.json({ status: "success", data: result })
  } catch (err) {
    next(err)
  }
}

export const deleteArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseArticleId(req.params.id)
    const user = req.user!

    const result = await ArticleService.delete(id, user)

    res.json({ status: "success", data: result })
  } catch (err) {
    next(err)
  }
}

export const publish = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseArticleId(req.params.id)
    const user = req.user!

    const result = await ArticleService.publish(id, user)

    res.json({ status: "success", data: result })
  } catch (err) {
    next(err)
  }
}
