import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseQualityService } from './release-quality.service';

describe('ReleaseQualityService', () => {
  let service: ReleaseQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReleaseQualityService],
    }).compile();

    service = module.get<ReleaseQualityService>(ReleaseQualityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
