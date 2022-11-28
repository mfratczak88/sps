import { Injectable } from '@nestjs/common';
import { UserStore } from '../../../infrastructure/security/user/user.store';
import { User } from '../../../infrastructure/security/user/user';
import { Id } from '../../../domain/id';

import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserStore implements UserStore {
  constructor(private readonly prismaService: PrismaService) {}

  findByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    }) as Promise<User>;
  }

  findById(id: Id): Promise<User> {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
    }) as Promise<User>;
  }

  async save(user: User): Promise<void> {
    try {
      const { id, ...userData } = user;
      await this.prismaService.user.upsert({
        where: {
          id: id,
        },
        update: {
          ...userData,
        },
        create: {
          ...user,
        },
      });
    } catch (err) {
      this.prismaService.handlePrismaError(err);
    }
  }

  findAll(): Promise<User[]> {
    return this.prismaService.user.findMany() as Promise<User[]>;
  }
}
