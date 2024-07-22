<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { SunMoon } from 'lucide-svelte';
	import { modeWatcher } from '$lib/stores.svelte';
	/* $effect(() => {
		document.documentElement.setAttribute('data-modeWatcher', modeWatcher.mode);
	}); */
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<SunMoon />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content sideOffset={8}>
		<DropdownMenu.Item
			on:click={() => {
				modeWatcher.light();
			}}
		>
			Light</DropdownMenu.Item
		>
		<DropdownMenu.Item
			on:click={() => {
				modeWatcher.dark();
			}}
		>
			Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item
			on:click={() => {
				modeWatcher.system();
			}}>System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
