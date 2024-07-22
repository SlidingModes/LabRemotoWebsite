<script lang="ts">
	import { modeWatcher } from '$lib/stores/modeWatcher.svelte';
	function handleStorage(event: StorageEvent) {
		if (event.key === 'theme') {
			switch (event.newValue) {
				case null:
					document.documentElement.removeAttribute('data-theme');
					break;
				case 'light':
					document.documentElement.setAttribute('data-theme', event.newValue);
					modeWatcher.light();
					break;
				case 'dark':
					document.documentElement.setAttribute('data-theme', event.newValue);
					modeWatcher.dark();
					break;
				default:
					document.documentElement.setAttribute('data-theme', event.newValue);
					modeWatcher.custom(event.newValue);
					break;
			}
		}
	}
	$effect(() => {
		document.documentElement.setAttribute('data-theme', modeWatcher.mode);
	});
</script>

<svelte:window on:storage={handleStorage} />
