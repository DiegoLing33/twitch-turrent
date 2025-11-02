import { Body, Controller, Get, Post } from '@nestjs/common'
import { DynamicDataService } from '../services'
import { IDonationsDynamicConfigItem, IGoalsDynamicConfigItem } from '../types'

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

  @Get('/goals-config')
  async getGoals() {
    return this.dynamicDataService.readGoalsConfig()
  }

  @Post('/goals-config')
  async saveGoalsConfig(@Body() data: IGoalsDynamicConfigItem[]) {
    return this.dynamicDataService.saveGoalsConfig(data)
  }
}
