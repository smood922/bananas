<script lang="ts">
  import Navigation from './Navigation.svelte'
  import Join from './Join.svelte'
  import Host from './Host.svelte'
  import Settings from './Settings.svelte'
  import { useActiveView } from './stores'
  const activeView = useActiveView()
</script>

<Navigation />

{#if $activeView === 'join'}
  <Join />
{/if}
{#if $activeView === 'host'}
  <Host />
{/if}
{#if $activeView === 'settings'}
  <Settings />
{/if}
