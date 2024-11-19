<script lang="ts">
  import { onMount } from 'svelte'
  let connectionStringInput: HTMLInputElement
  let connectionStringInputSuccess: HTMLParagraphElement
  let connectionStringInputError: HTMLParagraphElement
  let connectionStringInputIcon: HTMLElement
  let connectButton: HTMLButtonElement
  let copyButton: HTMLButtonElement

  const mayBeConnectionString = (str: string): boolean => {
    try {
      JSON.parse(atob(str))
      return true
    } catch (err) {
      return false
    }
  }

  onMount(() => {
    connectionStringInput.addEventListener('input', () => {
      connectionStringInput.classList.remove('is-danger', 'is-success')
      connectionStringInputIcon.classList.remove('fa-question', 'fa-check', 'fa-times')
      if (mayBeConnectionString(connectionStringInput.value)) {
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
    connectButton.addEventListener('click', () => {
      console.log(connectionStringInput.value)
    })
    copyButton.addEventListener('click', () => {
      copyButton.classList.add('is-loading')
      navigator.clipboard.writeText(
        btoa(
          JSON.stringify({
            host: 'localhost',
            port: 3000,
            password: '1234',
            mode: 'host',
            peerId: '1234'
          })
        )
      )
      setTimeout(() => {
        copyButton.classList.remove('is-loading')
      }, 400)
    })
  })
</script>

<div class="container p-5">
  <h1 class="title">Host a session</h1>
  <div class="form">
    <div class="field">
      <div class="control">
        <button class="button is-link" bind:this={copyButton}>Copy my connection string</button>
      </div>
    </div>

    <div class="field">
      <label class="label" for="remote_connection_string">Participant connection string</label>
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
</div>
