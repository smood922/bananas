<script lang="ts">
  const externalLinkClickHandler = (root: HTMLButtonElement, url: string): void => {
    root.classList.add('is-loading')
    root.classList.add('is-primary')
    setTimeout(() => {
      root.classList.remove('is-loading')
      root.classList.remove('is-primary')
    }, 3000)
    window.open(url)
  }

  const handleTopButtonsClick = (evt: MouseEvent): void => {
    evt.preventDefault()
    const target = evt.target as HTMLButtonElement
    const root = target.closest('button')
    switch (root.dataset.action) {
      case 'join':
        break
      case 'host':
        break
      case 'report-a-bug':
        externalLinkClickHandler(root, 'https://github.com/mistweaverco/bananas/issues/new')
        break
      case 'see-the-code':
        externalLinkClickHandler(root, 'https://github.com/mistweaverco/bananas')
        break
      default:
        break
    }
  }
</script>

<nav class="navbar" aria-label="main navigation">
  <div class="navbar-menu p-2">
    <div class="navbar-start">
      <div class="navbar-item">
        <div class="buttons">
          <button
            class="button is-primary is-active"
            data-action="join"
            on:click={handleTopButtonsClick}
          >
            <span class="icon">
              <i class="fa-solid fa-right-to-bracket"></i>
            </span>
            <strong>Join a session</strong>
          </button>
          <button class="button is-secondary" data-action="host" on:click={handleTopButtonsClick}>
            <span class="icon">
              <i class="fa-solid fa-earth-africa"></i>
            </span>
            <strong>Host a session</strong>
          </button>
          <button
            class="button is-secondary"
            data-action="settings"
            on:click={handleTopButtonsClick}
          >
            <span class="icon">
              <i class="fa-solid fa-gear"></i>
            </span>
            <strong>Settings</strong>
          </button>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <button
            class="button is-secondary"
            data-action="report-a-bug"
            on:click={handleTopButtonsClick}
          >
            <span class="icon">
              <i class="fa-solid fa-bug"></i>
            </span>
            <strong>Report a bug</strong>
          </button>
          <button
            class="button is-secondary"
            data-action="see-the-code"
            on:click={handleTopButtonsClick}
          >
            <span class="icon">
              <i class="fa-solid fa-code"></i>
            </span>
            <strong>See the code</strong>
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
