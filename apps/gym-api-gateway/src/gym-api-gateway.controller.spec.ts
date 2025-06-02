import { Test, TestingModule } from '@nestjs/testing';
import { GymApiGatewayController } from './gym-api-gateway.controller';
import { GymApiGatewayService } from './gym-api-gateway.service';

describe('GymApiGatewayController', () => {
  let gymApiGatewayController: GymApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GymApiGatewayController],
      providers: [GymApiGatewayService],
    }).compile();

    gymApiGatewayController = app.get<GymApiGatewayController>(GymApiGatewayController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(gymApiGatewayController.getHello()).toBe('Hello World!');
    });
  });
});
