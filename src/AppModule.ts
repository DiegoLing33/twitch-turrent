import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { DonationAlertsModule } from './donationalerts'
import { DonationsModule } from './donations'
import { DynamicDataModule } from './dynamic-data'
import { GoalsModule } from './goals'
import { convigJsonLoader } from './loaders'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [convigJsonLoader()],
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*Entity{.ts,.js}'],
      synchronize: true,
    }),
    DonationsModule,
    DynamicDataModule,
    DonationAlertsModule,
    GoalsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
