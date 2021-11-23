import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.modules';
import { CollectionModule } from './modules/collection/collection.modules';
import { ProductModule } from './modules/product/product.modules';
import { UserModule } from './modules/user/user.modules';

@Module({
  imports: [
    UserModule, 
    ProductModule,
    CollectionModule,
    AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
