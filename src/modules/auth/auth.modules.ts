import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infrastructure/database/database.modules';
import { AuthService } from './auth.service';


@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [AuthService],
})

export class AuthModule {}