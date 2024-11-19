import type { Writable } from 'svelte/store'
import { useWritable } from './UseSharedStore'
import { RTCPeerConnectionConfig } from './Config'

export const useActiveView = (): Writable<string> => useWritable('activeView', 'join')

export const useRTCPeerConnection = (): Writable<RTCPeerConnection> =>
  useWritable('RTCPeerConnection', new RTCPeerConnection(RTCPeerConnectionConfig))
