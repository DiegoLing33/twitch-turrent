import { Controller, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { QueueService } from '../services'

@Controller('queue')
export class QueueController {
  public constructor(private readonly queueService: QueueService) {}

  @ApiOperation({ summary: 'Запускает обработку очереди' })
  @Post('next')
  public async next() {
    setTimeout(() => this.queueService.next(), 0)
    return true
  }
}
