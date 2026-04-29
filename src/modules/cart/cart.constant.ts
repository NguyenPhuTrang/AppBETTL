import { Cart } from '../../database/schemas/cart.schema';

export enum CartOrderBy {
    ID = 'id',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updatedAt',
}

export const CartAttributesForList: (keyof Cart)[] = [
    '_id',
    'id',
    'userId',
    'items',
    'totalPrice',
    'createdAt',
    'updatedAt',
];

export const CartAttributesForDetail: (keyof Cart)[] = [
    '_id',
    'id',
    'userId',
    'items',
    'totalPrice',
];
