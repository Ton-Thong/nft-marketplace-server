import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { UserDaoProvider } from './user.dao';
import { UserServiceProvider } from './user.service';
import { UserModel } from 'src/models/user.model';

@Module({
  imports: [AWSModules, UserModel],
  controllers: [UserController],
  providers: [UserServiceProvider, UserDaoProvider],
})

export class UserModule {}