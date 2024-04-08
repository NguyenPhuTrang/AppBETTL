import { INPUT_PHONE_MAX_LENGTH, INPUT_TEXT_MAX_LENGTH, URL_MAX_LENGTH } from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { CommonListQuery } from '../../common/interfaces';
import { Document, Types } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IShortStatDiff {
    changedFiles: number;
    insertions: number;
    deletions: number;
    totalCodeReviewId: number;
}

export interface IShortStatBug {
    blocked: number;
    critical: number;
    major: number;
    minor: number;
    suggestion: number
}

export class CreateReleaseQualityDto {
    repositoryId: ObjectId;
    name: string;
    labels: string[];
    diff: IShortStatDiff;
    bugs: IShortStatBug;
}

export class GetReleaseListQuery extends CommonListQuery {
    name?: string;
    role?: string;
}