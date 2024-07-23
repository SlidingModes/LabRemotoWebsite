<script>
	import { pb } from '$lib/stores/pocketbase.svelte';
	import { LogIn } from 'lucide-svelte';

	let loggedIn = $derived(pb.authStoreIsValid());
</script>

{#if loggedIn}
	<button
		onclick={() => {
			pb.logout();
			window.location.href = '/';
		}}>Logout</button
	>
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
		background-color: var(--pico-primary-hover-background);
		text-decoration: none;
	}
</style>
