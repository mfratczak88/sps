import { PrismaClient } from '@prisma/client';
import { User } from 'src/infrastructure/security/user/user';
import { Role } from 'src/infrastructure/security/authorization/role';
export const clear = async (prisma: PrismaClient) => {
  await prisma.registrationToken.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.parkingLot.deleteMany();
};

export const insertUser = async (prisma: PrismaClient, user: User) => {
  await prisma.user.create({
    data: {
      ...user,
    },
  });
  return user;
};

export const changeUserRole = async (
  prisma: PrismaClient,
  userId: string,
  role: Role,
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
};
