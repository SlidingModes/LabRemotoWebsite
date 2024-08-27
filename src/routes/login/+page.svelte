<script lang="ts">
	import { pb } from '$lib/pb/pocketbase.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';

	let showPassword = $state(false);

	$effect.pre(() => {
		if (pb.isLoggedIn()) {
			location.href = '/';
		}
	});

	async function handleLogin() {
		try {
			await pb.login(username, password, role);
			logInStatus = 'success';

			if (pb.authStoreIsValid()) {
				location.href = '/';
			}
		} catch {
			logInStatus = 'error';
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
				<p>Parece que los datos no son correctos</p>
				<p>Si no puedes iniciar sesión, prueba reestableciendo tu contraseña.</p>
				<footer>
					<button onclick={() => (location.href = '/login')}>Iniciar sesión</button>
				</footer>
			</article>
		</dialog>
	</div>
{/if}

<div class="container max-w-xl pico">
	<article class="container">
		<header class="text-center"><b>Iniciar sesión</b></header>
		<form class="container">
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
				<label
					>Contraseña
					<!-- svelte-ignore a11y_no_redundant_roles -->
					<fieldset role="group">
						<input
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							id="password"
							name="password"
							autocomplete="current-password"
							aria-invalid={password.length <= 8 ? undefined : password.length < 32 ? false : true}
							required
						/>
						<button type="button" onclick={() => (showPassword = !showPassword)}>
							{#if showPassword}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</button>
					</fieldset>
				</label>
				<label>
					Rol
					<select bind:value={role} aria-label="Rol" required>
						<option selected disabled value=""> Soy ... </option>
						<option value="students">Estudiante</option>
						<option value="collaborators">Colaborador</option>
						<option value="supervisors">Administrador</option>
					</select>
				</label>
			</fieldset>

			<div class="text-center my-auto">
				<input
					class="max-w-60"
					type="button"
					disabled={username === '' || password === '' || role === ''}
					value="Iniciar sesión"
					onclick={handleLogin}
				/>
			</div>
		</form>
		<footer class="flex justify-between items-center">
			<small>
				¿Olvidaste tu contraseña? <a href="/login/password-reset">Recuperar </a>
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
