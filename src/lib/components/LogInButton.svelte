<script lang="ts">
	import { pb } from '$lib/pb/pocketbase.svelte';
	import { LogIn, LogOut } from 'lucide-svelte';

	async function logOut() {
		pb.logout();
		window.location.href = '/';
	}
</script>

{#if pb.isLoggedIn()}
	<button class="inline-flex items-center" onclick={logOut}>
		<LogOut class="w-4 h-4" />
		<div class="hidden md:block ms-2">&nbsp; Cerrar sesión</div>
	</button>
{:else}
	<a href="/login" class="button">
		<LogIn class="w-4 h-4" />
		<div class="hidden md:block ms-2"> &nbsp; Inicia sesión</div>
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
