import { ApiProperty } from '@nestjs/swagger'

export class DonationDto {
  @ApiProperty({ example: 'SuperUser' })
  username: string

  @ApiProperty({ example: 1000 })
  amount: number

  @ApiProperty({ example: 'rub' })
  currency: string

  @ApiProperty({ example: '' })
  message: string
}
