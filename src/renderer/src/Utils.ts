export const enum ConnectionType {
  HOST = 'host',
  PARTICIPANT = 'participant'
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
