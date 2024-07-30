<script lang="ts">
	import { pb } from '$lib/pb/pocketbase.svelte';
	import type { User } from '$lib/pb/pocketbase.svelte';
	import { UserRoundPlus, Upload, Undo2, RefreshCcw } from 'lucide-svelte';
	import AddUser from '$lib/components/AddUser.svelte';
	import AddFromFile from '$lib/components/AddFromFile.svelte';
	import { fade } from 'svelte/transition';
	import LoginRequiredModal from '$lib/components/LoginRequiredModal.svelte';
	import UnauthorizedModal from '$lib/components/UnauthorizedModal.svelte';

	let { data } = $props();

	let loading = $state(true);
	let dataFromPB: User[] = $state([]);
	let role = $state('students');
	let addUserModal = $state(false);
	let addFromFileModal = $state(false);
	let selectedUsers: User[] = $state([]);
	let search = $state('');

	$inspect(selectedUsers);

	async function handleSearch() {
		fillTable(async () => {
			if (search) {
				try {
					const user = await wrapSingleUser(
						pb.getFirstListItem(
							role,
							`(name~'${search}' || username~'${search}' || email~'${search}')`
						)
					);
					return user;
				} catch (error) {
					return [];
				}
			} else {
				return pb.getAll(role);
			}
		});
	}

	async function wrapSingleUser(userPromise: Promise<User | null>): Promise<User[]> {
		const user = await userPromise;
		if (user) {
			return [user];
		} else {
			return [];
		}
	}

	async function fillTable(fun: Function) {
		const data = await fun();
		if (data) {
			dataFromPB = data;
			loading = false;
		}
	}

	async function handleDelete() {
		for (const user of selectedUsers) {
			await pb.deleteUser(user);
		}
		window.location.reload();
	}

	$effect(() => {
		if (!search) {
			fillTable(() => pb.getAll(role));
		}
	});
</script>

<div class="pico container">
	{#if !pb.isLoggedIn()}
		<dialog open={!pb.isLoggedIn()} transition:fade>
			<LoginRequiredModal />
		</dialog>
	{:else if pb.isRole('students')}
		<dialog open={pb.isRole('students')} transition:fade>
			<UnauthorizedModal />
		</dialog>
	{/if}
	{#if addUserModal}
		<dialog open={addUserModal} transition:fade>
			<AddUser onclick={() => (addUserModal = false)} />
		</dialog>
	{/if}
	{#if addFromFileModal}
		<dialog open={addFromFileModal} transition:fade>
			<AddFromFile onclick={() => (addFromFileModal = false)} collection={role} />
		</dialog>
	{/if}
</div>

<div class="pico container">
	<div class="text-right">
		<div class="inline-block">
			<select bind:value={role} aria-label="Rol" required>
				<option selected disabled value="Usuario">Ver</option>
				<option value="students">Alumna/o</option>
				<option value="teachers">Maestra/o</option>
				<option value="supervisors">Supervisor(a)</option>
			</select>
		</div>
		<button
			transition:fade
			class="inline-flex items-center outline contrast"
			onclick={() => {
				search = '';
				fillTable(() => pb.getAll(role));
			}}
		>
			{#if search}
				<Undo2 class="w-4 h-4 lg:mr-1" />
				<p class="hidden lg:contents">Regresar</p>
			{:else}
				<RefreshCcw class="w-4 h-4 lg:mr-1" />
				<p class="hidden lg:contents">Actualizar</p>
			{/if}
		</button>
		<button
			class="inline-flex items-center outline contrast"
			onclick={() => (addFromFileModal = true)}
			><Upload class="w-4 h-4 lg:mr-1" />
			<p class="hidden lg:contents">Desde archivo</p></button
		>
		<button class="inline-flex items-center contrast" onclick={() => (addUserModal = true)}
			><UserRoundPlus class="w-4 h-4 lg:mr-1" />
			<p class="hidden lg:contents">Añadir</p></button
		>
	</div>
	<article>
		<header>
			<hgroup in:fade>
				<h3>Usuarios</h3>
				<h6>Maneja quien tiene acceso al Laboratorio Remoto</h6>
			</hgroup>

			{#if selectedUsers.length > 0}
				<div in:fade class="pico container">
					<div class="flex items-center justify-between">
						<h3>Seleccionados: {selectedUsers.length}</h3>

						<div>
							<button class="contrast" onclick={handleDelete}>Eliminar</button>
						</div>
					</div>
				</div>
			{:else}
				<!-- svelte-ignore a11y_no_redundant_roles -->
				<fieldset role="group">
					<input
						class="inline-flex"
						type="search"
						name="search"
						placeholder="Nombre, usuario, email"
						aria-label="Search"
						bind:value={search}
					/>
					<button onclick={handleSearch}>Buscar</button>
				</fieldset>
			{/if}
		</header>

		{#if !loading}
			<div class="pico container">
				<div class="overflow-auto">
					<table class="striped">
						<thead>
							<tr>
								<th scope="col"
									><input
										type="checkbox"
										checked={selectedUsers.length === dataFromPB!.length}
										onclick={() => {
											if (selectedUsers.length === dataFromPB!.length) {
												selectedUsers = [];
											} else {
												selectedUsers = dataFromPB!;
											}
										}}
									/></th
								>
								<th scope="col">Nombre</th>
								<th scope="col">Usuario</th>
								<th scope="col">Email</th>
								<th scope="col">Rol</th>
							</tr>
						</thead>
						<tbody>
							{#if dataFromPB!.length === 0}
								<tr in:fade>
									<td colspan="5"><h3>No se encontraron usuarios</h3></td>
								</tr>
							{/if}
							{#each dataFromPB! as user, i}
								<tr in:fade>
									<td
										><input
											type="checkbox"
											checked={selectedUsers.length === dataFromPB!.length}
											onclick={() => {
												if (selectedUsers[i] !== user) {
													selectedUsers[i] = user;
												} else {
													selectedUsers.splice(i, 1);
												}
											}}
										/></td
									>
									<td>{user.name}</td>
									<td>{user.username}</td>
									<td>{user.email}</td>
									<td>{user.role}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<div
				role="status"
				class="pico container p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
			>
				<div class="flex items-center justify-between">
					<div>
						<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
						<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
					<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
				</div>
				<div class="flex items-center justify-between pt-4">
					<div>
						<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
						<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
					<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
				</div>
				<div class="flex items-center justify-between pt-4">
					<div>
						<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
						<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
					<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
				</div>
				<div class="flex items-center justify-between pt-4">
					<div>
						<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
						<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
					<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
				</div>
				<div class="flex items-center justify-between pt-4">
					<div>
						<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
						<div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
					</div>
					<div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
				</div>
				<span class="sr-only">Cargando...</span>
			</div>
		{/if}
	</article>
</div>

<style>
	.pico article,
	fieldset {
		--pico-border-radius: 1.5rem;
	}
	.pico h3 {
		margin: auto inherit;
	}
</style>
