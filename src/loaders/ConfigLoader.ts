import { readFileSync } from 'fs'
import * as path from 'path'
import { IConfig, validateConfig } from 'src/types'

export function convigJsonLoader() {
  return () => {
    const config = JSON.parse(
      readFileSync(path.resolve(process.cwd(), 'config', 'config.json'), 'utf-8'),
    ) as object as IConfig
    return validateConfig(config)
  }
}
