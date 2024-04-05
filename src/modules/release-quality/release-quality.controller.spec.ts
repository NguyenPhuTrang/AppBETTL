import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseQualityController } from './release-quality.controller';

describe('ReleaseQualityController', () => {
  let controller: ReleaseQualityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReleaseQualityController],
    }).compile();

    controller = module.get<ReleaseQualityController>(ReleaseQualityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
