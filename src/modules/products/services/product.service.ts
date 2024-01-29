import { BaseService } from '../../../common/base/base.service';
import { Product } from '../../../database/schemas/product.schema';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRepository } from '../product.repository';
import { GetProductListQuery } from '../product.interface';
import { ProductAttributesForDetail } from '../product.constant';

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {
    constructor(
        private readonly productRepository: ProductRepository,
    ) {
        super(productRepository);
    }

    async findProductById (
        id: Types.ObjectId,
        attributes: (keyof Product)[] = ProductAttributesForDetail,
    ) {
        try {
            return await this.productRepository.getOneById(id, attributes);
        } catch (error) {
            this.logger.error('Error in ProductService findProductById:'+ error);
            throw error;
        }
    }

    async findAllAndCountProductByQuery(query: GetProductListQuery) {
        try {
            const result = await this.productRepository.findAllAndCountProductByQuery(query);
            return result;
        } catch (error) {
            this.logger.error(
                'Error in ProductService findAllAndCountProductByQuery:'+ error,
            );
            throw error;
        }
    }
}