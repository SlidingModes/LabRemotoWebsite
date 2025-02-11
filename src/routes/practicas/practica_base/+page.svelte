<script lang="ts">
    // Importa el componente que maneja la visualización de un flujo de video en vivo
    import VideoStreamPlayer from '$lib/components/VideoStreamPlayer.svelte';
    // Importa el componente que muestra un modal para iniciar sesión cuando es requerido
    import LoginRequiredModal from '$lib/components/LoginRequiredModal.svelte';
    // Importa configuraciones globales del proyecto
    import { url, streamURL, streamKey } from '$lib/config';
    // Importa la instancia de PocketBase para manejar autenticación y otras funciones
    import { pb } from '$lib/pb/pocketbase.svelte';

    // Declara variables inicializadas en 0, probablemente usadas como entradas de usuario
    // svelte-ignore non_reactive_update
	let ampl = void onstate(0.25); // Valor predeterminado de Ampl
    let isLoading = false; // Estado para deshabilitar el botón mientras se procesa la solicitud
    let message = ''; // Mensaje de éxito o error

    // Función asíncrona para manejar el envío del formulario
    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault(); // Evita que la página se recargue al enviar el formulario

        // Validar que Ampl esté dentro del rango [0.2, 0.5]
		if ( ampl ){
			if ( ampl < 0.2 || ampl > 0.5) {
				message = 'El valor de Ampl debe estar entre 0.2 y 0.5.';
				return;
			}
		}

        isLoading = true; // Habilita el estado de carga
        message = ''; // Limpia el mensaje anterior

        // Prepara los datos a enviar al servidor
        const formData = {
            ampl: ampl, // Valor de Ampl ingresado por el usuario
            fecha_practica: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
            usuario_activo: /*pb.authStore.model?.username ||*/ 'Usuario Anónimo', // Nombre del usuario activo
            numero_practica: 1, // Número de práctica (puedes ajustarlo según tus necesidades)
            estado_practica: 'processing', // Estado inicial de la práctica
            notas: 'Práctica iniciada desde la interfaz de usuario' // Notas adicionales
        };

        try {
            // Envía una solicitud POST al servidor con los datos
            const response = await fetch(url + '/api/run-simulation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // Los datos a enviar
            });

            if (response.ok) {
                // Si la respuesta es exitosa, muestra un mensaje
                message = 'La simulación ha comenzado. Verifica los resultados más tarde.';
            } else {
                // Muestra un error si la respuesta no es exitosa
                console.error('Error en la respuesta:', response.statusText);
                message = 'Hubo un error al iniciar la simulación.';
            }
        } catch (error) {
            // Maneja errores que ocurran durante la solicitud
            console.error('Error en la solicitud:', error);
            message = 'Ocurrió un error al comunicarse con el servidor.';
        } finally {
            isLoading = false; // Deshabilita el estado de carga
        }
    }


	function onstate(arg0: number) {
    	throw new Error('Function not implemented.');
	}

</script>

<div class="pico container">
    <!-- Muestra un modal si el usuario no ha iniciado sesión -->
    {#if !pb.isLoggedIn()}
        <dialog open={!pb.isLoggedIn()}>
            <p>Debes iniciar sesión para continuar.</p>
        </dialog>
    {/if}
</div>

<div class="pico container">
    <article>
        <header>
            <h1>Simulación de Práctica</h1> <!-- Título de la página -->
        </header>
        <div class="grid">
            <div>
                <!-- Componente para mostrar el video en streaming -->
                <VideoStreamPlayer {streamURL} {streamKey} />
            </div>
            <!-- Formulario para capturar el valor de Ampl -->
            <form onsubmit={handleSubmit}>
                <label>
                    Valor para Ampl (entre 0.2 y 0.5)
                    <!-- Entrada de número para el valor de Ampl -->
                    <input
                        type="number"
                        bind:value={ampl}
                        min="0.2"
                        max="0.5"
                        step="0.01" />
                </label>
                <!-- Botón para enviar el formulario -->
                <button type="submit" disabled={isLoading}>Iniciar Simulación</button>
				<br>
                <p class="message">{message}</p>
            </form>
        </div>
    </article>
</div>