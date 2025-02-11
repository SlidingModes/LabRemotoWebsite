<script lang="ts">
    // Importaciones necesarias
    import { description } from '$lib/config'; // Descripción general del proyecto
    import { pb } from '$lib/pb/pocketbase.svelte'; // Instancia de PocketBase para autenticación y roles
    import { LogIn } from 'lucide-svelte'; // Ícono de inicio de sesión

    // Variable derivada para verificar si el usuario está autenticado
    let loggedIn = $derived(pb.authStoreIsValid());
</script>

<!-- Contenedor principal con estilos de Pico CSS -->
<div class="pico container">

    <div class="container">

        <article class="grid">
            <!-- Sección de contenido principal -->
            <div class="container">
                <!-- Encabezado con información sobre la Facultad de Ingeniería -->
                <hgroup>
                    <h4>Facultad de Ingeniería, UNAM</h4>
                    <h2>{description}</h2> <!-- Descripción dinámica del proyecto -->
                    <h3>Bienvenidos</h3>
                </hgroup>

                <!-- Lógica condicional basada en el estado de autenticación y rol del usuario -->
                {#if !loggedIn}
                    <!-- Usuario no autenticado -->
                    <p>Inicia sesión para ingresar a las prácticas.</p>
                    <a href="/login" class="inline-flex items-center">
                        <button class="inline-flex items-center">
                            <div class="hidden md:block ms-2">
                                Inicia sesión <LogIn class="w-4 h-4 ms-2" /> <!-- Ícono de inicio de sesión -->
                            </div>
                        </button>
                    </a>
                {:else if !pb.isRole('students')}
                    <!-- Usuario autenticado pero no es estudiante -->
                    <p></p>
                    <p>Accede al panel de administrador para modificar a los usuarios</p>
                    <p>O revisa la página de prácticas</p>
                    <div class="text-center items-center">
                        <!-- Botón para acceder a las prácticas -->
                        <a href="/practicas" class="secondary no-underline rounded-lg text-sm px-4 py-2">
                            <button class="inline-flex items-center">
                                <div class="hidden md:block ms-2">Prácticas</div>
                            </button>
                        </a>
                        <!-- Botón para acceder al panel de administrador -->
                        <a href="/admin" class="button no-underline rounded-lg text-sm px-4 py-2">
                            <button class="inline-flex items-center">
                                <div class="hidden md:block ms-2">Admin Panel</div>
                            </button>
                        </a>
                    </div>
                {:else}
                    <!-- Usuario autenticado y es estudiante -->
                    <p>Puedes reservar un horario o, si ya tienes uno, ingresar a la práctica.</p>
                    <div class="text-center items-center">
                        <!-- Botón destacado para acceder a las prácticas -->
                        <a
                            href="/practicas"
                            class="text-white no-underline bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                        >
                            Prácticas
                        </a>
                    </div>
                {/if}
            </div>

            <!-- Imagen y pie de foto -->
            <!--figure class="container text-center items-center my-auto">
                <enhanced:img
                    src="https://i.postimg.cc/BQmRx52X/03-Frenos.png" 
                    alt="Laboratorio de Análisis de Sistemas y Señales"
                    class="aspect-video object-cover" 
                ></enhanced:img>
                <figcaption>Imagen de Bing Image Generator.</figcaption> 
            </figure-->
			
			<figure>

				<img
                    width="700"
				    src="https://i.postimg.cc/4NymtZ9T/home-02.jpg"
				    alt="Laboratorio Remoto"
				/>
				<figcaption>
				  Sistema de Frenos ABS - INTECO
				</figcaption>
			</figure>

        </article>

    </div>
</div>

<!-- Estilos personalizados -->
<style>
    /* Estilo del artículo principal */
    article {
        border-radius: 1.5rem; /* Bordes redondeados */
        background-image: '$lib/assets/cover.jpg'; /* Imagen de fondo (no utilizada) */
    }

    /* Estilo de las imágenes */
    img {
        display: inline; /* Asegura que las imágenes se muestren correctamente */
    }

    /* Centrado del contenido del figure */
    article figure {
        margin: auto;
    }

    /* Estilo del botón primario */
    .button {
        background-color: var(--pico-primary-background); /* Color de fondo primario */
        color: var(--pico-primary-inverse); /* Color de texto inverso */
        display: inline-flex; /* Alineación flexible */
        align-items: center; /* Centrado vertical */
    }

    /* Efecto hover para el botón primario */
    .button:hover {
        background-color: var(--pico-primary-hover-background); /* Cambio de color al pasar el mouse */
        text-decoration: none; /* Sin subrayado */
    }

    /* Estilo del botón secundario */
    .secondary {
        background-color: var(--pico-secondary-background); /* Color de fondo secundario */
        color: var(--pico-secondary-inverse); /* Color de texto inverso */
        display: inline-flex; /* Alineación flexible */
        align-items: center; /* Centrado vertical */
    }

    /* Efecto hover para el botón secundario */
    .secondary:hover {
        background-color: var(--pico-primary-hover-background); /* Cambio de color al pasar el mouse */
        text-decoration: none; /* Sin subrayado */
    }
</style>