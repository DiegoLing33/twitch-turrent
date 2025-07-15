import { Module } from '@nestjs/common'
import { DonationsModule } from 'src/donations'
import { QueueController } from './controllers'
import { QueueService, ResolverService } from './services'

@Module({
  imports: [DonationsModule],
  providers: [ResolverService, QueueService],
  exports: [QueueService],
  controllers: [QueueController],
})
export class ResolverModule {}
