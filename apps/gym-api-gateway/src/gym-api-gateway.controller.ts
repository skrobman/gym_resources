import { Controller, Get } from '@nestjs/common';
import { GymApiGatewayService } from './gym-api-gateway.service';

@Controller()
export class GymApiGatewayController {
  constructor(private readonly gymApiGatewayService: GymApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.gymApiGatewayService.getHello();
  }
}
