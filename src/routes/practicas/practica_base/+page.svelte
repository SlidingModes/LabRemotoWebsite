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
    // Nueva variable para la amplitud de onda 
    let fechaPractica = new Date().toISOString().split('T')[0]; 
    // Asignar la fecha actual 
    let usuarioActivo = 'usuarioEjemplo'; 
    // Cambiar por el nombre de usuario autenticado 
    let numeroPractica = 1; 
    // Número de práctica (puedes obtener este dato dinámicamente) 
    let estadoPractica = 'start'; 
    // Estado de la práctica 
    let notas = 'Iniciando el experimento'; 
    // Notas adicionales para el registro 
    // Bloqueo del botón después de ser presionado 
    function bloquearButton(){
        // Bloquea el botón
        var buttonSend = document.getElementById('enviarBtn') as HTMLButtonElement;
        buttonSend.disabled = true ; 
        buttonSend.innerHTML = "Enviado"; 
    }


    // ------------------------------------------------------------
    const formData = { 
            ampl: amplitudOnda, 
            fecha_practica: fechaPractica, 
            usuario_activo: usuarioActivo, 
            numero_practica: numeroPractica, 
            estado_practica: estadoPractica, 
            notas: notas 
    };

    const enviarDatos = async () => {

        if(!amplitudOnda){
            alert("Por favor, ingresa un valor.");
            return;
        }

        try {
            // send to data to server 
            const responseEntrada = await fetch("http://loccalhost:3000/guardar-entrada", {
                method: "POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body: JSON.stringify({ 
                    ampl:formData.ampl, 
                    fecha_practica:formData.fecha_practica,
                    usuario_activo:formData.usuario_activo,
                    numero_practica:formData.numero_practica,
                    estado_practica:formData.estado_practica,
                    notas:formData.notas }),
            });

            if(!responseEntrada.ok){
                throw new Error("Error al enviar los datos dde entrada");
            }

            

        } catch (error){
            console.error("Error:", error);
            alert("Hubo un error al enviar los datos al servidor");
        }

    }
    // ------------------------------------------------------------
    /*

    // Función asíncrona para manejar el envío del formulario 
    async function handleSubmit(e: SubmitEvent) { 
        e.preventDefault(); // Evitar que el formulario se recargue
        
        // Preparar los datos para enviar al servidor 
        const formData = { 
            ampl: amplitudOnda, 
            fecha_practica: fechaPractica, 
            usuario_activo: usuarioActivo, 
            numero_practica: numeroPractica, 
            estado_practica: estadoPractica, 
            notas: notas 
        };
        
        try { 
            // Enviar una solicitud POST al servidor con los parámetros 
            const response = await fetch(url + '/api/run-simulation', { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                }, 
                body: JSON.stringify(formData) // Convertir los datos en formato JSON
            });
            
            if (response.ok) { 
                const data = await response.json(); 
                console.log('Práctica registrada correctamente:', data); 
                alert('Práctica registrada correctamente con ID: ' + data.idPractica); // Mensaje de éxito 
                bloquearButton(); // Bloquear el botón después de enviar el formulario 
            } else { 
                console.error('Error en la respuesta:', response.statusText); 
                alert('Hubo un error al registrar la práctica');
            }
        } catch (error) { 
            console.error('Error al enviar la solicitud:', error);
            alert('Hubo un error en la solicitud'); 
        }
    } */

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
            <form onsubmit={enviarDatos}>

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
                <button type="submit" id="enviarBtn"> Enviar </button>

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
