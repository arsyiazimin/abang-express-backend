import { Test, TestingModule } from '@nestjs/testing';
import { AbangExpressService } from './abang-express.service';

describe('AbangExpressService', () => {
  let service: AbangExpressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbangExpressService],
    }).compile();

    service = module.get<AbangExpressService>(AbangExpressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
