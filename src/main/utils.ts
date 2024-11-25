import { is } from '@electron-toolkit/utils'
import { join } from 'path'

export const loadWindowContents = (win: Electron.BrowserWindow, file: string): void => {
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/' + file)
  } else {
    win.loadFile(join(__dirname, '../renderer/' + file))
  }
}
