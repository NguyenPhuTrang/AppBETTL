import {Product} from '../../database/schemas/product.schema';

export enum ProductOrderBy {
    ID = 'id',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updatedAt',
    PRICE = 'price'
}

export const ProductAttributesForList: (keyof Product)[] = [
    '_id',
    'id',
    'name',
    'price',
    'quantity',
    'description',
    'image',
    'rating',
    'sale',
    'createdAt',
    'updatedAt',
];

export const ProductAttributesForDetail: (keyof Product)[] = [
    '_id', 'id', 'name'
];