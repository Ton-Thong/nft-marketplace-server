import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { AuthJwtStrategy } from '../auth/auth.jwt.strategy';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { FileService } from '../miscellaneous/file.service';

@Module({
  imports: [
    AWSModules,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.JWTKEY || config.secret, signOptions: { expiresIn: config.expire } })],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, AuthJwtStrategy, UserService, UserRepository, FileService],
})

export class ProductModule { }