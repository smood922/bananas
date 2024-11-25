<script lang="ts">
  import { onMount } from 'svelte'

  let username: HTMLInputElement
  let color: HTMLInputElement
  let modalSuccess: HTMLDivElement
  let modalFailure: HTMLDivElement

  const checkIsValidHexColor = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color)
  }
  function checkColor(): void {
    if (checkIsValidHexColor(this.value)) {
      this.classList.remove('is-danger')
      this.classList.add('is-success')
    } else {
      this.classList.remove('is-success')
      this.classList.add('is-danger')
    }
  }
  function checkUsername(): void {
    if (this.value.length > 0 && this.value.length < 32) {
      this.classList.remove('is-danger')
      this.classList.add('is-success')
    } else {
      this.classList.remove('is-success')
      this.classList.add('is-danger')
    }
  }
  async function onSubmit(evt: Event): Promise<void> {
    evt.preventDefault()
    if (
      checkIsValidHexColor(color.value) &&
      username.value.length > 0 &&
      username.value.length < 32
    ) {
      await window.BananasApi.updateSettings({ username: username.value, color: color.value })
      modalSuccess.classList.add('is-active')
      setTimeout(() => {
        modalSuccess.classList.remove('is-active')
      }, 2000)
    } else {
      modalFailure.classList.add('is-active')
      setTimeout(() => {
        modalFailure.classList.remove('is-active')
      }, 2000)
    }
  }
  onMount(async () => {
    const settings = await window.BananasApi.getSettings()
    username.value = settings.username
    color.value = settings.color
  })
</script>

<div bind:this={modalSuccess} class="modal">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="box">
      <h1 class="title has-text-success">Success</h1>
      <p>Settings successfully saved.</p>
    </div>
  </div>
</div>

<div bind:this={modalFailure} class="modal">
  <div class="modal-background"></div>
  <div class="modal-content">
    <div class="box">
      <h1 class="title has-text-danger">Failure</h1>
      <p>Settings could not be saved.</p>
    </div>
  </div>
</div>

<div class="container p-5">
  <h1 class="title">Settings</h1>
  <form class="form" on:submit={onSubmit}>
    <div class="field">
      <label class="label" for="username">Username</label>
      <div class="control has-icons-left has-icons-right">
        <input
          bind:this={username}
          on:input={checkUsername}
          class="input"
          type="text"
          id="username"
          placeholder="Banana Joe"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-user"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <label class="label" for="color">Color</label>
      <div class="control has-icons-left has-icons-right">
        <input
          bind:this={color}
          on:input={checkColor}
          class="input"
          type="text"
          id="color"
          placeholder="#fffff"
        />
        <span class="icon is-small is-left">
          <i class="fas fa-palette"></i>
        </span>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <button class="button is-link">Save</button>
      </div>
    </div>
  </form>
</div>
