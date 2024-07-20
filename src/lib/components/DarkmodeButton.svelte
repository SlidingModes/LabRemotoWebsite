<script lang="ts">
	import Sun from 'svelte-radix/Sun.svelte';
	import Moon from 'svelte-radix/Moon.svelte';

	import { resetMode, setMode } from 'mode-watcher';
	import { DropdownMenu } from 'bits-ui';
	import type { Icon } from 'lucide-svelte';
	import { SunMoon } from 'lucide-svelte';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<SunMoon />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content sideOffset={8}>
		<DropdownMenu.Item on:click={() => setMode('light')}>Light</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => setMode('dark')}>Dark</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => resetMode()}>System</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
