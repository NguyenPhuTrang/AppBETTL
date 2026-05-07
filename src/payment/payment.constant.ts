export enum PaymentOrderBy {
    ID = 'id',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
}

export const PAYMENT_MODEL = 'Payment';

export const PAYOS_API_URL = 'https://api-merchant.payos.vn';

export const PaymentAttributesForList: string[] = [
    '_id',
    'id',
    'orderCode',
    'amount',
    'description',
    'buyerName',
    'buyerEmail',
    'buyerPhone',
    'status',
    'checkoutUrl',
    'createdAt',
    'updatedAt',
];

export const PaymentAttributesForDetail: string[] = [
    '_id',
    'id',
    'orderCode',
    'amount',
    'description',
    'buyerName',
    'buyerEmail',
    'buyerPhone',
    'status',
    'checkoutUrl',
    'paymentLinkId',
    'createdAt',
    'updatedAt',
];
