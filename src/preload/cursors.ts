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
  ping: () => void
  getId: () => string
  getRootEl: () => HTMLDivElement
  getCursorEl: () => HTMLOrSVGElement
  getNameEl: () => HTMLSpanElement
  getName: () => string
  getData: () => RemoteCursorData
  update: (data: RemoteCursorData) => void
}

const remoteCursors: RemoteCursor[] = []

const domParser = new DOMParser()

class Cursor {
  private root = document.createElement('div')
  private cursorEl = document.createElement('svg')
  private pingEl = document.createElement('div')
  private nameEl = document.createElement('span')
  private data: RemoteCursorData
  constructor(data: RemoteCursorData) {
    this.data = data
    this.cursorEl = domParser.parseFromString(cursorSvg, 'image/svg+xml').documentElement
    this.root.classList.add('cursor')
    this.pingEl.classList.add('ping', 'is-hidden')
    this.nameEl.classList.add('name')
    this.pingEl.style.setProperty('--ping-color', data.color)
    this.cursorEl.style.setProperty('--cursor-color', data.color)
    this.nameEl.style.setProperty('--name-color', data.color)
    this.nameEl.innerText = data.name
    this.root.id = data.id
    this.root.appendChild(this.pingEl)
    this.root.appendChild(this.cursorEl)
    this.root.appendChild(this.nameEl)
  }
  ping = (): void => {
    this.pingEl.classList.toggle('is-hidden')
    setTimeout(() => {
      this.pingEl.classList.toggle('is-hidden')
    }, 1000)
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

ipcRenderer.on('remoteCursorPing', (_, cursorId) => {
  remoteCursors.find((c) => c.getId() === cursorId)?.ping()
})
