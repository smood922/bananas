<script lang="ts">
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  import Navigation from './Navigation.svelte'
  import { webRTC } from './WebRTC'

  const startFunc = async (): Promise<void> => {
    await webRTC({
      localVideo: document.getElementById('localVideo') as HTMLVideoElement,
      remoteVideo: document.getElementById('remoteVideo') as HTMLVideoElement,
      localOffer: document.getElementById('localOffer') as HTMLTextAreaElement,
      remoteOffer: document.getElementById('remoteOffer') as HTMLTextAreaElement,
      localOfferButton: document.getElementById('localOfferButton') as HTMLButtonElement,
      remoteOfferButton: document.getElementById('remoteOfferButton') as HTMLButtonElement
    })
  }
</script>

<div class="container">
  <Navigation />
  <h1 class="title">Join</h1>
  <button class="button" id="startButton" on:click={startFunc}>Start</button>
  <h2>Local</h2>
  <div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video width="250" id="localVideo" controls autoPlay />
    <textarea class="textarea" id="localOffer"></textarea>
    <button class="button" id="localOfferButton">CreateOffer</button>
  </div>
  <h2>Remote</h2>
  <div>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video width="250" id="remoteVideo" controls autoPlay />
    <textarea class="textarea" id="remoteOffer"></textarea>
    <button class="button" id="remoteOfferButton">Answer</button>
  </div>
</div>
