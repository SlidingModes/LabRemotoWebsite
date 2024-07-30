<script lang="ts">
	import { X, Eye, EyeOff, Info } from 'lucide-svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import {
		pb,
		type User,
		invalidEmailError,
		invalidCollectionNameError,
		invalidNameError,
		invalidPasswordError,
		invalidUsernameError
	} from '$lib/pb/pocketbase.svelte';
	let { onclick }: { onclick?: MouseEventHandler<HTMLButtonElement> } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let role = $state('');
	let username = $state('');
	let showPassword = $state(false);
	let status = $state('');
	let success = $state(false);
	$inspect(status);

	async function handleAddUser(e: SubmitEvent) {
		e.preventDefault();
		let user: User | null = null;

		try {
			user = await pb.createUserFromFields(name, username, email, password, role);
			status = 'Usuario añadido correctamente.';
			success = true;
		} catch (error) {
			if (error instanceof invalidEmailError) {
				status = 'Correo electrónico inválido o en uso.';
			} else if (error instanceof invalidCollectionNameError) {
				status = 'Rol inválido.';
			} else if (error instanceof invalidUsernameError) {
				status = 'Nombre de usuario inválido o en uso.';
			} else if (error instanceof invalidPasswordError) {
				status = 'Contraseña inválida.';
			} else {
				console.error('Error during user creation:', error);
				status = (error as Error).message;
			}
		}
	}
</script>

<svelte:window />
<article>
	<header class="flex justify-between">
		<h3>Añadir a un nuevo usuario</h3>

		<button aria-label="Close" class="secondary" {onclick}
			>{#if onclick}<X class="w-6 h-6" />{/if}</button
		>
	</header>
	<p>Para añadir a un nuevo usuario, por favor, rellene el siguiente formulario.</p>
	{#if status}
		<div
			class="flex items-center p-4 mb-4 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 {success
				? 'text-green-800 dark:text-green-400'
				: 'text-red-800 dark:text-red-400'}"
			role="alert"
		>
			<Info class="flex-shrink-0 inline w-4 h-4 me-1" />
			<span class="font-medium">{status}</span>
		</div>
	{/if}
	<form onsubmit={handleAddUser}>
		<div class="grid">
			<label for="name"
				>Nombre
				<input type="text" id="name" bind:value={name} name="name" required /></label
			>
			<label for="name"
				>Usuario
				<input type="text" id="username" bind:value={username} name="username" required /></label
			>
		</div>

		<div class="grid">
			<label for="email"
				>Correo electrónico
				<input type="email" id="email" bind:value={email} name="email" required /></label
			>
			<label for="role"
				>Rol
				<select id="role" name="role" bind:value={role} required>
					<option selected disabled value="">Seleccionar</option>
					<option value="students">Alumna/o</option>
					<option value="teachers">Maestra/o</option>
					<option value="supervisors">Supervisor(a)</option>
				</select>
			</label>
		</div>
		<!-- svelte-ignore a11y_no_redundant_roles -->
		<label
			>Contraseña
			<!-- svelte-ignore a11y_no_redundant_roles -->
			<fieldset role="group">
				<input
					type={showPassword ? 'text' : 'password'}
					bind:value={password}
					id="password"
					name="password"
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

		<button type="submit">Añadir</button>
	</form>
</article>

<style>
	header button {
		padding: 0.5rem;
		background-color: transparent;
		border: none;
	}

	article {
		--pico-border-radius: 1.5rem;
	}
</style>
