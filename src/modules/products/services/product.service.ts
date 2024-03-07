import { BaseService } from '../../../common/base/base.service';
import { Product } from '../../../database/schemas/product.schema';
import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductRepository } from '../product.repository';
import { CreateProductDto, GetProductListQuery, UpdateProductDto } from '../product.interface';
import { ProductAttributesForDetail } from '../product.constant';
import { HttpStatus } from '../../../common/constants';

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {
    constructor(
        private readonly productRepository: ProductRepository,
    ) {
        super(productRepository);
    }

    async createProduct(dto: CreateProductDto) {
        try {
            const  existingProduct = await this.productRepository.findOneByCondition({
                name: dto.name,
            })
            if (existingProduct && existingProduct.deletedAt === null) {
                throw new HttpException('Product already exists', HttpStatus.BAD_REQUEST);
            }
            const product: SchemaCreateDocument<Product> = {
                ...(dto as any),
            };
            return await this.productRepository.createOne(product);
        } catch (error) {
            this.logger.error('Error in ProductService createProduct: ' + error);
            throw error;
        }
    }

    async updateProduct(id: Types.ObjectId, dto: UpdateProductDto) {
        try {
            await this.productRepository.updateOneById(id, dto);
            return await this.findProductById(id);
        } catch (error) {
            this.logger.error('Error in ProductService updateProduct:'+ error);
        }
    }

    async deleteProduct(id: Types.ObjectId) {
        try {
            await this.productRepository.softDeleteOne({ _id: id });
            return { id };
        } catch (error) {
            this.logger.error('Error in ProductService deleteProduct:'+ error);
        }
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