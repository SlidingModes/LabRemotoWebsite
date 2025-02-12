<script lang="ts">
    // Importa el ícono `TvMinimalPlay` desde la biblioteca `lucide-svelte`.
    import { TvMinimalPlay } from 'lucide-svelte';

    // Declara las variables `streamURL` y `streamKey` que se reciben como propiedades del componente.
    // Estas deben ser cadenas de texto (`string`) y se desestructuran de `$props()`.
    let {
        streamURL,
        streamKey
    }: {
        streamURL: string;
        streamKey: string;
    } = $props();

    // Declara una variable `videoPlayer` que será una referencia al elemento HTML `<video>`.
    // Se inicializa con `$state()` para gestionar su estado reactivo.
    let videoPlayer: HTMLMediaElement = $state()!;

    // Declara una variable `connectionState` para rastrear el estado de la conexión WebRTC.
    // Se inicializa con el valor `'disconnected'` usando `$state()`.
    let connectionState: string = $state('disconnected');

    // Usa `$inspect` para depurar y observar cambios en `connectionState`.
    $inspect(connectionState);

    /**
     * Configura la conexión peer-to-peer (WebRTC) para recibir audio y video.
     * @param peerConnection - Instancia de RTCPeerConnection.
     */
    async function setupPeerConnection(peerConnection: RTCPeerConnection) {
        try {
            // Maneja el evento `ontrack`, que se activa cuando se recibe un stream de audio o video.
            peerConnection.ontrack = (event) => {
                // Asigna el primer stream recibido al atributo `srcObject` del elemento `<video>`.
                videoPlayer.srcObject = event.streams[0];
            };

            // Maneja el cambio de estado de la conexión ICE.
            peerConnection.oniceconnectionstatechange = () => {
                // Actualiza el estado de la conexión con el valor actual del ICE connection state.
                connectionState = peerConnection.iceConnectionState;
            };

            // Crea una oferta SDP para iniciar la negociación WebRTC.
            const offer = await peerConnection.createOffer();
            // Establece la descripción local de la conexión con la oferta creada.
            await peerConnection.setLocalDescription(offer);

            // Envía la oferta al servidor mediante una solicitud POST.
            const response = await fetch(streamURL, {
                method: 'POST',
                body: peerConnection.localDescription ? peerConnection.localDescription.sdp : null,
                headers: {
                    Authorization: `Bearer ${streamKey}`, // Incluye la clave de autenticación.
                    'Content-Type': 'application/sdp' // Especifica el tipo de contenido como SDP.
                }
            });

            // Verifica si la respuesta del servidor es válida.
            if (!response.ok) {
                throw new Error('Failed to send offer to server');
            }

            // Obtiene la respuesta del servidor (la descripción remota).
            const answer = await response.text();

            // Establece la descripción remota de la conexión con la respuesta del servidor.
            await peerConnection.setRemoteDescription({
                sdp: answer,
                type: 'answer'
            });
        } catch (error) {
            // Captura y registra cualquier error ocurrido durante el proceso.
            console.log('An error occurred: ' + (error as Error).message);
        }
    }

    // Usa `$effect` para ejecutar lógica cuando el componente se monta.
    $effect(() => {
        // Crea una nueva instancia de RTCPeerConnection para manejar la conexión WebRTC.
        const peerConnection = new RTCPeerConnection();

        // Añade transceptores para recibir audio y video en modo "recvonly".
        peerConnection.addTransceiver('audio', { direction: 'recvonly' });
        peerConnection.addTransceiver('video', { direction: 'recvonly' });

        // Configura la conexión peer llamando a la función `setupPeerConnection`.
        setupPeerConnection(peerConnection);
    });
</script>

<!-- Contenedor principal con margen vertical -->
<div class="my-8">
    <!-- Si el estado de la conexión es "disconnected", muestra un indicador de carga -->
    {#if connectionState === 'disconnected'}
        <div
            role="status"
            class="flex items-center justify-center aspect-video h-auto w-full max-w-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700"
        >
            <!-- Ícono de reproducción animado -->
            <TvMinimalPlay class="w-20 h-20 text-gray-200 dark:text-gray-600" />
            <span class="sr-only">Loading...</span>
        </div>
    <!-- Si el estado de la conexión no es "disconnected", muestra el reproductor de video -->
    {:else}
        <video bind:this={videoPlayer} autoplay muted controls class="video-container">
            <!-- Pista de subtítulos (opcional) -->
            <track kind="captions" />
            <!-- Mensaje de fallback para navegadores que no soportan el elemento `<video>` -->
            Your browser does not support the video tag.
        </video>
    {/if}
</div>

<style>
    .video-container {
        width: 95%; /* 1/3 de la pantalla */
        height: auto; /* Altura automática para mantener la relación de aspecto */
        margin: 0 auto; /* Centrado horizontal */
        display: block; /* Asegura que el video se comporte como un bloque */
    }
</style>