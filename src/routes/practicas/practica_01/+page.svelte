<script lang="ts">
	// Importa el componente que maneja la visualización de un flujo de video en vivo
	import VideoStreamPlayer from '$lib/components/VideoStreamPlayer.svelte';
	// Importa el componente que muestra un modal para iniciar sesión cuando es requerido
	import LoginRequiredModal from '$lib/components/LoginRequiredModal.svelte';
	// Importa configuraciones globales del proyecto
	import { url, streamURL, streamKey } from '$lib/config';
	// Importa la instancia de PocketBase para manejar autenticación y otras funciones
	import { pb } from '$lib/pb/pocketbase.svelte';
	// Importa la transición `fade` para efectos visuales
	import { fade } from 'svelte/transition';

	// Declara un arreglo para almacenar parámetros dinámicos (p y q)
	let params = $state<number[]>([]);
	// Declara variables inicializadas en 0, probablemente usadas como entradas de usuario
	let p = $state(0);
	let q = $state(0);

	// Función asíncrona para manejar el envío del formulario
	async function handleSubmit(e: SubmitEvent) {
		// Evita que la página se recargue al enviar el formulario
		e.preventDefault();

		// Agrega los valores actuales de p y q al arreglo de parámetros
		params.push(p);
		params.push(q);

		// Prepara los datos en formato codificado para enviarlos al servidor
		const formData = new URLSearchParams();
		formData.append('params', p); // Agrega el valor de p
		formData.append('params', q); // Agrega el valor de q
		params = []; // Limpia el arreglo de parámetros después de preparar los datos

		try {
			// Envía una solicitud POST al servidor con los parámetros
			const response = await fetch(url + '/api/execute', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: formData // Los datos a enviar
			});

			if (response.ok) {
				// Convierte la respuesta en un Blob para manipular archivos binarios
				const blob = await response.blob();
				// Crea una URL temporal para el archivo descargado
				const url = URL.createObjectURL(blob);

				// Crea un enlace temporal para descargar el archivo
				const a = document.createElement('a');
				a.href = url;
				a.download = 'data.mat'; // Especifica el nombre del archivo descargado
				document.body.appendChild(a); // Añade el enlace al DOM
				a.click(); // Simula el clic para iniciar la descarga

				// Limpia el enlace y revoca la URL temporal
				document.body.removeChild(a);
				URL.revokeObjectURL(url);

				console.log('Archivo descargado con éxito.');
			} else {
				// Muestra un error en la consola si la respuesta no es exitosa
				console.error('Error en la respuesta:', response.statusText);
			}
		} catch (error) {
			// Maneja errores que ocurran durante la solicitud
			console.error('Error en la solicitud:', error);
		}
	}
</script>

<div class="pico container">
	<!-- Muestra un modal si el usuario no ha iniciado sesión -->
	{#if !pb.isLoggedIn()}
		<dialog open={!pb.isLoggedIn()} transition:fade>
			<LoginRequiredModal />
		</dialog>
	{/if}
</div>

<div class="pico container">

	<article>
		<header>
			<h1 align="center">Nombre de la Práctica 01</h1> <!-- Título de la página -->
		</header>

		<div class="grid">

			<div>
				<!-- Componente para mostrar el video en streaming -->
				<VideoStreamPlayer {streamURL} {streamKey} />
			</div>

			<!-- Formulario para capturar los valores de p y q -->
			<form onsubmit={handleSubmit}>
				<label>
					Valor para p
					<!-- Entrada de número para el valor de p -->
					<input type="number" bind:value={p} min="0" max="10" />
				</label>
				<label>
					Valor para q
					<!-- Entrada de número para el valor de q -->
					<input type="number" bind:value={q} min="20" max="100" />
				</label>
				<!-- Botón para enviar el formulario -->
				<button type="submit">Enviar</button>
			</form>

		</div>

	</article>
</div>
