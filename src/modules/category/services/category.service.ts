import { BaseService } from '../../../common/base/base.service';
import { HttpException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
    CreateCategoryDto,
    GetCategoryListQuery,
    UpdateCategoryDto,
} from '../category.interface';

import { Category } from '../../../database/schemas/category.schema';
import { CategoryRepository } from '../category.repository';
import { CategoryAttributesForDetail } from '../category.constant';
import { HttpStatus } from '../../../common/constants';

@Injectable()
export class CategoryService extends BaseService<Category, CategoryRepository> {
    constructor(private readonly categoryRepository: CategoryRepository) {
        super(categoryRepository);
    }

    async createCategory(dto: CreateCategoryDto) {
        try {
            const existingCategory =
                await this.categoryRepository.findOneByCondition({
                    title: dto.title,
                    deletedAt: null,
                });

            if (existingCategory) {
                throw new HttpException(
                    'Category already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const category: SchemaCreateDocument<Category> = {
                ...(dto as any),
            };
            return await this.categoryRepository.createOne(category);
        } catch (error) {
            this.logger.error(
                'Error in CategoryService createCategory: ' + error,
            );
            throw error;
        }
    }

    async updateCategory(id: Types.ObjectId, dto: UpdateCategoryDto) {
        try {
            await this.categoryRepository.updateOneById(id, dto);
            return await this.findCategoryById(id);
        } catch (error) {
            this.logger.error(
                'Error in CategoryService updateCategory: ' + error,
            );
            throw error;
        }
    }

    async deleteCategory(id: Types.ObjectId) {
        try {
            await this.categoryRepository.softDeleteOne({ _id: id });
            return { id };
        } catch (error) {
            this.logger.error(
                'Error in CategoryService deleteCategory: ' + error,
            );
            throw error;
        }
    }

    async findCategoryById(
        id: Types.ObjectId,
        attributes: (keyof Category)[] = CategoryAttributesForDetail,
    ) {
        try {
            return await this.categoryRepository.getOneById(id, attributes);
        } catch (error) {
            this.logger.error(
                'Error in CategoryService findCategoryById: ' + error,
            );
            throw error;
        }
    }

    async findAllAndCountCategoryByQuery(query: GetCategoryListQuery) {
        try {
            return await this.categoryRepository.findAllAndCountCategoryByQuery(
                query,
            );
        } catch (error) {
            this.logger.error(
                'Error in CategoryService findAllAndCountCategoryByQuery: ' +
                    error,
            );
            throw error;
        }
    }
}
