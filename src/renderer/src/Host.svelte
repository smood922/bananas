<script lang="ts">
  import { onMount } from 'svelte'
  import { mayBeConnectionString, getOfferFromUrl, ConnectionType } from './Utils'
  import WebRTC from './WebRTC.svelte'
  let webRTCComponent: WebRTC
  let connectionStringInput: HTMLInputElement
  let connectionStringInputIcon: HTMLElement
  let connectButton: HTMLButtonElement
  let copyButton: HTMLButtonElement
  let startSessionButton: HTMLButtonElement
  let connectionStringContainer: HTMLDivElement
  let castControls: HTMLDivElement

  let cursorsActive = false

  const toggleRemoteCursors = (): void => {
    cursorsActive = !cursorsActive
    window.BananasApi.toggleRemoteCursors(cursorsActive)
    webRTCComponent.ToggleRemoteCursors(cursorsActive)
  }

  onMount(() => {
    connectionStringInput.addEventListener('input', () => {
      connectionStringInput.classList.remove('is-danger', 'is-success')
      connectionStringInputIcon.classList.remove('fa-question', 'fa-check', 'fa-times')
      if (mayBeConnectionString(ConnectionType.PARTICIPANT, connectionStringInput.value)) {
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
      const offer = getOfferFromUrl(connectionStringInput.value)
      await webRTCComponent.Connect(offer)
      connectionStringContainer.classList.add('is-hidden')
      copyButton.classList.add('is-hidden')
      castControls.classList.remove('is-hidden')
    })
    copyButton.addEventListener('click', async () => {
      copyButton.classList.add('is-loading')
      const offer = await webRTCComponent.CreateHostUrl()
      navigator.clipboard.writeText(offer)
      setTimeout(() => {
        copyButton.classList.remove('is-loading')
      }, 400)
    })
  })
  const onStartSessionButtonClick = async (): Promise<void> => {
    await webRTCComponent.Setup()
    startSessionButton.classList.add('is-hidden')
    connectionStringContainer.classList.remove('is-hidden')
    copyButton.classList.remove('is-hidden')
  }
  const onDisconnectClick = async (): Promise<void> => {
    await webRTCComponent.Disconnect()
    startSessionButton.classList.remove('is-hidden')
    connectionStringContainer.classList.add('is-hidden')
    connectionStringInput.value = ''
    copyButton.classList.add('is-hidden')
    castControls.classList.add('is-hidden')
  }
</script>

<WebRTC bind:this={webRTCComponent} />

<div class="container p-5">
  <h1 class="title">Host a session</h1>
  <div class="form">
    <div class="field">
      <div class="control">
        <button
          class="button is-link"
          bind:this={startSessionButton}
          on:click={onStartSessionButtonClick}
        >
          <span class="icon">
            <i class="fas fa-play"></i>
          </span>
          <span>Start a session</span>
        </button>
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

    <div bind:this={connectionStringContainer} class="field has-addons is-hidden">
      <div class="control has-icons-left has-icons-right">
        <input
          bind:this={connectionStringInput}
          placeholder="participant connection string"
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

    <div bind:this={castControls} class="is-hidden">
      <div class="field">
        <div class="control">
          <button class="button is-warning" on:click={toggleRemoteCursors}>
            <span class="icon">
              <i class="fas fa-mouse-pointer"></i>
            </span>
            <span>{cursorsActive ? 'Disable remote cursors' : 'Enable remote cursors'}</span>
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
  </div>
</div>
