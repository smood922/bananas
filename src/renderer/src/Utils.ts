export const mayBeConnectionString = (str: string): boolean => {
  try {
    const url = new URL(str)
    if (url.protocol !== 'bananas:') return false
    if (url.pathname !== '//offer') return false
    const hash = url.hash.slice(1)
    JSON.parse(atob(hash))
    return true
  } catch (err) {
    return false
  }
}

export const createOfferUrl = (offer: RTCSessionDescriptionInit): string => {
  const path = btoa(JSON.stringify(offer))
  return 'bananas://offer#' + path
}

export const getOfferFromUrl = (url: string): RTCSessionDescriptionInit => {
  const hash = new URL(url).hash.slice(1)
  return JSON.parse(atob(hash))
}
