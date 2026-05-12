import { DonationRepository } from './donation.repository';
export const DonationService = {
    async getAll({ status, page, limit }) {
        const skip = (page - 1) * limit;
        return DonationRepository.findAll({
            status,
            skip,
            limit,
        });
    },
    async submit(data, file) {
        return DonationRepository.create({
            donorName: data.donorName,
            phone: data.phone,
            amount: data.amount,
            category: data.category,
            proofImageUrl: file?.filename,
            status: 'pending',
        });
    },
    async verify(id, userId) {
        const donation = await DonationRepository.findById(id);
        if (!donation) {
            throw new Error('DONATION_NOT_FOUND');
        }
        if (donation.status !== 'pending') {
            throw new Error('DONATION_INVALID_STATUS');
        }
        return DonationRepository.update(id, {
            status: 'verified',
            verifiedBy: userId,
            verifiedAt: new Date(),
        });
    },
    async reject(id, userId, note) {
        const donation = await DonationRepository.findById(id);
        if (!donation) {
            throw new Error('DONATION_NOT_FOUND');
        }
        if (donation.status !== 'pending') {
            throw new Error('DONATION_INVALID_STATUS');
        }
        return DonationRepository.update(id, {
            status: 'rejected',
            verifiedBy: userId,
            verifiedAt: new Date(),
            rejectionNote: note,
        });
    },
};
