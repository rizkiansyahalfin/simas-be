import { ArticleRepository } from "./article.repository";
export const ArticleService = {
    async findAll() {
        return ArticleRepository.findAll();
    },
    async create(data, userId) {
        return ArticleRepository.create({
            ...data,
            author: { connect: { id: userId } }
        });
    },
    async update(id, data, user) {
        const article = await ArticleRepository.findById(id);
        if (!article)
            throw new Error("NOT_FOUND");
        if (article.authorId !== user.id && user.role !== "superadmin") {
            throw new Error("FORBIDDEN");
        }
        return ArticleRepository.update(id, data);
    },
    async publish(id, user) {
        const article = await ArticleRepository.findById(id);
        if (!article)
            throw new Error("NOT_FOUND");
        if (user.role !== "superadmin")
            throw new Error("FORBIDDEN");
        return ArticleRepository.update(id, {
            isPublished: true,
            publishedAt: new Date()
        });
    },
    async delete(id, user) {
        const article = await ArticleRepository.findById(id);
        if (!article)
            throw new Error("NOT_FOUND");
        if (user.role !== "superadmin")
            throw new Error("FORBIDDEN");
        return ArticleRepository.delete(id);
    }
};
