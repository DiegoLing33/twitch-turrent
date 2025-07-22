import { Module } from '@nestjs/common'
import { QueueController } from './controllers'
import { QueueService, ResolverService } from './services'

@Module({
  imports: [],
  providers: [ResolverService, QueueService],
  exports: [QueueService],
  controllers: [QueueController],
})
export class ResolverModule {}
