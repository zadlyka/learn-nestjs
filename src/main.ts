import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { WrapInterceptor } from './interceptor/wrap.interceptor';
import { ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new WrapInterceptor(),
  );
}
bootstrap();
