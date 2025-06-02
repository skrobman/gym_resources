import {NestFactory} from '@nestjs/core';
import {AuthModule} from './auth.module';
import * as cookieParser from 'cookie-parser';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);

    app.use(cookieParser());

    await app.listen(3001);
}
bootstrap();
