import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserServiceProvider } from '../user/user.service';
import { AuthJwtStrategy } from './auth.jwt.strategy';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { UserDaoProvider } from '../user/user.dao';
import { FileService } from '../miscellaneous/file.service';
@Module({
    imports: [AWSModules],
    controllers: [AuthController],
    providers: [FileService, AuthService, AuthJwtStrategy, UserDaoProvider, UserServiceProvider]
})

export class AuthModule { } 