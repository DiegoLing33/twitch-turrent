import { Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs/promises'
import * as path from 'path'
import { cwd } from 'process'
import { IDonationsDynamicConfigItem } from '../types'

@Injectable()
export class DynamicDataService {
  private readonly logger = new Logger(DynamicDataService.name)
  public constructor() {}

  getWorkingPath() {
    return path.resolve(cwd(), 'config')
  }

  async readJSONData<T = unknown>(filename: string): Promise<T> {
    const filePath = path.join(this.getWorkingPath(), filename)
    try {
      const data = await fs.readFile(filePath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      this.logger.error(`Failed to read JSON data from ${filePath}`, error)
      throw error
    }
  }

  async readDonationsConfig() {
    return this.readJSONData<IDonationsDynamicConfigItem[]>('donations.json')
  }

  async saveJSONData(filename: string, data: any) {
    const filePath = path.join(this.getWorkingPath(), filename)
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
      this.logger.log(`Data saved to ${filePath}`)
      return data
    } catch (error) {
      this.logger.error(`Failed to save JSON data to ${filePath}`, error)
      throw error
    }
  }

  async saveDonationsConfig(data: IDonationsDynamicConfigItem[]) {
    return await this.saveJSONData('donations.json', data)
  }
}
