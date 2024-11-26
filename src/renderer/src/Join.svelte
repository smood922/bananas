<script lang="ts">
  import { onMount } from 'svelte'
  import {
    makeVideoDraggable,
    mayBeConnectionString,
    getDataFromBananasUrl,
    ConnectionType,
    getUUIDv4
  } from './Utils'
  import WebRTC from './WebRTC.svelte'
  let webRTCComponent: WebRTC
  let connectionStringInput: HTMLInputElement
  let connectButton: HTMLButtonElement
  let copyButton: HTMLButtonElement
  let remoteScreen: HTMLVideoElement
  let UUID = getUUIDv4()
  let zoomFactor = 1
  let microphoneActive = true
  let isStreaming = false
  let isConnected = false
  let connectionStringIsValid: boolean | null = null
  let copyButtonIsLoading = false

  onMount(async () => {
    const settings = await window.BananasApi.getSettings()
    makeVideoDraggable(remoteScreen)
    connectionStringInput.addEventListener('input', () => {
      if (connectionStringInput.value === '') {
        connectionStringIsValid = null
        return
      }
      connectionStringIsValid = mayBeConnectionString(
        ConnectionType.HOST,
        connectionStringInput.value
      )
    })
    connectButton.addEventListener('click', async () => {
      await webRTCComponent.Setup(remoteScreen)
      const data = getDataFromBananasUrl(connectionStringInput.value)
      await webRTCComponent.Connect(data.rtcSessionDescription)
      isConnected = true
    })
    copyButton.addEventListener('click', async () => {
      copyButtonIsLoading = true
      const remoteData = getDataFromBananasUrl(connectionStringInput.value)
      const data = await webRTCComponent.CreateParticipantUrl(remoteData.rtcSessionDescription, {
        username: settings.username
      })
      navigator.clipboard.writeText(data)
      setTimeout(() => {
        copyButtonIsLoading = false
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
      isStreaming = true
      copyButton.classList.add('is-hidden')
    })
  })
  const onDisconnectClick = async (): Promise<void> => {
    await webRTCComponent.Disconnect()
    connectionStringInput.value = ''
    connectionStringIsValid = null
    isStreaming = false
    microphoneActive = false
    isConnected = false
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
  const onMicrophoneToggle = async (): Promise<void> => {
    microphoneActive = !microphoneActive
    webRTCComponent.ToggleMicrophone()
  }
</script>

<WebRTC bind:this={webRTCComponent} />

<div class="container p-5">
  <h1 class="title">{!isStreaming ? 'Join' : 'Joined'} a session</h1>
  <div class={!isStreaming ? 'is-hidden' : ''}>
    <div class="fixed-grid">
      <div class="grid">
        <div class="cell">
          <button
            title={microphoneActive ? 'Microphone active' : 'Microphone muted'}
            class="button {microphoneActive ? 'is-success' : 'is-danger'}"
            on:click={onMicrophoneToggle}
          >
            <span class="icon">
              <i class="fas {microphoneActive ? 'fa-microphone' : 'fa-microphone-slash'}"></i>
            </span>
          </button>
        </div>
        <div class="cell has-text-right">
          <button class="button is-danger" on:click={onDisconnectClick}>
            <span class="icon">
              <i class="fas fa-unlink"></i>
            </span>
            <span>Disconnect</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="form">
    <div class="field has-addons {isStreaming || isConnected ? 'is-hidden' : ''}">
      <div class="control has-icons-left has-icons-right">
        <input
          bind:this={connectionStringInput}
          placeholder="host connection string"
          class="input {connectionStringIsValid === null
            ? ''
            : connectionStringIsValid
              ? 'is-success'
              : 'is-danger'}"
          type="text"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
        <span class="icon is-small is-right">
          <i
            class="fas fa-question {connectionStringIsValid === null
              ? 'fa-question'
              : connectionStringIsValid
                ? 'fa-check'
                : 'fa-times'}"
          ></i>
        </span>
      </div>
      <div class="control">
        <button
          class="button {connectionStringIsValid === null
            ? 'is-link'
            : connectionStringIsValid
              ? 'is-success'
              : 'is-danger'}"
          bind:this={connectButton}
          disabled={connectionStringIsValid ? false : true}
        >
          <span class="icon">
            <i class="fas fa-link"></i>
          </span>
          <span
            >Connect {connectionStringIsValid
              ? getDataFromBananasUrl(connectionStringInput.value).data.username
              : ''}
          </span>
        </button>
      </div>
    </div>
  </div>

  <div class="field">
    <div class="control">
      <button
        class="button is-link {!isConnected || isStreaming ? 'is-hidden' : ''} {copyButtonIsLoading
          ? 'is-loading'
          : ''}"
        bind:this={copyButton}
      >
        <span class="icon">
          <i class="fas fa-copy"></i>
        </span>
        <span>Copy my connection string</span>
      </button>
    </div>
  </div>
</div>

<div class={!isStreaming ? 'is-hidden' : ''}>
  <div class="field">
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
