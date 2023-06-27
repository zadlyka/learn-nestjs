import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WrapInterceptor } from './interceptor/wrap.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.useGlobalInterceptors(new WrapInterceptor());
}
bootstrap();
