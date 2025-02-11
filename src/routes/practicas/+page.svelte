<script lang="ts">

	/*
		Importa las librerías necesarias y componentes.
	*/
	import { Info, Trash2 } from 'lucide-svelte'; // Importa íconos de lucide para el UI.
	import { pb } from '$lib/pb/pocketbase.svelte'; // Importa la instancia de PocketBase.
	import { fade } from 'svelte/transition'; // Importa la transición de desvanecimiento.

	import LoginRequiredModal from '$lib/components/LoginRequiredModal.svelte'; // Importa un modal para requerir login.

	// Establece la hora actual.
	let now = new Date(); 
	// Ajusta los minutos de la hora actual a la siguiente media hora o a la hora en punto.
	if (now.getMinutes() > 30) {
		now.setMinutes(30, 0, 0); // Si es mayor de 30, establece a 30 minutos.
	} else {
		now.setMinutes(0, 0, 0); // Si es menor o igual a 30, establece a 0 minutos.
	}
	// Guarda la hora seleccionada por el usuario.
	let reservationPick = $state(now); 
	// Crea un estado derivado de la hora seleccionada.
	let reservation = $derived(new Date(reservationPick)); 

	// Función para manejar la solicitud de programación de reservas.
	async function handleSchedule(event: SubmitEvent) {
		event.preventDefault(); // Previene el comportamiento por defecto del formulario.
		try {
			// Crea una nueva reserva en la colección de 'schedules'.
			await pb.instance
				.collection('schedules')
				.create({ time: reservation.toISOString(), requesterId: pb.loggedUser!.username });

			status = 'Horario reservado correctamente'; // Establece el estado de éxito.
			success = true; // Marca la operación como exitosa.
			window.location.reload(); // Recarga la página para reflejar los cambios.
		} catch {
			status = 'El horario ya está reservado'; // Maneja el error si el horario ya está reservado.
		}
	}

	// Define el tipo de objeto para las reservas.
	type Schedule = {
		id?: string; // ID opcional de la reserva.
		horario: Date; // Hora de la reserva.
		usuario: string; // Usuario que realiza la reserva.
	};

	// Función para convertir una fecha a formato ISO.
	function toISOString(date: Date): string {
		return date
			.toLocaleString('ja-JP', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false // Usa formato de 24 horas.
			})
			.replace(', ', 'T') // Reemplaza la coma y el espacio por 'T'.
			.replace(/\//g, '-'); // Reemplaza las barras por guiones.
	}

	// Función para obtener la última reserva del usuario.
	async function ultimaReservacion() {
		try {
			// Obtiene la última reserva del usuario que es mayor o igual a la hora actual.
			const data = await pb.instance
				.collection('schedules')
				.getFirstListItem(
					`(requesterId='${pb.loggedUser!.username}' && time>='${now.toISOString().replace('T', ' ')}')`
				);

			// Asigna los datos de la reserva a la variable correspondiente.
			horarioReservado = {
				id: data.id,
				horario: new Date(data.time),
				usuario: data.requesterId
			};
		} catch {
			horarioReservado = undefined; // Si no hay reserva, se establece como indefinido.
		}
	}

	// Estado para la reserva.
	let horarioReservado: Schedule | undefined = $state(undefined); 

	// Estado para los datos de reservas obtenidos de PocketBase.
	let dataFromPB: Schedule[] = $state([]); 
	let status = $state(''); // Estado para mensajes de estado.
	let success = $state(false); // Estado para marcar el éxito de la operación.

	// Estado para la fecha seleccionada por el usuario.
	let selectDate = $state(formatDate(now)); 

	// Efecto para obtener la última reserva cuando el componente se monta.
	$effect(() => {
		ultimaReservacion();
	});

	// Crea un nuevo objeto de fecha que comienza al día siguiente.
	let startDay: Date = $derived.by(() => {
		let startDate = new Date(selectDate);
		startDate.setUTCDate(startDate.getUTCDate() + 1); // Incrementa un día.
		startDate.setHours(0, 0, 0, 0); // Establece la hora a la medianoche.
		return startDate;
	});

	// Obtiene la fecha del día siguiente.
	let nextDay: Date = $derived(new Date(startDay.getTime() + 24 * 60 * 60 * 1000)); 

	// Función para dar formato a la fecha en 'YYYY-MM-DD'.
	function formatDate(date: Date): string {
		return date
			.toLocaleString('ja-JP', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
			.replace(/\//g, '-'); // Reemplaza las barras por guiones.
	}

	// Función para filtrar la fecha en formato ISO.
	function filterDate(date: Date): string {
		return date.toISOString().replace('T', ' '); // Reemplaza 'T' con un espacio.
	}

	// Función para llenar la tabla de horarios reservados.
	async function fillTable() {
		try {
			// Obtiene la lista de horarios reservados en el rango de fechas especificado.
			const records = await pb.instance.collection('schedules').getList(undefined, undefined, {
				filter: `(time>='${filterDate(startDay)}' && time<'${filterDate(nextDay)}')`,
				skipTotal: true // No obtiene el total de registros.
			});

			// Mapea los registros obtenidos a un formato más manejable.
			dataFromPB = records.items.map((record) => {
				return {
					horario: new Date(record.time), // Convierte el tiempo a un objeto Date.
					usuario: record.requesterId // Obtiene el ID del usuario que hizo la reserva.
				};
			});
		} catch {
			dataFromPB = []; // Si hay un error, establece el estado como un arreglo vacío.
		}
	}

	// Efecto para llenar la tabla cuando el componente se monta.
	$effect(() => {
		fillTable();
	});
</script>

<!-- Contenedor principal que utiliza la clase pico para estilos -->
<div class="pico container">
	{#if !pb.isLoggedIn()} <!-- Comprueba si el usuario no está logueado -->
		<dialog open={!pb.isLoggedIn()} transition:fade> <!-- Abre un modal si no está logueado -->
			<LoginRequiredModal /> <!-- Componente que muestra el modal de login requerido -->
		</dialog>
	{/if}
</div>

<div class="pico container">
	<article>
		{#if horarioReservado} <!-- Comprueba si hay una reserva existente -->
			<hgroup>
				<h4>Ya tienes una reservación</h4>
				<!-- Si el horario reservado es en la siguiente media hora -->
				{#if horarioReservado.horario <= new Date(now.getTime() + 30 * 60000) && horarioReservado.horario >= now}
					<h3>Bienvenida/o</h3>
					<p>Tendrás 30 minutos a partir de {horarioReservado.horario.toLocaleString('es-MX')}</p>
					<!-- Links a diferentes prácticas -->
					<h4 class="text-center"><a href="/practicas/lab">Entrar</a></h4>
					<h4 class="text-center"><a href="/practicas/practica_base">Práctica Base</a></h4> <!-- Acceso a práctica Base de ejemplo -->
					<h4 class="text-center"><a href="/practicas/practica_01">Práctica 01</a></h4>
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
										// Elimina la reserva actual.
										await pb.instance.collection('schedules').delete(horarioReservado!.id!);
										window.location.reload(); // Recarga la página después de eliminar.
									} catch {
										status = 'No se pudo cancelar la reservación'; // Manejo de errores al eliminar.
									}
								}}
								><Trash2 class="w-4 h-4 lg:mr-1" /> <!-- Icono de basura -->
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
			<!-- Formulario para solicitar una nueva reserva -->
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
					<input type="submit" value="Solicitar" /> <!-- Botón para enviar la solicitud -->
				</fieldset>
			</form>
			<!-- Muestra el estado de la operación -->
			{#if status}
				<div
					class="flex items-center p-4 mb-4 text-sm rounded-lg bg-gray-50 dark:bg-gray-800 {success
						? 'text-green-800 dark:text-green-400'
						: 'text-red-800 dark:text-red-400'}"
					role="alert"
				>
					<Info class="flex-shrink-0 inline w-4 h-4 me-1" />
					<span class="font-medium">{status}</span> <!-- Muestra el mensaje de estado -->
				</div>
			{/if}
		{/if}

		<div class="flex justify-between">
			<h3>Horarios reservados</h3>
			<div class="inline-block">
				<!-- Selector de fecha para filtrar los horarios reservados -->
				<input type="date" bind:value={selectDate} name="selectDate" id="selectDate" />
			</div>
		</div>

		<div class="overflow-auto">
			<table class="striped"> <!-- Tabla para mostrar los horarios reservados -->
				<thead>
					<tr>
						<th scope="col">Usuario</th> <!-- Cabecera de columna para Usuario -->
						<th scope="col">Horario</th> <!-- Cabecera de columna para Horario -->
					</tr>
				</thead>
				<tbody>
					{#if dataFromPB!.length === 0} <!-- Si no hay horarios reservados -->
						<tr in:fade>
							<td colspan="2"><h3>No se encontraron horarios reservados</h3></td>
						</tr>
					{/if}
					{#each dataFromPB! as schedule} <!-- Itera sobre los horarios reservados -->
						<tr in:fade>
							<td>{schedule.usuario}</td> <!-- Muestra el usuario de la reserva -->
							<td
								>{schedule.horario.toLocaleString('es-MX', {
									hour: '2-digit',
									minute: '2-digit',
									hour12: false
								})}</td
							> <!-- Muestra el horario reservado -->
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</article>
</div>
