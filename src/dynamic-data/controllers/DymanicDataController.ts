import { Body, Controller, Get, Post } from '@nestjs/common'
import { DynamicDataService } from '../services'
import { IDonationsDynamicConfigItem } from '../types'

@Controller(`dynamic-data`)
export class DymanicDataController {
  constructor(private readonly dynamicDataService: DynamicDataService) {}

  @Get('/donations-config')
  async getDonations() {
    return this.dynamicDataService.readDonationsConfig()
  }

  @Post('/donations-config')
  async saveDonationsConfig(@Body() data: IDonationsDynamicConfigItem[]) {
    return this.dynamicDataService.saveDonationsConfig(data)
  }
}
