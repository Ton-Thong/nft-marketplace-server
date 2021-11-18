import { Module } from '@nestjs/common';
import { AWSProviders } from './aws.provider';

@Module({
  providers: [...AWSProviders],
  exports: [...AWSProviders],
})
export class AWSModules {}
