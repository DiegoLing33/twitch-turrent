import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DonationsController } from './controllers'
import { DonationEntity } from './entities'
import { DonationsService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([DonationEntity])],
  providers: [DonationsService],
  controllers: [DonationsController],
  exports: [DonationsService],
})
export class DonationsModule {}
