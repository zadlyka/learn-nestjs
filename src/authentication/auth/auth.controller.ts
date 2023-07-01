import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { WithoutJwt } from './decorators/without-jwt.decorator';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectQueue('log') private readonly authQueue: Queue,
  ) {}

  @WithoutJwt()
  @UseGuards(AuthGuard('local'))
  @Post()
  async signIn(@Request() req) {
    const data = req.user;
    await this.authQueue.add('transcode', data);
    return this.authService.signIn(req.user);
  }
}
