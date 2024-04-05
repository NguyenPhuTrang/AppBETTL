import { Injectable } from '@nestjs/common';
import { ReleaseQualityRepository } from './release-quality.repository';
import { BaseService } from '../../common/base/base.service';
import { ReleaseQuality } from '../../database/schemas/release-quality.schema';
import { GetReleaseListQuery } from './interface';

@Injectable()
export class ReleaseQualityService extends BaseService<ReleaseQuality, ReleaseQualityRepository> {
    constructor(
        private readonly releaseQualityRepository: ReleaseQualityRepository
    ) {
        super(releaseQualityRepository);
    }

    async findAllAndCountReleaseQualityByQuery(query: GetReleaseListQuery) {
        try {
            const result =
                await this.releaseQualityRepository.findAllAndCountReleaseByQuery(query);
            return result;
        } catch (error) {
            this.logger.error(
                'Error in ReleaseQualityService findAllAndCountReleaseByQuery: ' + error,
            );
            throw error;
        }
    }
}
