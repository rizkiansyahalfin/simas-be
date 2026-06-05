import prisma from "../../database"

export const InventoryCategoryRepository = {
  findAll() {
    return prisma.inventoryCategory.findMany({
      orderBy: { name: "asc" }
    })
  },

  findById(id: number) {
    return prisma.inventoryCategory.findUnique({
      where: { id }
    })
  },

  create(data: { name: string }) {
    return prisma.inventoryCategory.create({ data })
  },

  update(id: number, data: { name?: string }) {
    return prisma.inventoryCategory.update({
      where: { id },
      data
    })
  },

  delete(id: number) {
    return prisma.inventoryCategory.delete({
      where: { id }
    })
  }
}
