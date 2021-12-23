import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { CollectionController } from './collection.controller';
import { CollectionModel } from 'src/models/collection.model';
import { CollectionDaoProvider } from './collection.dao';
import { CollectionServiceProvider } from './collection.service';

@Module({
  imports: [AWSModules],
  controllers: [CollectionController],
  providers: [CollectionServiceProvider, CollectionDaoProvider, CollectionModel],
})

export class CollectionModule { }