<script>
	import { pb } from '$lib/pb/pocketbase.svelte';
	import { LogIn, LogOut } from 'lucide-svelte';

	let loggedIn = $state(pb.isLoggedIn());
	$effect.pre(() => {
		loggedIn = pb.isLoggedIn();
	});
</script>

{#if loggedIn}
	<button
		class="inline-flex items-center"
		onclick={() => {
			pb.logout();
			window.location.href = '/';
		}}
	>
		<LogOut class="w-4 h-4" />
		<div class="hidden md:block ms-2">Cerrar sesión</div>
	</button>
{:else}
	<a href="/login" class="button">
		<LogIn class="w-4 h-4" />
		<div class="hidden md:block ms-2">Inicia sesión</div>
	</a>
{/if}

<style>
	.button {
		background-color: var(--pico-primary-background);
		color: var(--pico-primary-inverse);
		text-align: center;
		margin: 0;
		display: inline-flex;
		align-items: center;
	}
	.button:hover {
		background-color: var(--pico-secondary-hover-background);
		text-decoration: none;
	}
	button:hover {
		background-color: var(--pico-secondary-hover-background);
		text-decoration: none;
	}
</style>
