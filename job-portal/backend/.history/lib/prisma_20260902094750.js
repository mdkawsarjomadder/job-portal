import PrismaPkg from '@prisma/client';

const { PrismaClient } = PrismaPkg;
const prisma = new PrismaClient();

export default prisma;