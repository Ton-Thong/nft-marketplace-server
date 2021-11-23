import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { config } from 'src/config';
import { CollectionRepository } from './collection.repository';
import { AuthJwtStrategy } from '../auth/auth.jwt.strategy';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [
    AWSModules,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.JWTKEY || config.secret, signOptions: { expiresIn: config.expire } })],
  controllers: [CollectionController],
  providers: [CollectionService, CollectionRepository, AuthJwtStrategy, UserService, UserRepository],
})

export class CollectionModule { }