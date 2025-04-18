import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  CreateUserDto,
  RegisterUserDto,
  UserLoginDto,
} from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/users.interface';
import { RolesService } from 'src/roles/roles.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private rolesService: RolesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: UserLoginDto })
  @ResponseMessage('Login thanh cong')
  handleLogin(@Request() req, @Res({ passthrough: true }) response) {
    return this.authService.login(req.user, response);
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('register')
  handleRegister(@Body() RegisterUserDto: RegisterUserDto) {
    return this.authService.register(RegisterUserDto);
  }

  @ResponseMessage('Get user information')
  @Get('account')
  async getAccount(@Request() req, @User() user: IUser) {
    const temp = (await this.rolesService.findOne(user.role._id)) as any;
    user.permissions = temp?.permissions;
    return req.user;
  }

  @ResponseMessage('Logout user')
  @Post('logout')
  handleLogout(@User() user: IUser, @Res({ passthrough: true }) response) {
    return this.authService.logout(user, response);
  }

  @Public()
  @ResponseMessage('Get user by refresh token')
  @Get('refresh')
  handleRefreshToken(@Req() request, @Res({ passthrough: true }) response) {
    const refreshToken = request.cookies['refresh_token'];
    return this.authService.processNewToken(refreshToken, response);
  }
}
