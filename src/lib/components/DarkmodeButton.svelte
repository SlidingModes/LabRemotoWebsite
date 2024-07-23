<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { SunMoon } from 'lucide-svelte';
	import { modeWatcher } from '$lib/stores/modeWatcher.svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="outline contrast">
		<SunMoon class="h-5 w-5" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content
		sideOffset={8}
		class="w-full max-w-16 rounded-xl border border-muted bg-background px-1 py-1.5 shadow-popover"
		style="background-color: var(--pico-background-color);"
	>
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
