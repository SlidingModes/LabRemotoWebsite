<script>
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/pocketbase.svelte';
	let loggedIn = $derived(pb.isLoggedIn());
	let isAdmin = $derived(pb.isRole('supervisors'));
	let open = $derived(!loggedIn || !isAdmin);
</script>

{#if !loggedIn}
	<div class="pico container">
		<dialog {open}>
			<article>
				<h2>¡Ups!</h2>
				<p>No has iniciado sesión</p>
				<p>Si no puedes iniciar sesión, prueba desactivando tu AdBlocker</p>
				<footer>
					<button onclick={() => goto('/login')}>Iniciar sesión</button>
				</footer>
			</article>
		</dialog>
	</div>
{:else if !isAdmin}
	<div class="pico container">
		<dialog {open}>
			<article>
				<h2>¡Ups!</h2>
				<p>No tienes acceso</p>
				<p>Si crees que esto es un error, contacta al supervisor</p>
				<footer>
					<button onclick={() => goto('/')}>Entendido</button>
				</footer>
			</article>
		</dialog>
	</div>
{/if}
