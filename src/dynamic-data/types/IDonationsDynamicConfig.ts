import { ApiProperty } from '@nestjs/swagger'

export type ConfigCurrency = 'rub' | 'usd'

export class IDonationsDynamicConfigItem {
  @ApiProperty({ default: 1000 })
  from: number

  @ApiProperty({ default: 1500 })
  to: number

  @ApiProperty({ default: 'python3 scripts/1.py' })
  execute: string

  @ApiProperty({ default: 'rub' })
  currency: string

  @ApiProperty({ default: true })
  enabled: boolean
}
