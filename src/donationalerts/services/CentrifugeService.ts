import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
// @ts-ignore
import { ConfigService } from '@nestjs/config'
import * as Centrifuge from 'centrifuge'
import { DonationsService } from 'src/donations'
import { GoalsService } from 'src/goals/services'
import { IConfig } from 'src/types'
import * as Websocket from 'ws'
import { ICentrifugeMessage, IDonationMessage, IGoalMessage } from '../types'
import { WidgetService } from './WidgetService'
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest

@Injectable()
export class CentrifugeService implements OnModuleInit, OnModuleDestroy {
  private centrifuge!: Centrifuge
  private clientId!: string

  private readonly logger = new Logger(CentrifugeService.name)
  public constructor(
    private readonly widgetService: WidgetService,
    private readonly donations: DonationsService,
    private readonly config: ConfigService<IConfig>,
    private readonly goalsService: GoalsService,
  ) {}

  async onModuleInit() {
    const token = await this.widgetService.getAccessToken()
    const widget = await this.widgetService.getWidget()
    const config = this.config.getOrThrow('centrifuge', { infer: true })
    if (!config.enabled) {
      this.logger.warn('Centrifuge is disabled in the configuration, skipping initialization.')
      return
    }

    this.centrifuge = new Centrifuge(config.endpoint, {
      websocket: Websocket,
      subscribeEndpoint: config.subscribeEndpoint,
      subscribeHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: false,
    })

    this.centrifuge.on('connect', ctx => {
      this.clientId = ctx.client
      this.logger.log(`Connected to Centrifuge, client ID = ${this.clientId}`)

      this.centrifuge.subscribe(`$alerts:donation_${widget.id}`, async message => {
        const event = message as ICentrifugeMessage<IDonationMessage>
        const donation = event.data

        this.logger.log(
          `Received donation event: id = ${donation.id}, amount = ${donation.amount}, user = ${donation.username}`,
        )

        try {
          await this.donations.createDonation(donation.id.toString(), donation)
        } catch (error) {
          if (String(error.message).includes('UNIQUE constraint failed')) return
          this.logger.warn('Error saving donation to database:', error.message)
        }
      })

      this.centrifuge.subscribe(`$goals:goal_${widget.id}`, async message => {
        const event = message as ICentrifugeMessage<IGoalMessage>
        this.logger.log(JSON.stringify(message))
        try {
          await this.goalsService.createGoal(event.data)
        } catch (error) {
          this.logger.warn('Error saving goal to database:', error.message)
        }
      })
    })

    this.centrifuge.on('disconnect', ctx => {
      this.logger.log(`Disconnected from Centrifuge: [${ctx.code}] ${ctx.reason}`)
    })

    this.centrifuge.setToken(widget.socket_connection_token)
    this.centrifuge.connect()
  }

  onModuleDestroy() {
    if (this.centrifuge) {
      this.centrifuge.disconnect()
      this.logger.log('Disconnected from Centrifuge')
    }
  }
}
