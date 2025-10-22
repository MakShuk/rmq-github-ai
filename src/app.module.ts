import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfigModuleOptions } from './configs/config/config.module';
import { AppService } from './app.service';
import { AppController } from 'app.controller';


@Module({
  imports: [ConfigModule.forRoot(getConfigModuleOptions())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
