import { PrismaClient } from './prisma/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import dotenv from 'dotenv';
dotenv.config();
// Inisialisasi Prisma dengan ekstensi Accelerate sesuai dokumentasi
const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());
export default prisma;
