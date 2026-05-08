import { DonationService } from './donation.service';
import { createDonationSchema, rejectDonationSchema, donationQuerySchema } from './donation.validation';
export const getDonations = async (req, res, next) => {
    try {
        const validated = donationQuerySchema.parse({
            status: req.query.status,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        });
        const result = await DonationService.getAll(validated);
        res.json({
            status: 'success',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
export const submitDonation = async (req, res, next) => {
    try {
        const validated = createDonationSchema.parse({
            ...req.body,
            amount: Number(req.body.amount),
        });
        const result = await DonationService.submit(validated, req.file);
        res.status(201).json({
            status: 'success',
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
};
export const verifyDonation = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await DonationService.verify(id, userId);
        res.json({
            status: 'success',
            message: 'Donation verified',
        });
    }
    catch (err) {
        next(err);
    }
};
export const rejectDonation = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const validated = rejectDonationSchema.parse(req.body);
        await DonationService.reject(id, userId, validated.note);
        res.json({
            status: 'success',
            message: 'Donation rejected',
        });
    }
    catch (err) {
        next(err);
    }
};
