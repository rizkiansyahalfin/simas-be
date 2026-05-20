import type { Prisma } from "../../generated/client"
import type {
  CreateInventoryLoanData,
  UpdateInventoryLoanData,
  ReturnLoanData,
  LoanQueryParams,
  PaginatedInventoryLoans
} from "./inventory-loan.type"
import { InventoryLoanRepository } from "./inventory-loan.repository"
import prisma from "../../database"

export const InventoryLoanService = {
  async getAll(query: LoanQueryParams): Promise<PaginatedInventoryLoans> {
    const skip = Math.max((query.page - 1) * query.limit, 0)

    return InventoryLoanRepository.findAll({
      status: query.status,
      borrowerName: query.borrowerName,
      skip,
      limit: query.limit
    })
  },

  async getById(id: number) {
    const loan = await InventoryLoanRepository.findById(id)

    if (!loan) {
      throw new Error("LOAN_NOT_FOUND")
    }

    return loan
  },

  async create(data: CreateInventoryLoanData & { createdBy: number }) {
    // Validate inventory exists
    const inventory = await prisma.inventory.findUnique({
      where: { id: data.inventoryId }
    })

    if (!inventory) {
      throw new Error("INVENTORY_NOT_FOUND")
    }

    // Validate dates
    if (data.loanDate >= data.expectedReturnDate) {
      throw new Error("INVALID_LOAN_DATES")
    }

    return InventoryLoanRepository.create(data)
  },

  async update(id: number, data: UpdateInventoryLoanData) {
    const loan = await InventoryLoanRepository.findById(id)

    if (!loan) {
      throw new Error("LOAN_NOT_FOUND")
    }

    // Check if loan is already returned
    if (loan.status === "returned") {
      throw new Error("CANNOT_UPDATE_RETURNED_LOAN")
    }

    // Validate dates if provided
    if (data.loanDate && data.expectedReturnDate) {
      if (data.loanDate >= data.expectedReturnDate) {
        throw new Error("INVALID_LOAN_DATES")
      }
    }

    return InventoryLoanRepository.update(id, data)
  },

  async returnLoan(id: number, data: ReturnLoanData) {
    const loan = await InventoryLoanRepository.findById(id)

    if (!loan) {
      throw new Error("LOAN_NOT_FOUND")
    }

    if (loan.status === "returned") {
      throw new Error("LOAN_ALREADY_RETURNED")
    }

    const returnDate = data.actualReturnDate || new Date()

    // Update loan status
    const updatedLoan = await InventoryLoanRepository.returnLoan(id, {
      status: "returned",
      actualReturnDate: returnDate,
      notes: data.notes || undefined
    })

    // Update inventory condition if provided
    if (data.condition) {
      await prisma.inventory.update({
        where: { id: loan.inventoryId },
        data: { condition: data.condition }
      })
    }

    return updatedLoan
  },

  async delete(id: number) {
    const loan = await InventoryLoanRepository.findById(id)

    if (!loan) {
      throw new Error("LOAN_NOT_FOUND")
    }

    if (loan.status === "returned") {
      throw new Error("CANNOT_DELETE_RETURNED_LOAN")
    }

    return InventoryLoanRepository.delete(id)
  }
}