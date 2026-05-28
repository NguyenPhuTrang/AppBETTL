const baseProductFields = {
    _id: '659e7592b3b56d0946b3c7b5',
    id: '659e7592b3b56d0946b3c7b5',
    createdAt: '2024-01-10T10:46:42.037Z',
    updatedAt: '2024-01-10T10:46:42.037Z',
    deletedAt: null,
    deletedBy: null,
    updatedBy: null,
    createdBy: null,
    __v: 0,

    name: 'Áo thun nam cotton thoáng mát',
    description:
        'Áo thun nam chất liệu cotton 100%, thoáng mát, thấm hút mồ hôi tốt',
    images: [
        'https://example.com/images/product-1.jpg',
        'https://example.com/images/product-2.jpg',
    ],

    price: 199000,
    originalPrice: 250000,
    sale: 25,

    categoryId: '659e7592b3b56d0946b3c7b4',
    colors: [
        {
            label: 'Đen',
            value: '#000000',
            thumbnail: 'https://example.com/colors/black.jpg',
        },
        {
            label: 'Trắng',
            value: '#FFFFFF',
            thumbnail: 'https://example.com/colors/white.jpg',
        },
        {
            label: 'Xanh đá',
            value: '#4A7B9D',
            thumbnail: 'https://example.com/colors/blue.jpg',
        },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],

    quantity: 50,
    condition: 'New',

    rating: 4.5,
    totalRatings: 27400,
    totalSold: 100000,

    shipping: {
        isFreeShip: true,
        estimatedDelivery: 'Giao hàng vào ngày mai',
    },
};

export const createProductSuccessResponseExample = {
    ...baseProductFields,
};

export const updateProductSuccessResponseExample = {
    ...baseProductFields,
    name: 'Áo thun nam cotton updated',
    price: 179000,
    sale: 30,
};

export const deleteProductSuccessResponseExample = {
    id: '659e7592b3b56d0946b3c7b5',
};

export const getProductDetailSuccessResponseExample = {
    ...baseProductFields,
};

export const getProductListSuccessResponseExample = {
    totalItems: 1,
    items: [
        {
            ...baseProductFields,
        },
    ],
};
