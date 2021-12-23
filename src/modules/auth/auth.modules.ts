import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserServiceProvider } from '../user/user.service';
import { AuthJwtStrategy } from './auth.jwt.strategy';

import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { UserDaoProvider } from '../user/user.dao';
import { UserModel } from 'src/models/user.model';
@Module({
    imports: [AWSModules],
    controllers: [AuthController],
    providers: [AuthService, AuthJwtStrategy, UserModel, UserDaoProvider, UserServiceProvider]
})

export class AuthModule { } 