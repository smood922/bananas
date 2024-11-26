<script lang="ts">
  import { onMount } from 'svelte'
  import {
    makeVideoDraggable,
    mayBeConnectionString,
    getOfferFromUrl,
    ConnectionType,
    getUUIDv4
  } from './Utils'
  import WebRTC from './WebRTC.svelte'
  let webRTCComponent: WebRTC
  let connectionStringInput: HTMLInputElement
  let connectionStringInputIcon: HTMLElement
  let connectButton: HTMLButtonElement
  let copyButton: HTMLButtonElement
  let remoteScreenContainer: HTMLDivElement
  let remoteScreen: HTMLVideoElement
  let connectionStringInputContainer: HTMLDivElement
  let UUID = getUUIDv4()
  let zoomFactor = 1

  onMount(async () => {
    const settings = await window.BananasApi.getSettings()
    makeVideoDraggable(remoteScreen)
    connectionStringInput.addEventListener('input', () => {
      connectionStringInput.classList.remove('is-danger', 'is-success')
      connectionStringInputIcon.classList.remove('fa-question', 'fa-check', 'fa-times')
      if (mayBeConnectionString(ConnectionType.HOST, connectionStringInput.value)) {
        connectButton.disabled = false
        connectionStringInput.classList.add('is-success')
        connectionStringInputIcon.classList.add('fa-check')
      } else {
        connectionStringInput.classList.add('is-danger')
        connectionStringInputIcon.classList.add('fa-times')
        connectButton.disabled = true
      }
    })
    connectButton.addEventListener('click', async () => {
      await webRTCComponent.Setup(remoteScreen)
      const offer = getOfferFromUrl(connectionStringInput.value)
      await webRTCComponent.Connect(offer)
      connectionStringInputContainer.classList.add('is-hidden')
      copyButton.classList.remove('is-hidden')
    })
    copyButton.addEventListener('click', async () => {
      copyButton.classList.add('is-loading')
      const remoteOffer = getOfferFromUrl(connectionStringInput.value)
      const offer = await webRTCComponent.CreateParticipantUrl(remoteOffer)
      navigator.clipboard.writeText(offer)
      setTimeout(() => {
        copyButton.classList.remove('is-loading')
      }, 400)
    })
    remoteScreen.addEventListener('dblclick', () => {
      webRTCComponent.PingRemoteCursor('cursor-' + UUID)
    })
    remoteScreen.addEventListener('mousemove', (e) => {
      const { offsetX, offsetY } = e
      // TODO: Batch cursor updates
      webRTCComponent.UpdateRemoteCursor({
        x: offsetX / remoteScreen.clientWidth,
        y: offsetY / remoteScreen.clientHeight,
        name: settings.username,
        id: 'cursor-' + UUID,
        color: settings.color
      })
    })
    remoteScreen.addEventListener('loadedmetadata', () => {
      remoteScreenContainer.classList.remove('is-hidden')
      copyButton.classList.add('is-hidden')
    })
  })
  const onDisconnectClick = async (): Promise<void> => {
    await webRTCComponent.Disconnect()
    connectionStringInputContainer.classList.remove('is-hidden')
    connectionStringInput.value = ''
    copyButton.classList.add('is-hidden')
    remoteScreenContainer.classList.add('is-hidden')
  }
  const onFullscreenClick = (): void => {
    remoteScreen.requestFullscreen()
  }
  const onZoomInClick = (): void => {
    zoomFactor += 0.1
    remoteScreen.style.scale = zoomFactor.toString()
  }
  const onZoomOutClick = (): void => {
    if (zoomFactor <= 1) return
    zoomFactor -= 0.1
    remoteScreen.style.scale = zoomFactor.toString()
  }
</script>

<WebRTC bind:this={webRTCComponent} />

<div class="container p-5">
  <h1 class="title">Join a session</h1>
  <div class="form">
    <div bind:this={connectionStringInputContainer} class="field has-addons">
      <div class="control has-icons-left has-icons-right">
        <input
          bind:this={connectionStringInput}
          placeholder="host connection string"
          class="input"
          type="text"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon is-small is-right">
          <i bind:this={connectionStringInputIcon} class="fas fa-question"></i>
        </span>
      </div>
      <div class="control">
        <button class="button is-link" bind:this={connectButton} disabled>
          <span class="icon">
            <i class="fas fa-link"></i>
          </span>
          <span>Connect</span>
        </button>
      </div>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <button class="button is-link is-hidden" bind:this={copyButton}>
        <span class="icon">
          <i class="fas fa-copy"></i>
        </span>
        <span>Copy my connection string</span>
      </button>
    </div>
  </div>
</div>

<div bind:this={remoteScreenContainer} class="is-hidden">
  <div bind:this={remoteScreenContainer} class="field">
    <label class="label" for="remote_screen">Remote screen</label>
    <div class="control">
      <div class="video-overflow">
        <video bind:this={remoteScreen} id="remote_screen" class="video" autoplay playsinline muted
        ></video>
      </div>
    </div>
  </div>
  <div class="field">
    <div class="control">
      <button class="button is-info" on:click={onZoomInClick}>
        <span class="icon">
          <i class="fas fa-search-plus"></i>
        </span>
        <span>Zoom In</span>
      </button>
      <button class="button is-info" on:click={onZoomOutClick}>
        <span class="icon">
          <i class="fas fa-search-minus"></i>
        </span>
        <span>Zoom Out</span>
      </button>
      <button class="button is-info" on:click={onFullscreenClick}>
        <span class="icon">
          <i class="fas fa-expand"></i>
        </span>
        <span>Fullscreen</span>
      </button>
      <button class="button is-danger" on:click={onDisconnectClick}>
        <span class="icon">
          <i class="fas fa-unlink"></i>
        </span>
        <span>Disconnect</span>
      </button>
    </div>
  </div>
</div>

<style>
  .video {
    width: 100%;
    height: auto;
    transition: transform 0.5s linear;
  }
  .video-overflow {
    width: 100%;
    height: auto;
    overflow: hidden;
  }
</style>
