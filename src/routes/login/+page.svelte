<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/pocketbase.svelte';

	$effect.pre(() => {
		if (pb.isLoggedIn()) {
			location.href = '/';
		}
	});

	async function handleLogin(event: SubmitEvent) {
		event.preventDefault();
		try {
			const authData = await pb.login(username, password, role);
			logInStatus = 'success';
			const user = pb.getUser();

			if (pb.authStoreIsValid()) {
				location.href = '/';
			}
		} catch (error) {
			console.error('Error during login:', error);
			logInStatus = 'error';
			// Manejar el error adecuadamente aquí
		}
	}

	let username = $state('');
	let password = $state('');
	let role = $state('');
	let logInStatus = $state('');
	let open = $derived(logInStatus === 'error');
</script>

{#if open}
	<div class="pico container">
		<dialog {open}>
			<article>
				<h2>¡Ups!</h2>
				<p>Error al conectar con el servidor</p>
				<p>Si no puedes iniciar sesión, prueba desactivando tu AdBlocker.</p>
				<footer>
					<button onclick={() => goto('/login')}>Iniciar sesión</button>
				</footer>
			</article>
		</dialog>
	</div>
{/if}

<div class="container max-w-xl pico">
	<article class="container">
		<header class="text-center"><b>Iniciar sesión</b></header>
		<form class="container" onsubmit={handleLogin}>
			<fieldset class="grid">
				<label>
					Usuario
					<input
						name="username"
						placeholder="leonardita"
						autocomplete="username"
						aria-invalid={username.length < 8 ? undefined : username.length < 32 ? false : true}
						bind:value={username}
						required
					/>
				</label>
				<label>
					Contraseña
					<input
						type="password"
						name="password"
						placeholder="**********"
						autocomplete="current-password"
						aria-invalid={password.length <= 8 ? undefined : password.length < 32 ? false : true}
						bind:value={password}
						required
					/>
				</label>
				<label>
					Rol
					<select bind:value={role} aria-label="Rol" required>
						<option selected disabled value=""> Soy ... </option>
						<option value="students">Alumna/o</option>
						<option value="teachers">Maestra/o</option>
						<option value="supervisors">Supervisor(a)</option>
					</select>
				</label>
			</fieldset>

			<div class="text-center my-auto">
				<input
					class="max-w-60"
					type="submit"
					disabled={username === '' || password === '' || role === ''}
				/>
			</div>
		</form>
		<footer class="flex justify-between items-center">
			<small>
				¿Olvidaste tu contraseña? <a href="/">Recuperar </a>
			</small>
			<small>
				<a href="/admin" class="no-underline">Admin</a>
			</small>
		</footer>
	</article>
</div>

<style>
	article {
		--pico-border-radius: 1.5rem;
	}
	footer {
		margin-top: 0;
	}
</style>
