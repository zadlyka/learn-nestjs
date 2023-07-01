import { CacheStore, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
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
import { redisStore } from 'cache-manager-redis-store';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppConfig] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore as unknown as CacheStore,
        url: configService.get('cache.url'),
        port: configService.get('cache.port'),
        ttl: configService.get('cache.ttl'),
      }),
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
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
