import { NestFactory } from '@nestjs/core';
import { GymApiGatewayModule } from './gym-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GymApiGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
