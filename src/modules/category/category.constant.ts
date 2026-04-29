import { Category } from '../../database/schemas/category.schema';

export enum CategoryOrderBy {
    ID = 'id',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updatedAt',
    SORT_ORDER = 'sortOrder',
}

export const CategoryAttributesForList: (keyof Category)[] = [
    '_id',
    'id',
    'title',
    'icon',
    'sortOrder',
    'isActive',
    'createdAt',
    'updatedAt',
];

export const CategoryAttributesForDetail: (keyof Category)[] = [
    '_id',
    'id',
    'title',
    'icon',
    'sortOrder',
    'isActive',
];
