import {NestFactory} from '@nestjs/core';
import {AuthModule} from './auth.module';
import * as cookieParser from 'cookie-parser';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AuthModule);

    app.use(cookieParser());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, //Deletes redundant fields
            forbidNonWhitelisted: false,
        })
    )

    await app.listen(3001);
}
bootstrap();
