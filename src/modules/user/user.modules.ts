import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { UserModel } from 'src/models/user.model';
import { UserDaoProvider } from './user.dao';
import { UserServiceProvider } from './user.service';

@Module({
  imports: [AWSModules],
  controllers: [UserController],
  providers: [UserServiceProvider, UserDaoProvider, UserModel],
})

export class UserModule {}