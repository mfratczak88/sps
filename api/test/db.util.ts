import { PrismaClient } from '@prisma/client';
export const clear = async (prisma: PrismaClient) => {
  await prisma.registrationToken.deleteMany();
  await prisma.user.deleteMany();
};
