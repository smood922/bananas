<script lang="ts">
  import type { RTCSessionDescriptionOptions } from './Utils'
  import type { BananasRemoteCursorData } from './BananasTypes'
  import { getConnectionString, ConnectionType } from './Utils'
  import { RTCPeerConnectionConfig } from './Config'

  const errorHander = (e: ErrorEvent): void => {
    console.error(e)
  }

  let remoteVideo: HTMLVideoElement | null = null
  let pc: RTCPeerConnection | null = null
  let remoteCursorPositionsEnabled = false
  let remoteMouseCursorPositionsChannel: RTCDataChannel | null = null

  const remoteMouseCursorPositionsChannelIsReady = (): boolean => {
    if (!remoteMouseCursorPositionsChannel) return false
    if (remoteMouseCursorPositionsChannel.readyState === 'open') return true
    return false
  }

  const setupDataChannels = (dc: RTCDataChannel): void => {
    remoteMouseCursorPositionsChannel = dc
    dc.onopen = function (e: MessageEvent): void {
      console.log('remoteMouseCursorPositions channel open', e)
    }
    dc.onclose = function (): void {
      console.log('remoteMouseCursorPositions channel close')
    }
    dc.onmessage = function (e: MessageEvent): void {
      if (!remoteCursorPositionsEnabled) return
      if (remoteVideo) return
      const data = JSON.parse(e.data)
      window.BananasApi.updateRemoteCursor(data)
    }
  }
  export async function UpdateRemoteCursor(cursorData: BananasRemoteCursorData): Promise<void> {
    if (!remoteMouseCursorPositionsChannelIsReady()) {
      console.error('remoteMouseCursorPositionsChannel not ready')
      return
    }
    remoteMouseCursorPositionsChannel.send(JSON.stringify(cursorData))
  }
  export function ToggleRemoteCursors(enabled: boolean): boolean {
    if (!remoteMouseCursorPositionsChannel) return false
    if (remoteMouseCursorPositionsChannel.readyState !== 'open') return false
    remoteCursorPositionsEnabled = enabled
    return enabled
  }
  export async function Setup(v: HTMLVideoElement = null): Promise<void> {
    remoteVideo = v
    pc = new RTCPeerConnection(RTCPeerConnectionConfig)
    pc.ondatachannel = (e: RTCDataChannelEvent): void => {
      if (e.channel.label === 'remoteMouseCursorPositions') {
        setupDataChannels(e.channel)
      }
    }
    pc.ontrack = (evt): void => {
      console.log('ontrack', evt.streams)
      if (remoteVideo) {
        evt.streams[0].getVideoTracks().forEach((track) => {
          track.enabled = true
        })
        remoteVideo.srcObject = evt.streams[0]
      }
    }
    pc.onicecandidate = function (e: RTCPeerConnectionIceEvent): void {
      const cand = e.candidate
      if (!cand) {
        console.log('icecandidate gathering: complete')
      } else {
        console.log('new icecandidate')
      }
    }
    pc.oniceconnectionstatechange = function (): void {
      console.log('iceconnectionstatechange')
    }
    if (!remoteVideo) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        })
        for (const track of stream.getTracks()) {
          pc.addTrack(track, stream)
        }
      } catch (e) {
        errorHander(e)
      }
    }
  }
  export async function CreateParticipantUrl(c: RTCSessionDescriptionOptions): Promise<string> {
    try {
      const desc = new RTCSessionDescription(c)
      await pc.setRemoteDescription(desc)
      if (desc.type === 'offer') {
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
      }
    } catch (e) {
      errorHander(e)
    }
    return getConnectionString(ConnectionType.PARTICIPANT, pc.localDescription)
  }
  export async function CreateHostUrl(): Promise<string> {
    remoteMouseCursorPositionsChannel = pc.createDataChannel('remoteMouseCursorPositions')
    setupDataChannels(remoteMouseCursorPositionsChannel)
    const desc = await pc.createOffer()
    await pc.setLocalDescription(desc)
    return getConnectionString(ConnectionType.HOST, pc.localDescription)
  }
  export async function Connect(c: RTCSessionDescriptionOptions): Promise<void> {
    try {
      const desc = new RTCSessionDescription(c)
      await pc.setRemoteDescription(desc)
      if (desc.type === 'offer') {
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
      }
    } catch (e) {
      errorHander(e)
    }
  }
  export async function Disconnect(): Promise<void> {
    try {
      pc.close()
    } catch (e) {
      errorHander(e)
    }
  }
</script>
