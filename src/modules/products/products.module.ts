import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { ProductRepository } from './product.repository';
import { Product, ProductSchema } from '../../database/schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: [ProductRepository],
})
export class ProductsModule {}