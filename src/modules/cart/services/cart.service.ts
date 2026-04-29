import { BaseService } from '../../../common/base/base.service';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
    Product,
    ProductDocument,
} from '../../../database/schemas/product.schema';
import { CartRepository } from '../cart.repository';
import { HttpStatus } from '../../../common/constants';
import {
    AddToCartDto,
    GetCartListQuery,
    UpdateCartItemDto,
} from '../cart.interface';
import { Cart } from '@/database/schemas/cart.schema';

@Injectable()
export class CartService extends BaseService<Cart, CartRepository> {
    constructor(
        private readonly cartRepository: CartRepository,
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) {
        super(cartRepository);
    }

    async addToCart(userId: string, dto: AddToCartDto) {
        try {
            const product = await this.productModel.findById(dto.productId);
            if (!product) {
                throw new HttpException(
                    'Product not found',
                    HttpStatus.ITEM_NOT_FOUND,
                );
            }
            let cart = await this.cartRepository.findCartByUserId(userId);

            if (!cart) {
                cart = await this.cartRepository.createOne({
                    userId,
                    items: [
                        {
                            productId: dto.productId,
                            productName: product.name,
                            productImage: product.image,
                            price: Number(product.price),
                            quantity: dto.quantity,
                        },
                    ],
                    totalPrice: Number(product.price) * dto.quantity,
                } as any);
            } else {
                const existingItemIndex = (cart.items as any[]).findIndex(
                    (item) => item.productId === dto.productId,
                );

                if (existingItemIndex > -1) {
                    (cart.items as any[])[existingItemIndex].quantity +=
                        dto.quantity;
                } else {
                    (cart.items as any[]).push({
                        productId: dto.productId,
                        productName: product.name,
                        productImage: product.image,
                        price: Number(product.price),
                        quantity: dto.quantity,
                    });
                }
                const totalPrice = (cart.items as any[]).reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                );

                await this.cartRepository.updateOneById((cart as any)._id, {
                    items: cart.items,
                    totalPrice,
                } as any);
                cart = await this.cartRepository.findCartByUserId(userId);
            }
            return cart;
        } catch (error) {
            this.logger.error('Error in CartService addToCart: ' + error);
            throw error;
        }
    }

    async updateCartItem(userId: string, dto: UpdateCartItemDto) {
        try {
            const cart = await this.cartRepository.findCartByUserId(userId);
            if (!cart) {
                throw new HttpException(
                    'Cart not found',
                    HttpStatus.ITEM_NOT_FOUND,
                );
            }

            const itemIndex = (cart.items as any[]).findIndex(
                (item) => item.productId === dto.productId,
            );

            if (itemIndex === -1) {
                throw new HttpException(
                    'Product not found in cart',
                    HttpStatus.ITEM_NOT_FOUND,
                );
            }

            (cart.items as any[])[itemIndex].quantity = dto.quantity;

            const totalPrice = (cart.items as any[]).reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );

            await this.cartRepository.updateOneById((cart as any)._id, {
                items: cart.items,
                totalPrice,
            } as any);

            return await this.cartRepository.findCartByUserId(userId);
        } catch (error) {
            this.logger.error('Error in CartService updateCartItem: ' + error);
            throw error;
        }
    }

    async removeCartItem(userId: string, productId: string) {
        try {
            const cart = await this.cartRepository.findCartByUserId(userId);
            if (!cart) {
                throw new HttpException(
                    'Cart not found',
                    HttpStatus.ITEM_NOT_FOUND,
                );
            }
            const updatedItems = (cart.items as any[]).filter(
                (item) => item.productId !== productId,
            );
            const totalPrice = updatedItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0,
            );

            await this.cartRepository.updateOneById((cart as any)._id, {
                items: updatedItems,
                totalPrice,
            } as any);

            return await this.cartRepository.findCartByUserId(userId);
        } catch (error) {
            this.logger.error('Error in CartService removeCartItem: ' + error);
            throw error;
        }
    }

    async clearCart(userId: string) {
        try {
            const cart = await this.cartRepository.findCartByUserId(userId);
            if (!cart) {
                throw new HttpException(
                    'Cart not found',
                    HttpStatus.ITEM_NOT_FOUND,
                );
            }
            await this.cartRepository.updateOneById((cart as any)._id, {
                items: [],
                totalPrice: 0,
            } as any);
            return await this.cartRepository.findCartByUserId(userId);
        } catch (error) {
            this.logger.error('Error in CartService clearCart: ' + error);
            throw error;
        }
    }

    async getCartByUserId(userId: string) {
        try {
            const cart = await this.cartRepository.findCartByUserId(userId);
            if (!cart) {
                return {
                    userId,
                    items: [],
                    totalPrice: 0,
                };
            }
            return cart;
        } catch (error) {
            this.logger.error('Error in CartService getCartByUserId: ' + error);
            throw error;
        }
    }

    async findAllAndCountCartByQuery(query: GetCartListQuery) {
        try {
            return await this.cartRepository.findAllAndCountCartByQuery(query);
        } catch (error) {
            this.logger.error(
                'Error in CartService findAllAndCountCartByQuery: ' + error,
            );
            throw error;
        }
    }
}
