import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CartService } from './services/cart.service';
import { CartRepository } from './cart.repository';
import { Cart, CartSchema } from '../../database/schemas/cart.schema';
import { Product, ProductSchema } from '../../database/schemas/product.schema';
import { CartController } from './controllers/cart.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
            { name: Product.name, schema: ProductSchema },
        ]),
        JwtModule.register({
            secret: '123456',
            signOptions: { expiresIn: 100 },
        }),
    ],
    controllers: [CartController],
    providers: [CartService, CartRepository],
    exports: [CartRepository],
})
export class CartModule {}
