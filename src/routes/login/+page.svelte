<script lang="ts">
	import { title } from '$lib/config';

	import { pb } from '$lib/stores/pocketbase.svelte';

	$effect(() => {
		if (pb.authStoreIsValid()) {
			location.href = '/';
		}
	});

	async function handleLogin(event: SubmitEvent) {
		const authData = await pb.login(username, password);
		console.log(authData);
		if (pb.authStoreIsValid()) {
			location.href = '/';
		}
	}

	let username = $state('');
	let password = $state('');
</script>

<div class="container max-w-xl pico">
	<article class="container">
		<header class="text-center">
			<h1>{title}</h1>
			<h2>Inicia sesión</h2>
		</header>
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
					/>
				</label>
			</fieldset>

			<div class="text-center my-auto">
				<input class="max-w-60 disabled" type="submit" />
			</div>
		</form>
		<footer>
			<p class="text-sm font-light text-gray-500 dark:text-gray-400">
				¿Olvidaste tu contraseña? <a
					href="/"
					class="font-medium text-primary-600 hover:underline dark:text-primary-500">Recuperar</a
				>
			</p>
		</footer>
	</article>
</div>
