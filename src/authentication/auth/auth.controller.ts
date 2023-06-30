import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
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
