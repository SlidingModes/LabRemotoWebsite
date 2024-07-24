<script>
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/pocketbase.svelte';
	let loggedIn = $derived(pb.isLoggedIn());
	let isAdmin = $derived(pb.isRole('supervisors'));
	let open = $derived(!loggedIn || !isAdmin);

	async function fetchUsers() {
		const records = await pb.instance.collection('studentsView').getFullList({
			sort: '-created'
		});
		console.log(records);
	}
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
{:else if isAdmin}
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
<button onclick={fetchUsers}>Fetch Users</button>

<div class="pico container overflow-auto">
	<table class="striped">
		<thead>
			<tr>
				<th scope="col">Planet</th>
				<th scope="col">Diameter (km)</th>
				<th scope="col">Distance to Sun (AU)</th>
				<th scope="col">Orbit (days)</th>
				<th scope="col">Orbit (days)</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope="row">Mercury</th>
				<td>4,880</td>
				<td>0.39</td>
				<td>88</td>
			</tr>
			<tr>
				<th scope="row">Venus</th>
				<td>12,104</td>
				<td>0.72</td>
				<td>225</td>
			</tr>
			<tr>
				<th scope="row">Earth</th>
				<td>12,742</td>
				<td>1.00</td>
				<td>365</td>
			</tr>
			<tr>
				<th scope="row">Mars</th>
				<td>6,779</td>
				<td>1.52</td>
				<td>687</td>
			</tr>
		</tbody>
		<tfoot>
			<tr>
				<th scope="row">Average</th>
				<td>9,126</td>
				<td>0.91</td>
				<td>341</td>
			</tr>
		</tfoot>
	</table>
</div>
