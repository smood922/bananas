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

export const makeVideoDraggable = (video: HTMLVideoElement): void => {
  let startX: number
  let startY: number
  let initialX: number
  let initialY: number
  let isDragging = false
  video.addEventListener('mousedown', (e) => {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
    const transform = getComputedStyle(video).transform

    if (transform !== 'none') {
      const values = transform.split('(')[1].split(')')[0].split(',')
      initialX = parseFloat(values[4])
      initialY = parseFloat(values[5])
    } else {
      initialX = 0
      initialY = 0
    }
    video.style.cursor = 'grabbing'
  })
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    const moveX = initialX + deltaX
    const moveY = initialY + deltaY

    video.style.transform = `translate(${moveX}px, ${moveY}px)`
  })

  document.addEventListener('mouseup', () => {
    if (!isDragging) return
    isDragging = false
    video.style.cursor = 'default'
  })
}
