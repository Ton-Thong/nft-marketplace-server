import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { jwt } from './modules/auth/auth.jwt.config';
import { AuthModule } from './modules/auth/auth.modules';
import { CollectionModule } from './modules/collection/collection.modules';
import { OrderModule } from './modules/order/order.modules';
import { ProductModule } from './modules/product/product.modules';
import { UserModule } from './modules/user/user.modules';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './config/.env'}),
    UserModule, 
    ProductModule,
    OrderModule,
    CollectionModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: String(jwt.secret), signOptions: { expiresIn: jwt.expire } })],
  controllers: [AppController],
  providers: [],
  exports: [PassportModule, JwtModule],
})
export class AppModule {}
