import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RRule } from 'rrule';
import { v4 as uuid } from 'uuid';
import { Role } from '../src/infrastructure/security/authorization/role';
import { RegistrationMethod } from '../src/infrastructure/security/user/user';
/* Prisma Client */
const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});
const clearDb = async () => {
  await prisma.parkingTicket.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.parkingLot.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.user.deleteMany({});
};
const drivers = [];
const createUsers = async () => {
  await prisma.user.create({
    data: {
      id: uuid(),
      name: 'Krzysztof',
      email: 'krzysztof@gmail.com',
      role: Role.ADMIN,
      active: true,
      registrationMethod: RegistrationMethod.manual,
      password: bcrypt.hashSync('adminPass', process.env.BCRYPT_SALT),
    },
  });
  await prisma.user.create({
    data: {
      id: uuid(),
      name: 'Andrzej',
      email: 'andrzej@gmail.com',
      role: Role.CLERK,
      active: true,
      registrationMethod: RegistrationMethod.manual,
      password: bcrypt.hashSync('clerkPass', process.env.BCRYPT_SALT),
    },
  });
  const driver = await prisma.user.create({
    data: {
      id: uuid(),
      name: 'Adam',
      email: 'adam@gmail.com',
      role: Role.DRIVER,
      active: true,
      registrationMethod: RegistrationMethod.manual,
      password: bcrypt.hashSync('driverPass', process.env.BCRYPT_SALT),
    },
  });
  drivers.push(driver);
  await prisma.vehicle.create({
    data: {
      userId: driver.id,
      licensePlate: 'WI747HG',
    },
  });
};
const createParkingLots = async () => {
  await prisma.parkingLot.create({
    data: {
      id: uuid(),
      capacity: 10,
      streetNumber: '1',
      streetName: 'Sobieskiego',
      city: 'Warszawa',
      operationTimeRule: new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2022, 11, 11, 10)),
        interval: 1,
        byweekday: [0, 1, 2, 3, 4, 5, 6],
        byhour: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      }).toString(),
      users: {
        connect: {
          id: drivers[0].id,
        },
      },
    },
  });

  await prisma.parkingLot.create({
    data: {
      id: uuid(),
      capacity: 20,
      streetNumber: '12',
      streetName: 'Plac Politechniki',
      city: 'Warszawa',
      operationTimeRule: new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2022, 11, 11, 10)),
        interval: 1,
        byweekday: [0, 1, 2, 3, 4, 5, 6],
        byhour: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      }).toString(),
      users: {
        connect: {
          id: drivers[0].id,
        },
      },
    },
  });
  await prisma.parkingLot.create({
    data: {
      id: uuid(),
      capacity: 150,
      streetNumber: '8',
      streetName: 'Gajowa',
      city: 'Warszawa',
      operationTimeRule: new RRule({
        freq: RRule.HOURLY,
        dtstart: new Date(Date.UTC(2022, 11, 11, 10)),
        interval: 1,
        byweekday: [0, 1, 2, 3, 4, 5, 6],
        byhour: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      }).toString(),
      users: {
        connect: {
          id: drivers[0].id,
        },
      },
    },
  });
};
const main = async () => {
  await clearDb();
  await createUsers();
  await createParkingLots();
  process.exit(0);
};

main().catch(console.error);
