import prisma from "../../database";
export const ArticleRepository = {
    findAll() {
        return prisma.article.findMany({
            where: { isPublished: true },
            include: { author: true },
            orderBy: { createdAt: "desc" }
        });
    },
    findById(id) {
        return prisma.article.findUnique({
            where: { id }
        });
    },
    create(data) {
        return prisma.article.create({ data });
    },
    update(id, data) {
        return prisma.article.update({
            where: { id },
            data
        });
    },
    delete(id) {
        return prisma.article.delete({
            where: { id }
        });
    }
};
