export const createPaymentSuccessResponseExample = {
    createdAt: '2024-01-10T10:46:42.037Z',
    updatedAt: '2024-01-10T10:46:42.037Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    createdBy: null,
    orderCode: 1715000000000,
    amount: 300000,
    description: 'Thanh toan don hang',
    buyerName: 'Nguyen Van A',
    buyerEmail: 'buyer@email.com',
    buyerPhone: '0901234567',
    status: 'PENDING',
    checkoutUrl: 'https://pay.payos.vn/web/abc123',
    paymentLinkId: 'abc123-def456',
    _id: '659e7592b3b56d0946b3c7b5',
    __v: 0,
    id: '659e7592b3b56d0946b3c7b5',
};

export const cancelPaymentSuccessResponseExample = {
    _id: '659e7592b3b56d0946b3c7b5',
    orderCode: 1715000000000,
    amount: 300000,
    description: 'Thanh toan don hang',
    buyerName: 'Nguyen Van A',
    buyerEmail: 'buyer@email.com',
    buyerPhone: '0901234567',
    status: 'CANCELLED',
    checkoutUrl: 'https://pay.payos.vn/web/abc123',
    paymentLinkId: 'abc123-def456',
    id: '659e7592b3b56d0946b3c7b5',
};

export const getPaymentDetailSuccessResponseExample = {
    _id: '659e7592b3b56d0946b3c7b5',
    orderCode: 1715000000000,
    amount: 300000,
    description: 'Thanh toan don hang',
    buyerName: 'Nguyen Van A',
    buyerEmail: 'buyer@email.com',
    buyerPhone: '0901234567',
    status: 'PAID',
    checkoutUrl: 'https://pay.payos.vn/web/abc123',
    paymentLinkId: 'abc123-def456',
    createdAt: '2024-01-10T10:46:42.037Z',
    updatedAt: '2024-01-10T10:47:59.566Z',
    id: '659e7592b3b56d0946b3c7b5',
};

export const getPaymentListSuccessResponseExample = {
    totalItems: 1,
    items: [
        {
            _id: '659e7592b3b56d0946b3c7b5',
            createdAt: '2024-01-10T10:46:42.037Z',
            updatedAt: '2024-01-10T10:47:59.566Z',
            orderCode: 1715000000000,
            amount: 300000,
            description: 'Thanh toan don hang',
            buyerName: 'Nguyen Van A',
            buyerEmail: 'buyer@email.com',
            buyerPhone: '0901234567',
            status: 'PAID',
            checkoutUrl: 'https://pay.payos.vn/web/abc123',
            id: '659e7592b3b56d0946b3c7b5',
        },
    ],
};

export const webhookPaymentSuccessResponseExample = {
    success: true,
};
