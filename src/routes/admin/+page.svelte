<script lang="ts">
	import { pb } from '$lib/pb/pocketbase.svelte';
	import type { User } from '$lib/pb/pocketbase.svelte';
	import { UserRoundPlus, Upload } from 'lucide-svelte';
	import AddUser from '$lib/components/AddUser.svelte';
	const data = {
		name: 'test',
		username: 'test',
		email: 'test@example.com',
		emailVisibility: false,
		password: '1234567890',
		passwordConfirm: '1234567890'
	};

	let loading = $state(true);
	let dataFromPB: User[] = $state([]);
	let role = $state('Estudiante');
	let filterCondition: Function = () => true;
	let modalOpen = $state(false);

	async function wrapSingleUser(userPromise: Promise<User | null>): Promise<User[]> {
		const user = await userPromise;
		if (user) {
			return [user];
		} else {
			return [];
		}
	}

	async function printUser() {
		const user: User | null = await pb.getByName('Antonio Dromundo', 'students');
		if (user) {
			console.log(user);
		} else {
			console.log('No encontrado');
		}
	}

	async function fillTable(fun: Function) {
		const data = await fun();
		if (data) {
			dataFromPB = data;
			loading = false;
		}
	}

	function matchesField(user: User, field: string, value: string): boolean {
		return user[field as keyof User] === value;
	}

	function filterRow(user: User, filterCondition: Function): boolean {
		return filterCondition(user);
	}

	$effect(() => {
		fillTable(() => pb.getAll('students'));
	});
</script>

<div class="pico container">
	<dialog open={modalOpen}>
		<AddUser onclick={() => (modalOpen = false)} />
	</dialog>
</div>

<div class="pico container-fluid">
	<div role="group">
		<button
			onclick={async () => {
				fillTable(() => wrapSingleUser(pb.createUser('students', data)));
			}}>Create</button
		>
		<button
			onclick={async () => {
				fillTable(() => pb.getAll('students'));
			}}>Read</button
		>
		<button
			onclick={async () => {
				fillTable(() => wrapSingleUser(pb.getByName('Antonio Dromundo', 'students')));
			}}>Find one</button
		>
		<button
			onclick={async () => {
				fillTable(() => pb.deleteByName('test', 'students'));
			}}>Delete</button
		>
	</div>
	<h3>Alumnos</h3>
</div>

{#snippet DropdownCheckBox(titulo, opciones)}
	<details class="dropdown">
		<summary>{titulo}</summary>
		<ul>
			{#each opciones as opcion}
				<li>
					<label>
						<input type="checkbox" name={opcion} />
						{opcion}
					</label>
				</li>
			{/each}
		</ul>
	</details>
{/snippet}
<div class="pico container">
	<div class="text-right">
		<div class="inline-block">
			<select bind:value={role} aria-label="Rol" required>
				<option selected disabled value="Usuario">Ver</option>
				<option value="Usuario">Todos</option>
				<option value="Estudiante">Alumna/o</option>
				<option value="teachers">Maestra/o</option>
				<option value="supervisors">Supervisor(a)</option>
			</select>
		</div>

		<button class="inline-flex items-center outline contrast"
			><Upload class="w-4 h-4 lg:mr-1" />
			<p class="hidden lg:contents">Desde archivo</p></button
		>
		<button class="inline-flex items-center contrast" onclick={() => (modalOpen = true)}
			><UserRoundPlus class="w-4 h-4 lg:mr-1" />
			<p class="hidden lg:contents">Añadir</p></button
		>
	</div>
	<article>
		<hgroup>
			<h3>Usuarios</h3>
			<h6>Maneja quien tiene acceso al Laboratorio Remoto</h6>
		</hgroup>
		{#if loading}
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
		{:else}
			<div class="pico container">
				<div class="overflow-auto">
					<table class="striped">
						<thead>
							<tr>
								<th scope="col"><input type="checkbox" /></th>
								<th scope="col">Nombre</th>
								<th scope="col">Usuario</th>
								<th scope="col">Email</th>
								<th scope="col">Rol</th>
							</tr>
						</thead>
						<tbody>
							{#if dataFromPB!.length === 0}
								<tr>
									<td colspan="4">No se encontraron usuarios</td>
								</tr>
							{/if}
							{#each dataFromPB! as user}
								{#if role.match('Usuario') || matchesField(user, 'role', role)}
									<tr>
										<td><input type="checkbox" /></td>
										<td>{user.name}</td>
										<td>{user.username}</td>
										<td>{user.email}</td>
										<td>{user.role}</td>
									</tr>
								{/if}
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</article>
</div>

<style>
	.pico article {
		--pico-border-radius: 1.5rem;
	}
</style>
