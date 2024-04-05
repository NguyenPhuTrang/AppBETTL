import { ReleaseQuality } from "../../database/schemas/release-quality.schema";

export const ReleaseQualityAttributesForList: (keyof ReleaseQuality)[] = [
    '_id',
    'id',
    'name',
    'createdAt',
    'updatedAt',
];