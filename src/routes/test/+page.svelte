<script lang="ts">
	import { read } from '$app/server';
	import { DropdownMenu } from 'bits-ui';
	import PocketBase, { ClientResponseError } from 'pocketbase';

	import type { RecordModel } from 'pocketbase';
	import { addSortBy, addColumnFilters } from 'svelte-headless-table/plugins';
	import { get } from 'svelte/store';
	import { pb } from '$lib/stores/pocketbase.svelte';

	type User = {
		id: string;
		name: string;
		username: string;
		email: string;
		collectionName: string;
		collectionId: string;
	};

	function mapUser(record: RecordModel): User {
		return {
			id: record.id,
			name: record.name,
			username: record.username,
			email: record.email,
			collectionName: record.collectionName,
			collectionId: record.collectionId
		};
	}

	const data = {
		username: 'test',
		email: 'test@example.com',
		emailVisibility: true,
		password: '1234567890',
		passwordConfirm: '1234567890',
		name: 'test'
	};

	async function deleteUser(user: User) {
		try {
			const record = await pb.instance.collection('students').delete(user.id);
			console.log('Record deleted', record);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.log(error.data.data);
			}
		}
	}

	async function createUser(): Promise<User | null> {
		try {
			return await pb.instance.collection('students').create(data);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.log(error.data.data);
			}
			return null;
		}
	}

	let loading = $state(true);
	let dataFromPB: User[] = $state([]);
	$inspect(dataFromPB);
	async function getAll(): Promise<User[] | null> {
		try {
			const records = await pb.instance.collection('students').getFullList({
				sort: 'name'
			});
			return records.map(mapUser);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.error('No encontrado', error);
			}
			return null;
		}
	}

	async function getByName(name: string): Promise<User | null> {
		try {
			// or fetch only the first record that matches the specified filter
			const record = await pb.instance.collection('students').getFirstListItem(`name='${name}'`);
			return mapUser(record);
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.error('No encontrado', error);
			}
			return null;
		}
	}

	async function wrapSingleUser(user: Promise<User | null>): Promise<User[] | null> {
		return [await user] as User[];
	}

	async function printUser() {
		const user: User | null = await getByName('Antonio Dromundo');
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

	async function deleteByName(name: string) {
		const user = await getByName(name);
		if (user) {
			deleteUser(user);
		}
	}

	async function passwordReset(email: string): Promise<User | null> {
		try {
			// or fetch only the first record that matches the specified filter
			const record = await pb.instance.collection('students').requestPasswordReset(email);
			console.log('Password reset', record);
			return null;
		} catch (error) {
			if (error instanceof ClientResponseError) {
				console.error('No encontrado', error);
			}
			return null;
		}
	}
	$effect(() => {});
</script>

<div class="pico container">
	<div role="group">
		<button
			onclick={async () => {
				fillTable(() => wrapSingleUser(createUser()));
			}}>Create</button
		>
		<button
			onclick={async () => {
				fillTable(getAll);
			}}>Read</button
		>
		<button
			onclick={async () => {
				fillTable(() => wrapSingleUser(getByName('Antonio Dromundo')));
			}}>Find one</button
		>
		<button
			onclick={async () => {
				fillTable(() => deleteByName('test'));
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
		<div class="pico container overflow-auto">
			<table class="striped">
				<thead>
					<tr>
						<th scope="col"><input type="checkbox" /></th>
						<th scope="col">Nombre</th>
						<th scope="col">Usuario</th>
						<th scope="col">Email</th>
						<th scope="col"></th>
					</tr>
				</thead>
				<tbody>
					{#each dataFromPB as user}
						<tr>
							<td><input type="checkbox" /></td>
							<td>{user.name}</td>
							<td>{user.username}</td>
							<td>{user.email}</td>
							<td><button>Editar</button></td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
