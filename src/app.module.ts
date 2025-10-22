import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { getConfigModuleOptions } from './configs/config/config.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { DocumentationModule } from './modules/documentation/documentation.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(getConfigModuleOptions()),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 минута
      limit: 60,  // 60 запросов в минуту
    }]),
    DocumentationModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
