import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { UserDaoProvider } from './user.dao';
import { UserServiceProvider } from './user.service';
import { FileService } from '../miscellaneous/file.service';

@Module({
  imports: [AWSModules],
  controllers: [UserController],
  providers: [FileService, UserServiceProvider, UserDaoProvider],
})

export class UserModule { }