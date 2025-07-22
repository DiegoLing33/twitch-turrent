import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { IConfig } from 'src/types'

export interface IWidgetInfo {
  id: number
  code: string
  name: string
  is_active: 1 | 0
  avatar: string
  language: 'ru_RU' | 'en_US' | string
  socket_connection_token: string
  timezone: string
  main_currency: 'RUB' | string
  token: string
  black_list_words: string[]
  adv_brands: string[]
}

@Injectable()
export class WidgetService {
  private readonly logger = new Logger(WidgetService.name)

  private _token?: string = undefined
  public constructor(private readonly config: ConfigService<IConfig>) {}

  async getAccessToken() {
    if (this._token) return this._token
    this.logger.log(`Receiving new access token for widget...`)
    const { data } = await axios.get<{ data: { token: string } }>(
      `https://www.donationalerts.com/api/v1/token/widget?token=${this.config.getOrThrow('token')}`,
    )

    this._token = data.data.token
    return this._token
  }

  async getWidget() {
    const token = await this.getAccessToken()
    const { data } = await axios.get<{ data: IWidgetInfo }>(`https://www.donationalerts.com/api/v1/user/widget`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data.data
  }
}
