<script lang="ts">
  import { useRTCPeerConnection } from './stores'
  import { createOfferUrl } from './Utils'
  const pc = useRTCPeerConnection()
  export async function CreateOfferUrl(): Promise<string> {
    const desc = await $pc.createOffer()
    await $pc.setLocalDescription(desc)
    return createOfferUrl($pc.localDescription)
  }
  export async function CreateRemoteOfferUrl(): Promise<string> {
    const desc = await $pc.createOffer()
    await $pc.setLocalDescription(desc)
    return createOfferUrl($pc.localDescription)
  }
  export async function Connect(connectionString: string): Promise<void> {
    const desc = new RTCSessionDescription({ type: 'offer', sdp: connectionString })
    await $pc.setRemoteDescription(desc)
    const answer = await $pc.createAnswer()
    await $pc.setLocalDescription(answer)
  }
</script>
