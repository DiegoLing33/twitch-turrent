import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery } from '@nestjs/swagger'
import { v4 } from 'uuid'
import { DonationDto } from '../dtos'
import { DonationStatus } from '../entities'
import { DonationsService } from '../services'

@Controller('donations')
export class DonationsController {
  public constructor(private readonly donations: DonationsService) {}

  @Post('/create')
  @ApiOperation({ summary: 'Создает пожертвование' })
  public async create(@Body() payload: DonationDto) {
    return this.donations.createDonation(v4(), payload)
  }

  @ApiOperation({ summary: 'Получает последние 10 пожертвований' })
  @Get('last10')
  @ApiQuery({ enum: DonationStatus, name: 'status' })
  public async getLast10Items(@Query('status') status: DonationStatus) {
    return await this.donations.getLastItems(status)
  }

  @ApiOperation({ summary: 'Сбрасывает пожертвования в процессинге в статус ожидания' })
  @Post('cancel-processing')
  public async resetAllToPendingStatus() {
    return await this.donations.resetAllToPendingStatus()
  }
}
