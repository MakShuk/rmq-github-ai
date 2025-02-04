import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getConfigModuleOptions } from './configs/config/config.module';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { AppService } from './app.service';
import { AppController } from 'app.controller';


@Module({
  imports: [ConfigModule.forRoot(getConfigModuleOptions()), RMQModule.forRootAsync(getRMQConfig())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
