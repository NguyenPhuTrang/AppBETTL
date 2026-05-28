import { Product } from '../../database/schemas/product.schema';

export enum ProductOrderBy {
    ID = 'id',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updatedAt',
    PRICE = 'price',
    RATING = 'rating',
    TOTAL_SOLD = 'totalSold',
}

export const ProductAttributesForList: (keyof Product)[] = [
    '_id',
    'id',
    'name',
    'description',
    'images',
    'price',
    'originalPrice',
    'sale',
    'categoryId',
    'colors',
    'sizes',
    'quantity',
    'condition',
    'rating',
    'totalRatings',
    'totalSold',
    'shipping',
    'createdAt',
    'updatedAt',
];

export const ProductAttributesForDetail: (keyof Product)[] = [
    '_id',
    'id',
    'name',
    'description',
    'images',
    'price',
    'originalPrice',
    'sale',
    'categoryId',
    'colors',
    'sizes',
    'quantity',
    'condition',
    'rating',
    'totalRatings',
    'totalSold',
    'shipping',
    'createdAt',
    'updatedAt',
];
