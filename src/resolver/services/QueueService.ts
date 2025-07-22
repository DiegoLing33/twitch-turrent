import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import * as child_process from 'child_process'
import { DonationsService, DonationStatus } from 'src/donations'

export const QUEUE_PING_EVENT = 'QUEUE_PING_EVENT'

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name)
  public constructor(private readonly donationsService: DonationsService) {}

  public async next() {
    if (await this.donationsService.hasInProgressDonations()) {
      this.logger.log('There are donations in progress')
      return
    }

    const items = await this.donationsService.getLastItems(DonationStatus.PENDING)
    if (items.length === 0) return

    const working = items[0]
    const rule = await this.donationsService.findRuleForAmount(working.amount, working.currency)

    if (!rule) {
      this.logger.error(`No rule found for donation ${working.id} (${JSON.stringify(working)})`)
      this.next()
      return
    }

    await this.donationsService.setDonationToInProgressStatus(working.id)
    this.logger.log(`Processing donation ${working.id}`)
    const processing = { ...working, status: DonationStatus.IN_PROGRESS }

    // Run working.execute, and when shell script is finished, set donation to completed status
    const command = rule.execute
    this.logger.log(`Running command: ${command}`)
    const child = child_process.exec(command, (error, stdout, stderr) => {
      if (error) {
        this.logger.error(`Error executing command: ${error.message}`)
        return
      }
      if (stderr) {
        this.logger.error(`Error executing command: ${stderr}`)
        return
      }
      this.logger.log(`Command output: ${stdout}`)
    })

    child.on('exit', async code => {
      this.logger.log(`Command exited with code ${code}`)

      if (code !== 0) {
        this.logger.error(`Error while processing donation ${processing.id} (${JSON.stringify(processing)})`)
        this.logger.error(`Command failed with code ${code}`)
        return
      }

      this.logger.log(`Command succeeded`)
      await this.donationsService.setDonationToCompletedStatus(processing.id)
      this.logger.log(`Donation ${processing.id} processed`)
      this.next()
    })
  }

  @OnEvent(QUEUE_PING_EVENT)
  public handlePingEvent() {
    this.logger.log('Ping event received')
    setTimeout(() => this.next(), 0)
  }
}
