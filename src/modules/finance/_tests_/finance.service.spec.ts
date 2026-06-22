import * as FinanceService from "../finance.service"
import * as repo from "../finance.repository"
import * as domain from "../finance.domain"

jest.mock("../finance.repository")
jest.mock("../finance.domain")

describe("FinanceService", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getSummary", () => {

    it("should return summary", async () => {

      ;(repo.findSummaryData as jest.Mock)
        .mockResolvedValue({
          cashSummary: [],
          zisSummary: []
        })

      ;(domain.calculateSummary as jest.Mock)
        .mockReturnValue({
          income: 1000,
          expense: 500
        })

      const result =
        await FinanceService.getSummary()

      expect(result.totalIncome)
        .toBe(1000)

      expect(result.totalExpense)
        .toBe(500)

      expect(result.lastUpdated)
        .toBeInstanceOf(Date)
    })
  })

  describe("getCashTransactions", () => {

    it("should paginate result", async () => {

      ;(repo.findCashTransactions as jest.Mock)
        .mockResolvedValue([{ id: 1 }])

      ;(repo.countCashTransactions as jest.Mock)
        .mockResolvedValue(15)

      const result =
        await FinanceService.getCashTransactions({
          page: 1,
          limit: 10
        })

      expect(result.total)
        .toBe(15)

      expect(result.totalPages)
        .toBe(2)
    })
  })

  describe("addCashTransaction", () => {

    it("should create cash transaction", async () => {

      ;(repo.createCashTransaction as jest.Mock)
        .mockResolvedValue({
          id: 1
        })

      const result =
        await FinanceService.addCashTransaction(
          {
            type: "income",
            amount: 1000,
            category: "test",
            transactionDate: new Date()
          } as any,
          99
        )

      expect(repo.createCashTransaction)
        .toHaveBeenCalled()

      expect(result.id)
        .toBe(1)
    })
  })

  describe("updateCashTransaction", () => {

    it("should update current month transaction", async () => {

      ;(repo.findCashTransactionById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          transactionDate: new Date()
        })

      ;(repo.updateCashTransaction as jest.Mock)
        .mockResolvedValue({
          id: 1
        })

      const result =
        await FinanceService.updateCashTransaction(
          1,
          {}
        )

      expect(result.id)
        .toBe(1)
    })

    it("should throw CASH_TRANSACTION_NOT_FOUND", async () => {

      ;(repo.findCashTransactionById as jest.Mock)
        .mockResolvedValue(null)

      await expect(
        FinanceService.updateCashTransaction(
          1,
          {}
        )
      ).rejects.toThrow(
        "CASH_TRANSACTION_NOT_FOUND"
      )
    })

    it("should reject old period transaction", async () => {

      ;(repo.findCashTransactionById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          transactionDate:
            new Date("2020-01-01")
        })

      await expect(
        FinanceService.updateCashTransaction(
          1,
          {}
        )
      ).rejects.toThrow(
        "ONLY_CURRENT_PERIOD_CAN_BE_EDITED"
      )
    })
  })

  describe("removeCashTransaction", () => {

    it("should delete transaction", async () => {

      ;(repo.softDeleteCashTransaction as jest.Mock)
        .mockResolvedValue(true)

      await FinanceService.removeCashTransaction(
        1
      )

      expect(
        repo.softDeleteCashTransaction
      ).toHaveBeenCalledWith(1)
    })
  })

  describe("addZisTransaction", () => {

    it("should create zis transaction", async () => {

      ;(repo.createZisTransaction as jest.Mock)
        .mockResolvedValue({
          id: 1
        })

      const result =
        await FinanceService.addZisTransaction(
          {
            amount: 1000
          } as any,
          99
        )

      expect(result.id)
        .toBe(1)
    })
  })
})