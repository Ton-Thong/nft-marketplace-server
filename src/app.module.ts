import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.modules';
import { CollectionModule } from './modules/collection/collection.modules';
import { ProductModule } from './modules/product/product.modules';
import { UserModule } from './modules/user/user.modules';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: './config/.development.env'}),
    UserModule, 
    ProductModule,
    CollectionModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: process.env.JWT_EXPIRE } })],
  controllers: [AppController],
  providers: [],
  exports: [PassportModule, JwtModule],
})
export class AppModule {}
