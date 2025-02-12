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

    // Declara las variables para los datos del formulario
    let amplitudOnda = $state(0); // Nueva variable para la amplitud de onda
    

    function bloquearButton(){
        // Bloquea el botón
        var buttonSend = document.getElementById('enviarBtn') as HTMLButtonElement;
        buttonSend.disabled = true ; 
        buttonSend.innerHTML = "Enviado"; 
    }

    // Función asíncrona para manejar el envío del formulario
    async function handleSubmit(e: SubmitEvent) {
        // Evita que la página se recargue al enviar el formulario
        e.preventDefault();

        // Prepara los datos en formato codificado para enviarlos al servidor
        const formData = new URLSearchParams();
        formData.append('amplitudOnda', String(amplitudOnda)); // Agrega la amplitud de onda

        try {
            // Envía una solicitud POST al servidor con los parámetros
            const response = await fetch(url + '/api/submit_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData // Los datos a enviar
            });

            if (response.ok) {
                // Convierte la respuesta en un Blob para manipular archivos binarios
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);

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
                console.error('Error en la respuesta:', response.statusText);
            }
        } catch (error) {
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
            <h1>Práctica 01 - Amplitud</h1> <!-- Título de la página -->
        </header>

        <hgroup>
            <p>Esta práctica tiene como objetivo que el estudiante pueda familiarizarse con la manipulación de varios parámetros de una señal, así en un principio se va a trabajar con la amplitud, recordemos que la amplitud se puede definir como “es la distancia entre el punto más alejado de una onda y el punto de equilibrio o medio.”, se debe tener en cuenta los límites de amplitud al momento de manipular la señal que se introducirá al equipo, los cuales son de 0.2 y 0.5.</p>
        </hgroup>
        <hr />

        <div class="grid">

            <div>
                <!-- Componente para mostrar el video en streaming -->
                <VideoStreamPlayer {streamURL} {streamKey} />
            </div>

            <!-- Formulario para capturar los valores de p, q y la amplitud de onda -->
            <form onsubmit={handleSubmit}>

                <!-- Valores entre 0.2 y 0.5 -->
                <hgroup>
                    <b>Desarrollo</b>
                    <small>
                        <p> 1.        Escoge un valor de amplitud que se encuentre dentro de los límites que se comentaron.</p>
                        <p>2.        Envía el valor de amplitud y observa cómo responde el equipo.</p>
                    </small>
                </hgroup>

                <label>
                    Amplitud de onda
                    <!-- Range slider control -->
                    <input 
                        type="range" 
                        bind:value={amplitudOnda} 
                        min="0.2" 
                        max="0.5" 
                        step="0.01" 
                        id="amplitudOnda" 
                        name="amplitudOnda" 
                    />
                    <span><h6>{amplitudOnda}</h6></span> <!-- Mostrar el valor actual -->
                </label>

                <!--button type="submit">Enviar</button-->
                <button type="submit" id="enviarBtn" onclick={bloquearButton}> Enviar </button>

            </form>

        </div>

        <hgroup>
            <p>Al terminar el experimento se devolverán los datos que, de la señal de entrada y la señal de salida, estos se deben graficar por medio de Matlab y observar las diferencias.
            Repite de nuevo con diferentes valores.  </p>
        </hgroup>

        <footer>
            <hr />
        </footer>
    </article>
</div>
