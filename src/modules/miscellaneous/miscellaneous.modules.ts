import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { FileService } from './file.service';

@Module({
  imports: [AWSModules],
  controllers: [],
  providers: [FileService],
})

export class UserModule {}