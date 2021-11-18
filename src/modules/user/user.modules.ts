import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';

@Module({
  imports: [AWSModules],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})

export class UserModule {}