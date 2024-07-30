<script lang="ts">
	import { X, Eye, EyeOff, Info } from 'lucide-svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { pb } from '$lib/pb/pocketbase.svelte';

	let {
		collection,
		onclick
	}: { collection: string; onclick?: MouseEventHandler<HTMLButtonElement> } = $props();

	let role = $state(collection);
	let status = $state('');
	let success = $state(false);
	let files = $state(null);

	let collectionName = $derived(
		role === 'students' ? 'Alumna/o' : role === 'teachers' ? 'Maestra/o' : 'Supervisor(a)'
	);

	let handleAddFromFile = async (e: SubmitEvent) => {
		e.preventDefault();

		if (!files) {
			status = 'No se ha seleccionado un archivo.';
			return;
		}

		let formData = new FormData();

		formData.append('file', files[0]);
		formData.append('collection', role);

		try {
			let data = await pb.addUsersFromFile(formData);
			if (data) {
				status = 'Usuarios añadidos correctamente.';
				success = true;
			}
		} catch (error) {
			status = 'Uno o más usuarios no pudieron ser añadidos.';
		}
		files = null;
	};
</script>

<svelte:window />
<article>
	<header class="flex justify-between">
		<h3>Añadir desde archivo CSV/XLSX a {collectionName}</h3>

		<button aria-label="Close" class="secondary" {onclick}
			>{#if onclick}<X class="w-6 h-6" />{/if}</button
		>
	</header>
	<p>
		Esta agregando a tabla de {collectionName}. Este método NO actualiza datos existentes, solo
		añade nuevos. Si desea reemplazar los datos existentes, primero elimine la tabla y luego suba el
		archivo.
	</p>
	<p>El archivo debe contener las columnas 'nombre', 'usuario', 'email', 'contraseña'</p>
	<p>El usuario debe ser distinto al correo, se recomienda usar la matricula.</p>
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
	<form onsubmit={handleAddFromFile}>
		<label for="role"
			>Rol
			<select id="role" name="role" bind:value={role} required>
				<option selected disabled value="">Seleccionar</option>
				<option value="students">Alumna/o</option>
				<option value="teachers">Maestra/o</option>
				<option value="supervisors">Supervisor(a)</option>
			</select>
		</label>
		<input
			bind:files
			type="file"
			accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
			required
		/>

		<button type="submit">Subir</button>
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
