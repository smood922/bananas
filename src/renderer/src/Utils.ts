export const enum ConnectionType {
  HOST = 'host',
  PARTICIPANT = 'participant'
}

export type RTCSessionDescriptionOptions = RTCSessionDescriptionInit

export const getUUIDv4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const mayBeConnectionString = (ct: ConnectionType, str: string): boolean => {
  try {
    const url = new URL(str)
    if (url.protocol !== 'bananas:') return false
    if (url.pathname.slice(2) !== ct) return false
    const hash = url.hash.slice(1)
    JSON.parse(atob(hash))
    return true
  } catch (err) {
    return false
  }
}

export const getConnectionString = (
  ct: ConnectionType,
  offer: RTCSessionDescriptionInit
): string => {
  const path = btoa(JSON.stringify(offer))
  return `bananas://${ct}#${path}`
}

export const getOfferFromUrl = (url: string): RTCSessionDescriptionInit => {
  const hash = new URL(url).hash.slice(1)
  return JSON.parse(atob(hash))
}
