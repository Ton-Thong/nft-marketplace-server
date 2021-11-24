import { Module } from '@nestjs/common';
import { AWSModules } from 'src/infrastructure/AWS/aws.modules';
import { CollectionRepository } from './collection.repository';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

@Module({
  imports: [AWSModules],
  controllers: [CollectionController],
  providers: [CollectionService, CollectionRepository],
})

export class CollectionModule { }