<script lang="ts">
	import { Info, Trash2 } from 'lucide-svelte';
	import { pb } from '$lib/pb/pocketbase.svelte';
	import { fade } from 'svelte/transition';

	import LoginRequiredModal from '$lib/components/LoginRequiredModal.svelte';

	let now = new Date();
	if (now.getMinutes() > 30) {
		now.setMinutes(30, 0, 0);
	} else {
		now.setMinutes(0, 0, 0);
	}
	let reservationPick = $state(now);
	let reservation = $derived(new Date(reservationPick));
	async function handleSchedule(event: SubmitEvent) {
		event.preventDefault();
		try {
			await pb.instance
				.collection('schedules')
				.create({ time: reservation.toISOString(), requesterId: pb.loggedUser!.username });

			status = 'Horario reservado correctamente';
			success = true;
			window.location.reload();
		} catch {
			status = 'El horario ya está reservado';
		}
	}
	type Schedule = {
		id?: string;
		horario: Date;
		usuario: string;
	};

	function toISOString(date: Date): string {
		return date
			.toLocaleString('ja-JP', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
			.replace(', ', 'T')
			.replace(/\//g, '-');
	}

	async function ultimaReservacion() {
		try {
			const data = await pb.instance
				.collection('schedules')
				.getFirstListItem(
					`(requesterId='${pb.loggedUser!.username}' && time>='${now.toISOString().replace('T', ' ')}')`
				);

			horarioReservado = {
				id: data.id,
				horario: new Date(data.time),
				usuario: data.requesterId
			};
		} catch {
			horarioReservado = undefined;
		}
	}
	let horarioReservado: Schedule | undefined = $state(undefined);

	let dataFromPB: Schedule[] = $state([]);
	let status = $state('');
	let success = $state(false);

	let selectDate = $state(formatDate(now));
	$effect(() => {
		ultimaReservacion();
	});
	let startDay: Date = $derived.by(() => {
		let startDate = new Date(selectDate);
		startDate.setUTCDate(startDate.getUTCDate() + 1);
		startDate.setHours(0, 0, 0, 0);
		return startDate;
	});

	let nextDay: Date = $derived(new Date(startDay.getTime() + 24 * 60 * 60 * 1000));

	function formatDate(date: Date): string {
		return date
			.toLocaleString('ja-JP', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
			.replace(/\//g, '-');
	}

	function filterDate(date: Date): string {
		return date.toISOString().replace('T', ' ');
	}

	async function fillTable() {
		try {
			const records = await pb.instance.collection('schedules').getList(undefined, undefined, {
				filter: `(time>='${filterDate(startDay)}' && time<'${filterDate(nextDay)}')`,
				skipTotal: true
			});

			dataFromPB = records.items.map((record) => {
				return {
					horario: new Date(record.time),
					usuario: record.requesterId
				};
			});
		} catch {
			dataFromPB = [];
		}
	}

	$effect(() => {
		fillTable();
	});
</script>

<div class="pico container">
	{#if !pb.isLoggedIn()}
		<dialog open={!pb.isLoggedIn()} transition:fade>
			<LoginRequiredModal />
		</dialog>
	{/if}
</div>

<div class="pico container">
	<article>
		{#if horarioReservado}
			<hgroup>
				<h4>Ya tienes una reservación</h4>
				<!-- Si el horario es en la siguiente media hora -->
				{#if horarioReservado.horario <= new Date(now.getTime() + 30 * 60000) && horarioReservado.horario >= now}
					<h3>Bienvenida/o</h3>
					<p>Tendrás 30 minutos a partir de {horarioReservado.horario.toLocaleString('es-MX')}</p>
					<h4 class="text-center"><a href="/practicas/lab">Entrar</a></h4>
					<p>Es posible que debas desactivar tu AdBlocker</p>
				{:else}
					<div class="grid">
						<div>
							<h3>No tienes acceso en este momento.</h3>
							<h4>Podrás entrar el {horarioReservado.horario.toLocaleString('es-MX')}</h4>
						</div>
						<div class="text-right">
							<button
								class="inline-flex items-center outline contrast"
								onclick={async () => {
									try {
										await pb.instance.collection('schedules').delete(horarioReservado!.id!);
										window.location.reload();
									} catch {
										status = 'No se pudo cancelar la reservación';
									}
								}}
								><Trash2 class="w-4 h-4 lg:mr-1" />
								<p class="hidden lg:contents">Borrar reservación</p></button
							>
						</div>
					</div>
				{/if}
			</hgroup>
		{:else}
			<header>
				<hgroup>
					<h3>No tienes ningún horario reservado.</h3>
					<h4>Para acceder, selecciona una hora. Contarás con 30 minutos a la hora elegida.</h4>
				</hgroup>
			</header>
			<form onsubmit={handleSchedule}>
				<fieldset class="grid">
					<input
						type="datetime-local"
						name="datetime-local"
						aria-label="Datetime local"
						bind:value={reservationPick}
						step="1800"
						min={toISOString(now)}
						required
					/>
					<input type="submit" value="Solicitar" />
				</fieldset>
			</form>
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
		{/if}

		<div class="flex justify-between">
			<h3>Horarios reservados</h3>
			<div class="inline-block">
				<input type="date" bind:value={selectDate} name="selectDate" id="selectDate" />
			</div>
		</div>

		<div class="overflow-auto">
			<table class="striped">
				<thead>
					<tr>
						<th scope="col">Usuario</th>
						<th scope="col">Horario</th>
					</tr>
				</thead>
				<tbody>
					{#if dataFromPB!.length === 0}
						<tr in:fade>
							<td colspan="2"><h3>No se encontraron horarios reservados</h3></td>
						</tr>
					{/if}
					{#each dataFromPB! as schedule}
						<tr in:fade>
							<td>{schedule.usuario}</td>
							<td
								>{schedule.horario.toLocaleString('es-MX', {
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</article>
</div>
