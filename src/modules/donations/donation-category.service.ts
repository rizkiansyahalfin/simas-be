import { DonationCategoryRepository }
from "./donation-category.repository"

import type {
  CreateDonationCategoryInput
} from "./donation-category.type"

export const DonationCategoryService = {

  async getAll() {
    return DonationCategoryRepository.findAll()
  },

  async create(
    data: CreateDonationCategoryInput
  ) {

    return DonationCategoryRepository.create(
      data
    )
  }
}