import { ReleaseQuality } from "../../database/schemas/release-quality.schema";

export const ReleaseQualityAttributesForList: (keyof ReleaseQuality)[] = [
    '_id',
    'id',
    'name',
    'labels',
    'diff',
    'bugs',
    'createdAt',
    'updatedAt',
];

export const ReleaseQualityAttributesForDetail: (keyof ReleaseQuality)[] = [
    '_id',
    'id',
    'name',
    'labels',
    'diff',
    'bugs',
]