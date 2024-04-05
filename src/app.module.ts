import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import envSchema from './common/config/validation-schema';
import { I18nModule } from './i18n/i18n.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptions.filter';
import { MongoModule } from './common/services/mongo.service';
import { CommonModule } from './modules/common/common.module';
import { UserModule } from './modules/user/user.module';
import { TransformInterceptor } from './modules/common/transform.interceptor';
import { HeaderMiddleware } from './modules/middleware/header.middleware';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { ReleaseQualityModule } from './modules/release-quality/release-quality.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validationSchema: envSchema,
        }),
        CommonModule,
        I18nModule,
        MongoModule,
        UserModule,
        AuthModule,
        ProductsModule,
        ReleaseQualityModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            scope: Scope.REQUEST,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HeaderMiddleware).forRoutes('*');
    }
}
