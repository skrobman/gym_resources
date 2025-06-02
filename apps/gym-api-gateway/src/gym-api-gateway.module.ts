import { Module } from '@nestjs/common';
import { GymApiGatewayController } from './gym-api-gateway.controller';
import { GymApiGatewayService } from './gym-api-gateway.service';
import {AuthModule} from "../../auth/src/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [GymApiGatewayController],
  providers: [GymApiGatewayService],
})
export class GymApiGatewayModule {}
