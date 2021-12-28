import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { CollectionController } from './collection.controller';
import { CollectionDaoProvider } from './collection.dao';
import { CollectionServiceProvider } from './collection.service';

@Module({
  imports: [AWSModules],
  controllers: [CollectionController],
  providers: [CollectionServiceProvider, CollectionDaoProvider],
})

export class CollectionModule { }