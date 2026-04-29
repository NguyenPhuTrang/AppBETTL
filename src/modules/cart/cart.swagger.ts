export const addToCartSuccessResponseExample = {
    createdAt: '2024-01-10T10:46:42.037Z',
    updatedAt: '2024-01-10T10:46:42.037Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    createdBy: null,
    userId: '659e7592b3b56d0946b3c7b5',
    items: [
        {
            productId: '659e7592b3b56d0946b3c7b6',
            productName: 'Áo thun nam',
            productImage: 'https://example.com/image.jpg',
            price: 199000,
            quantity: 1,
        },
    ],
    totalPrice: 199000,
    _id: '659e7592b3b56d0946b3c7b5',
    __v: 0,
    id: '659e7592b3b56d0946b3c7b5',
};

export const updateCartItemSuccessResponseExample = {
    _id: '659e7592b3b56d0946b3c7b5',
    userId: '659e7592b3b56d0946b3c7b5',
    items: [
        {
            productId: '659e7592b3b56d0946b3c7b6',
            productName: 'Áo thun nam',
            productImage: 'https://example.com/image.jpg',
            price: 199000,
            quantity: 2,
        },
    ],
    totalPrice: 398000,
    id: '659e7592b3b56d0946b3c7b5',
};

export const removeCartItemSuccessResponseExample = {
    _id: '659e7592b3b56d0946b3c7b5',
    userId: '659e7592b3b56d0946b3c7b5',
    items: [],
    totalPrice: 0,
    id: '659e7592b3b56d0946b3c7b5',
};

export const clearCartSuccessResponseExample = {
    _id: '659e7592b3b56d0946b3c7b5',
    userId: '659e7592b3b56d0946b3c7b5',
    items: [],
    totalPrice: 0,
    id: '659e7592b3b56d0946b3c7b5',
};

export const getCartDetailSuccessResponseExample = {
    _id: '659e7592b3b56d0946b3c7b5',
    userId: '659e7592b3b56d0946b3c7b5',
    items: [
        {
            productId: '659e7592b3b56d0946b3c7b6',
            productName: 'Áo thun nam',
            productImage: 'https://example.com/image.jpg',
            price: 199000,
            quantity: 1,
        },
    ],
    totalPrice: 199000,
    id: '659e7592b3b56d0946b3c7b5',
};

export const getCartListSuccessResponseExample = {
    totalItems: 1,
    items: [
        {
            _id: '659e7592b3b56d0946b3c7b5',
            createdAt: '2024-01-10T10:46:42.037Z',
            updatedAt: '2024-01-10T10:47:59.566Z',
            userId: '659e7592b3b56d0946b3c7b5',
            items: [
                {
                    productId: '659e7592b3b56d0946b3c7b6',
                    productName: 'Áo thun nam',
                    productImage: 'https://example.com/image.jpg',
                    price: 199000,
                    quantity: 1,
                },
            ],
            totalPrice: 199000,
            id: '659e7592b3b56d0946b3c7b5',
        },
    ],
};
