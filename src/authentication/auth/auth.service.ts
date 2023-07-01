import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { CustomLogger } from 'src/common/services/custom-logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext(AuthService.name);
  }

  async signIn(user: User) {
    return {
      accessToken: await this.jwtService.signAsync({ ...user }),
    };
  }

  async validateUser(signInDto: SignInDto): Promise<any> {
    const { username, password } = signInDto;
    const user = await this.userService.findOneByUsername(username);
    const isMatch = await bcrypt.compare(password, user?.password);
    if (isMatch) {
      this.customLogger.log('login');
      return user;
    }
    return null;
  }
}
