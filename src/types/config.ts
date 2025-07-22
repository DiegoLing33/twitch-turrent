export interface IRule {
  from: number
  to: number
  enabled: boolean
  execute: string
}

export type ICurrency = string
export type IRules = Record<ICurrency, IRule[]>

export interface IConfig {
  token: string
  centrifuge: {
    enabled: boolean
    endpoint: string
    subscribeEndpoint: string
  }
}

function validateRule(rule: IRule): boolean {
  if (rule.from === undefined || rule.to === undefined) {
    throw new Error(`Правило должно содержать поля from и to (${JSON.stringify(rule)})`)
  }

  if (rule.from > rule.to) {
    throw new Error(`Поле from не может быть больше поля to (${JSON.stringify(rule)})`)
  }

  if (isNaN(rule.from) || isNaN(rule.to)) {
    throw new Error(`Поля from и to должны быть числами (${JSON.stringify(rule)})`)
  }

  if (rule.from < 0 || rule.to < 0) {
    throw new Error(`Поля from и to не могут быть отрицательными (${JSON.stringify(rule)})`)
  }

  if (!rule.execute) {
    throw new Error(`Поле execute не может быть пустым (${JSON.stringify(rule)})`)
  }

  return true
}

function validateToken(token: string): boolean {
  if (!token) {
    throw new Error('Токен не может быть пустым')
  }
  return true
}

export function validateConfig(config: IConfig): IConfig {
  if (!config) {
    throw new Error('Конфигурация не может быть пустой')
  }

  if (!validateToken(config.token)) {
    throw new Error('Токен не может быть пустым')
  }

  return config
}
