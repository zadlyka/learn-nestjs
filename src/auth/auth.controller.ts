import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { WithoutJwt } from './decorators/without-jwt.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @WithoutJwt()
  @UseGuards(AuthGuard('local'))
  @Post()
  signIn(@Request() req) {
    return this.authService.signIn(req.user);
  }
}
