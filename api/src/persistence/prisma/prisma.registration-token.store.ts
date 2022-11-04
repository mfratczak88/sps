import { Injectable } from '@nestjs/common';
import { RegistrationTokenStore } from '../../infrastructure/security/user/user.store';
import { PrismaService } from './prisma.service';
import { Id } from '../../domain/id';
import { RegistrationToken } from '../../infrastructure/security/user/user';

@Injectable()
export class PrismaRegistrationTokenStore implements RegistrationTokenStore {
  constructor(private readonly prismaService: PrismaService) {}

  async findByActivationGuid(guid: Id): Promise<RegistrationToken> {
    const result = await this.prismaService.registrationToken.findFirst({
      where: {
        activationGuid: guid,
      },
    });
    return result as RegistrationToken;
  }

  async findById(id: Id): Promise<RegistrationToken> {
    return (await this.prismaService.registrationToken.findFirst({
      where: {
        id,
      },
    })) as RegistrationToken;
  }

  async save(registrationToken: RegistrationToken): Promise<void> {
    try {
      const { id, ...token } = registrationToken;
      await this.prismaService.registrationToken.upsert({
        where: {
          id,
        },
        update: {
          ...token,
        },
        create: {
          ...registrationToken,
        },
      });
    } catch (err) {
      this.prismaService.handlePrismaError(err);
    }
  }
}
