/// <reference types="vite/client" />
import { ipcRenderer } from 'electron'
import cursorSvg from './cursor.svg?raw'

type RemoteCursorData = {
  id: string
  name: string
  color: string
  x: number
  y: number
}

type RemoteCursor = {
  getId: () => string
  getRootEl: () => HTMLDivElement
  getCursorEl: () => HTMLOrSVGElement
  getNameEl: () => HTMLSpanElement
  getName: () => string
  getData: () => RemoteCursorData
  update: (data: RemoteCursorData) => void
}

const remoteCursors: RemoteCursor[] = []

class Cursor {
  private root = document.createElement('div')
  private cursorEl = document.createElement('svg')
  private nameEl = document.createElement('span')
  private data: RemoteCursorData
  constructor(data: RemoteCursorData) {
    this.data = data
    this.cursorEl = new DOMParser().parseFromString(cursorSvg, 'image/svg+xml').documentElement
    this.cursorEl.style.maxWidth = '24px'
    this.nameEl.innerText = data.name
    this.nameEl.style.textShadow = '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
    this.cursorEl.style.fill = data.color
    this.nameEl.style.color = data.color
    this.nameEl.innerText = data.name
    this.root.id = data.id
    this.root.style.position = 'absolute'
    this.root.style.width = '24px'
    this.root.style.height = '24px'
    this.root.appendChild(this.cursorEl)
    this.root.appendChild(this.nameEl)
  }
  getId = (): string => this.data.id
  getRootEl = (): HTMLDivElement => this.root
  getCursorEl = (): HTMLOrSVGElement => this.cursorEl
  getNameEl = (): HTMLSpanElement => this.nameEl
  getName = (): string => this.data.name
  getData = (): RemoteCursorData => this.data
  update = (data: RemoteCursorData): void => {
    this.data = data
    this.root.style.left = `${data.x - 24}px`
    this.root.style.top = `${data.y}px`
  }
}

ipcRenderer.on('updateRemoteCursor', (_, data) => {
  let cursor: RemoteCursor | undefined = remoteCursors.find((c) => c.getId() === data.id)
  if (cursor) {
    cursor.update(data)
  } else {
    cursor = new Cursor(data)
    remoteCursors.push(cursor)
    document.body.appendChild(cursor.getRootEl())
  }
})
