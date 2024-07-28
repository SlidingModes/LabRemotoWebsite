<script lang="ts">
	import { X, Eye, EyeOff } from 'lucide-svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { pb } from '$lib/pb/pocketbase.svelte';
	let { onclick }: { onclick?: MouseEventHandler<HTMLButtonElement> } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let role = $state('');
	let username = $state('');
	let showPassword = $state(false);

	async function handleAddUser(e: SubmitEvent) {
		console.log('Enviado');
		e.preventDefault();
		// Manda el email como username
		const user = pb.createUserFromFields(name, username, email, password, role);
		console.log(user);
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
			<fieldset role="group">
				<input
					type={showPassword ? 'text' : 'password'}
					bind:value={password}
					id="password"
					name="password"
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
