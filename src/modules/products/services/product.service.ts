import { BaseService } from '../../../common/base/base.service';
import { Product } from '../../../database/schemas/product.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRepository } from '../product.repository';
import {
    CreateProductDto,
    GetProductListQuery,
    UpdateProductDto,
} from '../product.interface';
import { ProductAttributesForDetail } from '../product.constant';
import { HttpStatus } from '../../../common/constants';

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {
    constructor(private readonly productRepository: ProductRepository) {
        super(productRepository);
    }

    async createProduct(dto: CreateProductDto) {
        try {
            const product: SchemaCreateDocument<Product> = {
                ...(dto as any),
                images: dto.images ?? [],
                colors: dto.colors ?? [],
                sizes: dto.sizes ?? [],
                sale: dto.sale ?? 0,
                originalPrice: dto.originalPrice ?? dto.price,
                condition: dto.condition ?? 'New',
                rating: dto.rating ?? 0,
                totalRatings: 0,
                totalSold: 0,
                shipping: dto.shipping ?? null,
            };
            return await this.productRepository.createOne(product);
        } catch (error) {
            this.logger.error(
                'Error in ProductService createProduct: ' + error,
            );
            throw error;
        }
    }

    async updateProduct(id: Types.ObjectId, dto: UpdateProductDto) {
        try {
            const existing = await this.findProductById(id);
            if (!existing) {
                throw new HttpException(
                    'Product not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.productRepository.updateOneById(id, dto);
            return await this.findProductById(id);
        } catch (error) {
            this.logger.error('Error in ProductService updateProduct:' + error);
            throw error;
        }
    }

    async deleteProduct(id: Types.ObjectId) {
        try {
            const existing = await this.findProductById(id);
            if (!existing) {
                throw new HttpException(
                    'Product not found',
                    HttpStatus.NOT_FOUND,
                );
            }
            await this.productRepository.softDeleteOne({ _id: id });
            return { id };
        } catch (error) {
            this.logger.error('Error in ProductService deleteProduct:' + error);
            throw error;
        }
    }

    async findProductById(
        id: Types.ObjectId,
        attributes: (keyof Product)[] = ProductAttributesForDetail,
    ) {
        try {
            return await this.productRepository.getOneById(id, attributes);
        } catch (error) {
            this.logger.error(
                'Error in ProductService findProductById:' + error,
            );
            throw error;
        }
    }

    async findAllAndCountProductByQuery(query: GetProductListQuery) {
        try {
            return await this.productRepository.findAllAndCountProductByQuery(
                query,
            );
        } catch (error) {
            this.logger.error(
                'Error in ProductService findAllAndCountProductByQuery:' +
                    error,
            );
            throw error;
        }
    }
}
