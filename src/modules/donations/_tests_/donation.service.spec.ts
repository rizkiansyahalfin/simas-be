import { DonationService } from "../donation.service"
import { DonationRepository } from "../donation.repository"
import { NotificationTrigger } from "../../notification/notification.trigger"
import * as CampaignService from "../../campaign/campaign.service"

jest.mock("../donation.repository")
jest.mock("../../notification/notification.trigger")
jest.mock("../../campaign/campaign.service")
jest.mock("../../mosque-profile/mosque-profile.service")

describe("DonationService", () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("submit", () => {

    it("should create donation", async () => {

      ;(DonationRepository.create as jest.Mock)
        .mockResolvedValue({
          id: 1,
          donorName: "Master",
          amount: {
            toNumber: () => 100000
          }
        })

      const result =
        await DonationService.submit({
          donorName: "Master",
          amount: 100000,
          categoryId: 1
        } as any)

      expect(result.id)
        .toBe(1)

      expect(
        NotificationTrigger.donationCreated
      ).toHaveBeenCalled()
    })
  })

  describe("verify", () => {

    it("should verify donation", async () => {

      ;(DonationRepository.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          status: "pending"
        })

      ;(DonationRepository.update as jest.Mock)
        .mockResolvedValue({
          id: 1,
          donorName: "Master"
        })

      const result =
        await DonationService.verify(
          1,
          99
        )

      expect(result.id)
        .toBe(1)
    })

    it("should throw DONATION_NOT_FOUND", async () => {

      ;(DonationRepository.findById as jest.Mock)
        .mockResolvedValue(null)

      await expect(
        DonationService.verify(
          1,
          99
        )
      ).rejects.toThrow(
        "DONATION_NOT_FOUND"
      )
    })

    it("should throw DONATION_INVALID_STATUS", async () => {

      ;(DonationRepository.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          status: "verified"
        })

      await expect(
        DonationService.verify(
          1,
          99
        )
      ).rejects.toThrow(
        "DONATION_INVALID_STATUS"
      )
    })

    it("should trigger campaign reached", async () => {

      ;(DonationRepository.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          status: "pending"
        })

      ;(DonationRepository.update as jest.Mock)
        .mockResolvedValue({
          id: 1,
          donorName: "Master",
          campaignId: 1
        })

      ;(CampaignService.getCampaignProgress as jest.Mock)
        .mockResolvedValue({
          campaignId: 1,
          title: "Masjid",
          collectedAmount: 1000000,
          targetAmount: 1000000
        })

      await DonationService.verify(
        1,
        99
      )

      expect(
        NotificationTrigger.campaignReached
      ).toHaveBeenCalled()
    })
  })

  describe("reject", () => {

    it("should reject donation", async () => {

      ;(DonationRepository.findById as jest.Mock)
        .mockResolvedValue({
          id: 1,
          status: "pending"
        })

      ;(DonationRepository.update as jest.Mock)
        .mockResolvedValue({
          id: 1,
          status: "rejected"
        })

      const result =
        await DonationService.reject(
          1,
          99,
          "invalid"
        )

      expect(result.status)
        .toBe("rejected")
    })
  })

  describe("generateDonationCertificate", () => {

    it("should throw DONATION_NOT_FOUND", async () => {

      ;(DonationRepository.findById as jest.Mock)
        .mockResolvedValue(null)

      await expect(
        DonationService.generateDonationCertificate(
          1
        )
      ).rejects.toThrow(
        "DONATION_NOT_FOUND"
      )
    })

  })
})