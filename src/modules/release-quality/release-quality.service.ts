import { Injectable } from '@nestjs/common';
import { ReleaseQualityRepository } from './release-quality.repository';
import { BaseService } from '../../common/base/base.service';
import { ReleaseQuality } from '../../database/schemas/release-quality.schema';
import { CreateReleaseQualityDto, GetReleaseListQuery } from './interface';
import { Types } from 'mongoose';
import { ReleaseQualityAttributesForDetail } from './release-quality.constant';

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

    async createRelease(dto: CreateReleaseQualityDto) {
        try {
            const releaseQuality: SchemaCreateDocument<ReleaseQuality> = {
                ...(dto as any),
            }
            return await this.releaseQualityRepository.createOne(releaseQuality);
        } catch (error) {
            this.logger.error('Error in ReleaseQualityService createRelease: ' + error);
            throw error;
        }
    }

    async updateRelease(id: Types.ObjectId, dto: CreateReleaseQualityDto) {
        try {
            await this.releaseQualityRepository.updateOneById(id, dto);
            return await this.findReleaseById(id);
        } catch (error) {
            this.logger.error('Error in ReleaseQualityService updateRelease: ' + error);
        }
    }

    async findReleaseById(
        id: Types.ObjectId,
        attributes: (keyof ReleaseQuality)[] = ReleaseQualityAttributesForDetail,
    ) {
        try {
            const res = await this.releaseQualityRepository.getOneById(id, attributes);
            return res;
        } catch (error) {
            this.logger.error('Error in ReleaseQualityService findReleaseById: ' + error);
            throw error;
        }
    }

    async deleteRelease(id: Types.ObjectId) {
        try {
            await this.releaseQualityRepository.softDeleteOne({ _id: id });
            return { id }
        } catch (error) {
            this.logger.error('Error in ReleaseQualityService declareRelease: ' + error);
            throw error;
        }
    }
}
