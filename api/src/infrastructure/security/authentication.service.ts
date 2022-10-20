import { Injectable } from '@nestjs/common';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import * as bcrypt from 'bcrypt';
import { Response } from 'express';

import { OAuth2Client } from 'google-auth-library';
import { UserService } from './user.service';
import { Environment } from '../../configuration.module';
import { CookieService } from './cookie.service';
import { TokenService } from './token.service';
import { EmailService } from '../email/email.service';
import { SecurityException } from './security.exception';
import { MessageCode } from '../../message';
import { ExceptionCode } from '../../error';
import { Id } from '../../application/id';
import { RegistrationMethod, RegistrationToken, User } from './user';
import { LanguageService } from '../../application/language.service';
import fetch from 'node-fetch';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly environment: Environment,
    private readonly cookieService: CookieService,
    private readonly authTokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly langService: LanguageService,
    private readonly googleAuthClient: OAuth2Client,
  ) {}

  async login(command: LoginCommand, response: Response): Promise<UserDto> {
    try {
      const user = await this.validateLoginCommand(command);
      await this.generateAuthTokenPairFor(user, response);
      return AuthenticationService.userToDto(
        user,
        this.authTokenService.authTokenExpiry,
      );
    } catch (err) {
      this.cookieService.clearAll(response);
      throw err;
    }
  }

  async loginWithGoogle(
    command: LoginWithGoogleCommand,
    response: Response,
  ): Promise<UserDto> {
    const ticket = await this.googleAuthClient.verifyIdToken({
      idToken: command.idToken,
      audience: this.environment.GOOGLE_AUTH_ID,
    });
    if (!ticket)
      throw new SecurityException(
        MessageCode.GOOGLE_AUTHENTICATION_ERROR,
        ExceptionCode.UNAUTHORIZED,
      );

    let user = await this.userService.findByEmail(command.email);
    if (!user) {
      user = (
        await this.userService.createNew({
          email: ticket.getPayload().email,
          name: ticket.getPayload().name,
          registrationMethod: RegistrationMethod.google,
        })
      ).user;
    }

    await this.generateAuthTokenPairFor(user, response);
    return AuthenticationService.userToDto(
      user,
      this.authTokenService.authTokenExpiry,
    );
  }

  async onRefreshToken(response: Response, userId: Id) {
    try {
      const user = await this.userService.findById(userId);
      await this.generateAuthTokenPairFor(user, response);
      return AuthenticationService.userToDto(
        user,
        this.authTokenService.authTokenExpiry,
      );
    } catch (err) {
      this.cookieService.clearAll(response);
      throw err;
    }
  }

  async getUserData(userId: Id): Promise<UserDto> {
    let user = await this.userService.findById(userId);
    if (!user) user = await this.userService.findByEmail(userId);
    return AuthenticationService.userToDto(user);
  }

  async getUserIfTokenMatches(userId: Id, refreshToken: string) {
    let user = await this.userService.findById(userId);
    if (!user) user = await this.userService.findByEmail(userId);

    if (user && bcrypt.compareSync(refreshToken, user.refreshToken))
      return user;
  }

  async changePassword(command: ChangePasswordCommand, userId: string) {
    const { newPassword, oldPassword } = command;
    const user = await this.userService.findById(userId);
    if (!bcrypt.compareSync(oldPassword, user?.password))
      throw new SecurityException(
        MessageCode.INVALID_PASSWORD,
        ExceptionCode.UNAUTHORIZED,
      );
    const encryptedPassword = this.hash(newPassword);
    await this.userService.changePassword(user.id, encryptedPassword);
  }

  async logout(response: Response) {
    this.cookieService.clearAll(response);
  }

  // fixme: in case email fails we end up with user and token
  // it needs to be in transaction
  async register(command: RegisterUserCommand): Promise<RegisterUserResult> {
    const { email, password, name } = command;
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new SecurityException(
        MessageCode.USER_ALREADY_EXIST,
        ExceptionCode.FORBIDDEN,
      );
    }
    const encryptedPassword = this.hash(password);
    const { user, registrationToken } = await this.userService.createNew({
      email,
      password: encryptedPassword,
      name,
      registrationMethod: RegistrationMethod.manual,
    });
    await this.emailService.sendAccountConfirmation(
      user,
      `${
        this.accountConfirmationUrl
      }/${registrationToken.activationGuid.toString()}`,
      this.langService.language,
    );
    return { id: user.id };
  }

  async confirmRegistration({
    activationGuid,
  }: ConfirmRegistrationCommand): Promise<void> {
    return this.userService.markUserAsActive(activationGuid);
  }

  async resendAccountConfirmationLink({
    activationGuid,
  }: ResendRegistrationConfirmationCommand): Promise<void> {
    const oldToken =
      await this.userService.findRegistrationTokenByActivationGuid(
        activationGuid,
      );
    if (!oldToken) {
      throw new SecurityException(
        MessageCode.INVALID_ACTIVATION_GUID,
        ExceptionCode.BAD_REQUEST,
      );
    }
    const { userId } = oldToken;
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new SecurityException(
        MessageCode.USER_DOES_NOT_EXIST,
        ExceptionCode.BAD_REQUEST,
      );
    }
    if (user.active) {
      throw new SecurityException(
        MessageCode.USER_IS_ALREADY_ACTIVE,
        ExceptionCode.BAD_REQUEST,
      );
    }
    const token = await this.userService.generateRegistrationTokenFor(user);
    return this.sendAccountConfirmationEmail(user, token);
  }

  private async sendAccountConfirmationEmail(
    user: User,
    token: RegistrationToken,
  ): Promise<void> {
    return this.emailService.sendAccountConfirmation(
      user,
      `${this.accountConfirmationUrl}/${token.activationGuid}`,
      this.langService.language,
    );
  }

  private static userToDto(user: User, tokenExpiration?: number): UserDto {
    const { id, email, name } = user;
    const tokenExpirationDate = new Date();
    tokenExpirationDate.setSeconds(
      tokenExpirationDate.getSeconds() + Number(tokenExpiration || 0),
    );
    return {
      id,
      name,
      email,
      authExpiresIn: tokenExpiration + 's',
      validToISO: tokenExpirationDate.toISOString(),
    };
  }

  private hash(toBeHashed: string) {
    const salt = this.environment.BCRYPT_SALT;
    return bcrypt.hashSync(toBeHashed, salt);
  }

  private async generateAuthTokenPairFor(user: User, response: Response) {
    const token: AuthToken = { sub: user.id };
    const { refreshToken } = await this.authTokenService.signAuthTokenPair(
      token,
      response,
    );
    await this.userService.updateRefreshTokenFor(
      user.id,
      this.hash(refreshToken),
    );
  }

  private async validateLoginCommand(command: LoginCommand) {
    const { email, password } = command;
    const user = await this.userService.findByEmail(email);
    if (!user || !password) {
      throw new SecurityException(
        MessageCode.INVALID_USERNAME_OR_PASSWORD,
        ExceptionCode.UNAUTHORIZED,
      );
    }
    if (!user.active) {
      throw new SecurityException(
        MessageCode.USER_IS_NOT_ACTIVE,
        ExceptionCode.UNAUTHORIZED,
      );
    }
    if (!bcrypt.compareSync(password, user?.password))
      throw new SecurityException(
        MessageCode.INVALID_USERNAME_OR_PASSWORD,
        ExceptionCode.UNAUTHORIZED,
      );
    return user;
  }

  private get accountConfirmationUrl() {
    const baseUri = 'account/confirm-account';
    if (this.environment.PUBLIC_DOMAIN.includes('localhost')) {
      return `${this.environment.PUBLIC_DOMAIN}/${baseUri}`;
    }
    return `${
      this.environment.PUBLIC_DOMAIN
    }/${this.langService.language.toLowerCase()}/${baseUri}`;
  }
}

export class RegisterUserCommand {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(7)
  @MaxLength(18)
  password: string;

  @IsNotEmpty()
  name: string;
}

export interface RegisterUserResult {
  id: Id;
}

export class LoginCommand {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginWithGoogleCommand {
  @IsNotEmpty()
  idToken: string;

  @IsEmail()
  email: string;
}

export class UserDto {
  id: string;

  email: string;

  name: string;

  authExpiresIn: string | undefined;

  validToISO: string;
}

export interface AuthToken {
  sub: string;
}

export class ConfirmRegistrationCommand {
  @IsNotEmpty()
  activationGuid: Id;
}

export class ResendRegistrationConfirmationCommand {
  @IsNotEmpty()
  activationGuid: Id;
}

export class ChangePasswordCommand {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
