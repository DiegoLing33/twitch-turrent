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
  rules: IRules
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

function validateRules(rules: IRules): boolean {
  // если rules не key: value, то выкинуть ошибку
  if (typeof rules !== 'object' || Array.isArray(rules)) {
    throw new Error(
      `Правила должны быть объектом с ключами-валютами и значениями-правилами, например, { "usd": [ ... ], "rub": [ ... ]} (${JSON.stringify(rules)})`,
    )
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

  if (!validateRules(config.rules)) {
    throw new Error('Правила должны быть объектом с ключами-валютами и значениями-правилами')
  }

  for (const [currency, rules] of Object.entries(config.rules)) {
    if (!Array.isArray(rules)) {
      throw new Error(`Правила для валюты ${currency} должны быть массивом`)
    }
    for (const rule of rules) {
      validateRule(rule)
    }
  }

  return config
}
