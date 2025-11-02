import { ApiProperty } from '@nestjs/swagger'

export class IGoalsDynamicConfigItem {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ default: 'python3 scripts/1.py' })
  execute: string

  @ApiProperty({ default: true })
  enabled: boolean
}
