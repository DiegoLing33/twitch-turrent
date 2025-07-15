import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { DonationsService } from 'src/donations'
import { QueueService } from './QueueService'

@Injectable()
export class ResolverService implements OnModuleInit {
  private readonly logger = new Logger(ResolverService.name)
  public constructor(
    private readonly donations: DonationsService,
    private readonly queueService: QueueService,
  ) {}

  async onModuleInit() {
    this.logger.log('ResolverService initialized')
    await this.donations.resetAllToPendingStatus()
    setTimeout(() => this.queueService.next(), 0)
  }
}
