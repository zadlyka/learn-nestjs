import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { WrapInterceptor } from './interceptor/wrap.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const allowUrls = app.get(ConfigService).get('allowUrls');

  app.enableCors({
    origin: allowUrls,
  });

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new WrapInterceptor(),
  );
}
bootstrap();
