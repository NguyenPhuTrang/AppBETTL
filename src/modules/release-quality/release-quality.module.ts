import { Module } from '@nestjs/common';
import { ReleaseQualityController } from './release-quality.controller';
import { ReleaseQualityService } from './release-quality.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReleaseQuality, ReleaseQualitySchema } from '../../database/schemas/release-quality.schema';
import { ReleaseQualityRepository } from './release-quality.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ReleaseQuality.name, schema: ReleaseQualitySchema }]),
  ],
  controllers: [ReleaseQualityController],
  providers: [ReleaseQualityService, ReleaseQualityRepository]
})
export class ReleaseQualityModule { }
