<script lang="ts">
  import { onMount } from 'svelte'
  import { mayBeConnectionString, getOfferFromUrl, ConnectionType } from './Utils'
  import WebRTC from './WebRTC.svelte'
  let webRTCComponent: WebRTC
  let connectionStringInput: HTMLInputElement
  let connectionStringInputSuccess: HTMLParagraphElement
  let connectionStringInputError: HTMLParagraphElement
  let connectionStringInputIcon: HTMLElement
  let connectButton: HTMLButtonElement
  let copyButton: HTMLButtonElement
  let remoteScreenContainer: HTMLDivElement
  let remoteScreen: HTMLVideoElement

  onMount(() => {
    webRTCComponent.SetVideoElement(remoteScreen)
    connectionStringInput.addEventListener('input', () => {
      connectionStringInput.classList.remove('is-danger', 'is-success')
      connectionStringInputIcon.classList.remove('fa-question', 'fa-check', 'fa-times')
      if (mayBeConnectionString(ConnectionType.HOST, connectionStringInput.value)) {
        connectionStringInputSuccess.classList.remove('is-hidden')
        connectionStringInputError.classList.add('is-hidden')
        connectButton.disabled = false
        connectionStringInput.classList.add('is-success')
        connectionStringInputIcon.classList.add('fa-check')
      } else {
        connectionStringInput.classList.add('is-danger')
        connectionStringInputSuccess.classList.add('is-hidden')
        connectionStringInputError.classList.remove('is-hidden')
        connectionStringInputIcon.classList.add('fa-times')
        connectButton.disabled = true
      }
    })
    connectButton.addEventListener('click', async () => {
      const offer = getOfferFromUrl(connectionStringInput.value)
      await webRTCComponent.Connect(offer)
      remoteScreenContainer.classList.remove('is-hidden')
    })
    copyButton.addEventListener('click', async () => {
      copyButton.classList.add('is-loading')
      const offer = await webRTCComponent.CreateParticipantUrl()
      navigator.clipboard.writeText(offer)
      setTimeout(() => {
        copyButton.classList.remove('is-loading')
      }, 400)
    })
  })
</script>

<WebRTC bind:this={webRTCComponent} />

<div class="container p-5">
  <h1 class="title">Join a session</h1>
  <div class="form">
    <div class="field">
      <div class="control">
        <button class="button is-link" bind:this={copyButton}>Copy my connection string</button>
      </div>
    </div>

    <div class="field">
      <label class="label" for="remote_connection_string">Host connection string</label>
      <div class="control has-icons-left has-icons-right">
        <input
          bind:this={connectionStringInput}
          class="input"
          type="text"
          id="remote_connection_string"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon is-small is-right">
          <i bind:this={connectionStringInputIcon} class="fas fa-question"></i>
        </span>
      </div>
      <p class="help is-success is-hidden" bind:this={connectionStringInputSuccess}>
        Connection string seems valid.
      </p>
      <p class="help is-danger is-hidden" bind:this={connectionStringInputError}>
        Connection string seems invalid.
      </p>
    </div>

    <div class="field">
      <div class="control">
        <button class="button is-link" bind:this={connectButton} disabled>Connect</button>
      </div>
    </div>
  </div>

  <div bind:this={remoteScreenContainer} class="field is-hidden">
    <label class="label" for="remote_screen">Remote screen</label>
    <div class="control">
      <video
        bind:this={remoteScreen}
        id="remote_screen"
        class="video"
        controls
        autoplay
        playsinline
        muted
      ></video>
    </div>
  </div>
</div>

<style>
  .video {
    width: 100%;
    height: auto;
  }
</style>
