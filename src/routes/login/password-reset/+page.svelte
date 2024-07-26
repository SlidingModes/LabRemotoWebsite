<script>
	import { ClientResponseError } from 'pocketbase';
	import { pb } from '$lib/stores/pocketbase.svelte';
	import { goto } from '$app/navigation';

	let role = $state('');
	let email = $state('');
	let open = $state(false);

	async function handleReset() {
		try {
			await pb.resetPassword(email, role);
			open = true;
		} catch (error) {
			console.error('Error during password reset:', error);
			if (error instanceof ClientResponseError) {
				alert(error.data.data);
			}
			open = false;
		}
	}
</script>

<div class="container max-w-xl pico" class:modal-is-open={open} class:modal-is-opening={open}>
	{#if open}
		<dialog {open}>
			<article>
				<div class="pico container">
					<h2>Revisa tu correo</h2>
					<p>
						Se ha enviado un enlace a tu correo electrónico para que puedas reestablecer tu
						contraseña.
					</p>
					<b>Busca en tu carpeta de Spam</b>
				</div>
				<footer>
					<button onclick={() => goto('/login')}>Entendido</button>
				</footer>
			</article>
		</dialog>
	{/if}
	<article>
		<header class="text-center"><b>Recupera tu contraseña</b></header>
		<form class="container">
			<fieldset class="grid">
				<label>
					Rol
					<select bind:value={role} aria-label="Rol" required>
						<option selected disabled value=""> Soy ... </option>
						<option value="students">Alumna/o</option>
						<option value="teachers">Maestra/o</option>
						<option value="supervisors">Supervisor(a)</option>
					</select>
				</label>
				<label>
					Correo electrónico
					<input type="email" bind:value={email} placeholder="Email" autocomplete="email" />
				</label>
			</fieldset>
			<div class="text-center my-auto">
				<button
					class="max-w-60"
					type="submit"
					disabled={email === '' || role === ''}
					value="Iniciar sesión"
					onclick={handleReset}>Enviar</button
				>
			</div>
		</form>
		<small>Si tu correo existe enviaremos un enlace para que reestablezcas tu contraseña.</small>
		<footer><a href="/">Regresar a Inicio de sesión</a></footer>
	</article>
</div>

<style>
	article {
		--pico-border-radius: 1.5rem;
	}
</style>
