import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './authentication/auth/guards/jwt-auth.guard';
import { AuthenticationModule } from './authentication/authentication.module';
import AppConfig from './config/app.config';
import { WrapInterceptor } from './interceptor/wrap.interceptor';
import { PermissionsGuard } from './authentication/auth/guards/permissions.guard';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    AuthenticationModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
