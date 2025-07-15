import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { DonationAlertsModule } from './donationalerts'
import { convigJsonLoader } from './loaders'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [convigJsonLoader()],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'client'),
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*Entity{.ts,.js}'],
      synchronize: true,
    }),
    DonationAlertsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
