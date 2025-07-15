import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { IConfig } from 'src/types'
import { Repository } from 'typeorm'
import { DonationDto } from '../dtos'
import { DonationEntity, DonationStatus } from '../entities'

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name)
  public constructor(
    @InjectRepository(DonationEntity)
    private readonly donationsRepository: Repository<DonationEntity>,
    private readonly config: ConfigService<IConfig>,
  ) {}

  public async getLastItems(status: DonationStatus) {
    return await this.donationsRepository.find({
      where: { status },
      order: {
        createdAt: 'ASC',
      },
      take: 10,
    })
  }

  public async hasInProgressDonations() {
    this.logger.log('Checking for in progress donations')
    const count = await this.donationsRepository.count({
      where: { status: DonationStatus.IN_PROGRESS },
    })
    return count > 0
  }

  public async resetAllToPendingStatus() {
    this.logger.log('Setting all donations to pending status')
    const result = await this.donationsRepository.update(
      { status: DonationStatus.IN_PROGRESS },
      { status: DonationStatus.PENDING },
    )
    return result
  }

  public async setDonationToInProgressStatus(id: string) {
    this.logger.log('Setting donation to in progress status')
    const result = await this.donationsRepository.update({ id }, { status: DonationStatus.IN_PROGRESS })
    return result
  }

  public async setDonationToCompletedStatus(id: string) {
    this.logger.log('Setting donation to success status')
    const result = await this.donationsRepository.update({ id }, { status: DonationStatus.COMPLETED })
    return result
  }

  public findRuleForAmount(a: number | string, c: string) {
    const amount = formatAmount(String(a))
    const rules = this.config.getOrThrow('rules', { infer: true })
    const currency = c.toLowerCase()
    const currencyRules = rules[currency]

    return currencyRules
      .filter(it => it.enabled)
      .find(rule => {
        const from = formatAmount(String(rule.from))
        const to = formatAmount(String(rule.to))
        return amount >= from && amount <= to
      })
  }

  /**
   * Creates a donation in the database
   * @param event The donation event
   */
  public async createDonation(donationId: string, event: DonationDto) {
    const rule = this.findRuleForAmount(event.amount, event.currency)

    if (!rule) {
      this.logger.log(`Donation amount not in rules list, ignoring: ${event.amount}`)
      return null
    }

    const entity = this.donationsRepository.create({
      eventId: donationId,
      username: event.username,
      amount: event.amount,
      currency: event.currency.toLowerCase(),
      type: event.currency,
      status: DonationStatus.PENDING,
      message: event.message,
    })

    const result = await this.donationsRepository.save(entity)
    this.logger.log(`Saved donation to database ${JSON.stringify(result)}`)

    return result
  }
}

function formatAmount(amount: string): number {
  const parsedAmount = parseFloat(amount.replace(',', '.'))
  if (isNaN(parsedAmount)) {
    throw new Error(`Invalid amount: ${amount}`)
  }
  return parseFloat(parsedAmount.toFixed(2))
}
