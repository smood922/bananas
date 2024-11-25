import { ipcRenderer } from 'electron'
import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const cursors: HTMLDivElement[] = []

ipcRenderer.on('updateRemoteCursor', (_, data) => {
  const cursor = cursors.find((c) => c.id === data.id) ?? document.createElement('div')
  if (!cursor.id) {
    cursor.id = data.id
    cursor.className = 'cursor'
    cursor.style.backgroundColor = data.color
  }
  cursor.style.left = `${data.x}px`
  cursor.style.top = `${data.y}px`
  ipcRenderer.invoke('updateRemoteCursorReceived', data)
})

const BananasApi = {
  getSettings: async (): Promise<{ username: string; color: string }> => {
    return await ipcRenderer.invoke('getSettings')
  },
  updateSettings: async (settings: { username: string; color: string }): Promise<void> => {
    ipcRenderer.invoke('updateSettings', settings)
  },
  toggleRemoteCursors: async (state: boolean): Promise<void> => {
    ipcRenderer.invoke('toggleRemoteCursors', state)
  },
  updateRemoteCursor: async (state: {
    id: string
    name: string
    color: string
    x: number
    y: number
  }): Promise<void> => {
    ipcRenderer.invoke('updateRemoteCursor', state)
  }
}

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('BananasApi', BananasApi)
} catch (error) {
  console.error(error)
}
