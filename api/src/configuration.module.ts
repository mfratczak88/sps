import { Global, Injectable, Module } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

@Injectable()
export class Environment {
  @IsString()
  readonly BCRYPT_SALT: string;

  @IsString()
  readonly CSRF_TOKEN_EXPIRY: string;

  @IsString()
  readonly CSRF_TOKEN_SECRET: string;

  @IsString()
  readonly ACCOUNT_EMAIL: string;

  @IsNotEmpty()
  @IsString()
  readonly DB_HOST: string;

  @IsNotEmpty()
  @IsString()
  readonly DB_NAME: string;

  @IsNotEmpty()
  @IsString()
  readonly DB_PASS: string;

  @IsNotEmpty()
  @IsString()
  readonly DB_URL: string;

  @IsNotEmpty()
  @IsString()
  readonly DB_USER: string;

  @IsNotEmpty()
  @IsString()
  readonly GOOGLE_AUTH_ID: string;

  @IsNotEmpty()
  @IsString()
  readonly GOOGLE_AUTH_SECRET: string;

  @IsNumber()
  readonly JWT_EXPIRY: number;

  @IsNumber()
  readonly JWT_REFRESH_EXPIRY: number;

  @IsString()
  @IsNotEmpty()
  readonly JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  readonly JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  readonly MAILGUN_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  readonly MAILGUN_EMAIL_DOMAIN: string;

  @IsString()
  @IsNotEmpty()
  readonly MAILGUN_USER: string;

  @IsString()
  readonly PUBLIC_DOMAIN: string;

  @IsNumber()
  readonly ACTIVATE_ACCOUNT_LINK_EXPIRATION_IN_HOURS: number;
}

const envProvider = {
  provide: Environment,
  useFactory: async () => {
    const config = {
      ...process.env,
    };
    const validatedConfig = plainToClass(Environment, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  },
};

@Global()
@Module({
  providers: [envProvider],
  exports: [envProvider],
})
export class ConfigurationModule {}
