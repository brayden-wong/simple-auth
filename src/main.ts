import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService>(ConfigService);
  const PORT = config.get('PORT');

  await app.listen(PORT, async () =>
    console.log(`Server started at ${await app.getUrl()}`),
  );
}
bootstrap();
