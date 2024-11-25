import { is } from '@electron-toolkit/utils'
import { join } from 'path'

export const getBasePath = (): string => {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    return process.env['ELECTRON_RENDERER_URL']
  } else {
    return join(__dirname, '../renderer')
  }
}
