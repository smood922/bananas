<script lang="ts">
  import { getConnectionString, ConnectionType } from './Utils'
  import { RTCPeerConnectionConfig } from './Config'
  const errorHander = (e: ErrorEvent): void => {
    console.error(e)
  }
  let remoteVideo: HTMLVideoElement | null = null
  let pc: RTCPeerConnection | null = null
  export async function Setup(v: HTMLVideoElement = null): Promise<void> {
    remoteVideo = v
    pc = new RTCPeerConnection(RTCPeerConnectionConfig)
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
  // export async function CreateParticipantUrl(): Promise<string> {
  //   const desc = await pc.createOffer()
  //   await pc.setLocalDescription(desc)
  //   return getConnectionString(ConnectionType.PARTICIPANT, pc.localDescription)
  // }
  export async function CreateParticipantUrl(c: RTCSessionDescriptionInit): Promise<string> {
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
    const desc = await pc.createOffer()
    await pc.setLocalDescription(desc)
    return getConnectionString(ConnectionType.HOST, pc.localDescription)
  }
  export async function Connect(c: RTCSessionDescriptionInit): Promise<void> {
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
