import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FilesModule } from './files/files.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [FilesModule, ConfigModule.forRoot({isGlobal:true}), PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
