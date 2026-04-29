import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './category.repository';
import {
    Category,
    CategorySchema,
} from '../../database/schemas/category.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Category.name, schema: CategorySchema },
        ]),
        JwtModule.register({
            secret: '123456',
            signOptions: { expiresIn: 100 },
        }),
    ],
    controllers: [CategoryController],
    providers: [CategoryService, CategoryRepository],
    exports: [CategoryRepository],
})
export class CategoryModule {}
