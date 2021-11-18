import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.modules';
import { ProductModule } from './modules/product/product.modules';
import { UserModule } from './modules/user/user.modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule, 
    ProductModule,
    AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
