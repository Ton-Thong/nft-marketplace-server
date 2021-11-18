import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { AuthJwtStrategy } from './auth.jwt.strategy';
import { config } from 'src/config';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';

@Module({
    imports: [
        AWSModules,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secret: process.env.JWTKEY || config.secret, signOptions: { expiresIn: config.expire } })
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, UserRepository, AuthJwtStrategy],
    exports: [AuthJwtStrategy, PassportModule]
})

export class AuthModule { } 