import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  AuthenticationService,
  ChangePasswordCommand,
  ConfirmRegistrationCommand,
  LoginCommand,
  LoginWithGoogleCommand,
  RegisterUserCommand,
  ResendRegistrationConfirmationCommand,
  UserDto,
} from '../../security/authentication/authentication.service';
import { JwtAuthGuard } from '../../security/authorization/jwt-auth.guard';
import { Request, Response } from 'express';
import { TokenService } from '../../security/token.service';
import { JwtRefreshGuard } from '../../security/authorization/jwt-refresh.guard';
import { RequestWithUser } from '../../security/authorization/jwt.strategy';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly tokenService: TokenService,
  ) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Req() request: Request,
    @Body() command: LoginCommand,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDto> {
    return this.authService.login(command, response);
  }

  @HttpCode(200)
  @Post('loginWithGoogle')
  async loginWithGoogle(
    @Body() command: LoginWithGoogleCommand,
    @Res({ passthrough: true }) response: Response,
  ): Promise<UserDto> {
    return this.authService.loginWithGoogle(command, response);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('changePassword')
  async changePassword(
    @Body() command: ChangePasswordCommand,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.id;
    return this.authService.changePassword(command, userId);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  @HttpCode(200)
  @Post('register')
  async register(@Body() command: RegisterUserCommand) {
    return this.authService.register(command);
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request?.user;
    return this.authService.onRefreshToken(response, user['id']);
  }

  @Get('csrfToken')
  @UseGuards(JwtAuthGuard)
  async getCsrfToken(@Res({ passthrough: true }) response: Response) {
    const csrfToken = this.tokenService.generateCsrfToken(response);
    return {
      csrfToken,
    };
  }

  @Post('confirmRegistration')
  async confirmRegistration(
    @Body() command: ConfirmRegistrationCommand,
  ): Promise<void> {
    return this.authService.confirmRegistration(command);
  }

  @Post('resendRegistrationConfirmation')
  async resendRegistrationConfirmation(
    @Body() command: ResendRegistrationConfirmationCommand,
  ) {
    return this.authService.resendAccountConfirmationLink(command);
  }
}
