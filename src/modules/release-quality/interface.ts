import { CommonListQuery } from '../../common/interfaces';
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
    suggestion: number;
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
