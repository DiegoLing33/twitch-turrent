import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { connect, Socket } from 'socket.io-client'
import { DonationDto, DonationsService } from 'src/donations'
import { QueueService } from 'src/resolver/services'
import { IConfig } from 'src/types'

@Injectable()
export class DonationAlertsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DonationAlertsService.name)
  private socket: Socket
  public constructor(
    private readonly config: ConfigService<IConfig>,
    private readonly donations: DonationsService,
    private readonly queueService: QueueService,
  ) {}

  private createSocket() {
    let eventId = 0
    this.logger.log('Creating socket')
    this.socket = connect('wss://socket.donationalerts.ru:443', {
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      this.logger.log('Socket connected')

      this.socket.emit('add-user', {
        token: this.config.getOrThrow('token'),
        type: 'minor',
      })

      this.socket.emit('donation')
    })

    this.socket.on('disconnect', () => {
      this.logger.log('Socket disconnected')
    })

    this.socket.on('connect_error', error => {
      this.logger.error('Socket connection error:', error)
    })

    this.socket.on('connect_timeout', error => {
      this.logger.error('Socket connection timeout:', error)
    })

    this.socket.on('donation', async msg => {
      const donation = JSON.parse(msg) as DonationDto & { id: number }

      try {
        const result = await this.donations.createDonation(donation.id.toString(), donation)
        if (result) setTimeout(() => this.queueService.next(), 0)
      } catch (error) {
        if (String(error.message).includes('UNIQUE constraint failed')) return
        this.logger.warn('Error saving donation to database:', error.message)
      }
    })
  }

  onModuleInit() {
    this.createSocket()
  }

  onModuleDestroy() {
    if (this.socket) {
      this.socket.disconnect()
      this.logger.log('Socket disconnected')
    }
  }
}
