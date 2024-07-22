<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { SunMoon } from 'lucide-svelte';
	import { modeWatcher } from '$lib/stores/modeWatcher.svelte.ts';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="outline contrast">
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
