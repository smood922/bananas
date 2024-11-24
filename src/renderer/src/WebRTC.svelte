<script lang="ts">
  import { useRTCPeerConnection } from './stores'
  import { getConnectionString, ConnectionType } from './Utils'
  const errorHander = (e: ErrorEvent): void => {
    console.error(e)
  }
  let video: HTMLVideoElement | null = null
  let STREAM: MediaStream | null = null
  const pc = useRTCPeerConnection()
  $pc.ontrack = (e: RTCTrackEvent): void => {
    console.log('ontrack', e.streams[0])
    if (video) video.srcObject = e.streams[0]
  }
  $pc.onicecandidate = function (e: RTCPeerConnectionIceEvent): void {
    const cand = e.candidate
    if (!cand) {
      console.log('icecandidate gathering: complete')
    } else {
      console.log('new icecandidate')
    }
  }
  $pc.oniceconnectionstatechange = function (): void {
    console.log('iceconnectionstatechange')
  }
  export function SetVideoElement(node: HTMLVideoElement): void {
    video = node
  }
  export async function CreateParticipantUrl(): Promise<string> {
    const desc = await $pc.createOffer()
    await $pc.setLocalDescription(desc)
    return getConnectionString(ConnectionType.PARTICIPANT, $pc.localDescription)
  }
  export async function CreateHostUrl(): Promise<string> {
    const desc = await $pc.createOffer()
    await $pc.setLocalDescription(desc)
    return getConnectionString(ConnectionType.HOST, $pc.localDescription)
  }
  export async function Connect(c: RTCSessionDescriptionInit): Promise<void> {
    try {
      const desc = new RTCSessionDescription(c)
      await $pc.setRemoteDescription(desc)
      if (desc.type === 'offer') {
        const answer = await $pc.createAnswer()
        await $pc.setLocalDescription(answer)
        console.log({ video })
        console.log({ STREAM })
      }
    } catch (e) {
      errorHander(e)
    }
  }
  export async function Disconnecontrackt(): Promise<void> {
    try {
      $pc.close()
    } catch (e) {
      errorHander(e)
    }
  }
  export async function AddStream(): Promise<void> {
    try {
      STREAM = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      })
      const stream = STREAM
      stream.getTracks().forEach((track) => {
        $pc.addTrack(track, stream)
      })
    } catch (e) {
      errorHander(e)
    }
  }
</script>
