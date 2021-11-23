import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.modules';
import { ProductModule } from './modules/product/product.modules';
import { UserModule } from './modules/user/user.modules';

@Module({
  imports: [
    UserModule, 
    ProductModule,
    AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
