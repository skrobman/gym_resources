import { Injectable } from '@nestjs/common';

@Injectable()
export class GymApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
