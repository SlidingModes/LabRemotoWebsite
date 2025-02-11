<script lang="ts">

	/*
		 Este componente es una plantilla que incluye un encabezado, un pie de página y un contenido principal dinámico. 
 		También maneja el modo de visualización (claro/oscuro) y establece los metadatos de la página.
	*/
	
// Importa el componente Header desde la biblioteca de componentes.
	import Header from '$lib/components/Header.svelte';
// Importa el componente Footer desde la biblioteca de componentes.
	import Footer from '$lib/components/Footer.svelte';

// Importa estilos de PicoCSS para temas y colores.
	import '@picocss/pico/css/pico.conditional.red.min.css';
	import '@picocss/pico/css/pico.colors.min.css';
// Importa los estilos de la aplicación personalizada.
	import '../app.css';

// Importa la configuración de la aplicación desde un archivo de configuración.
	import * as config from '$lib/config';
// Desestructura children y data de las propiedades del componente.
	let { children, data } = $props();
// Importa el componente ModeWatcher para gestionar el modo de visualización (claro/oscuro).
	import ModeWatcher from '$lib/components/ModeWatcher.svelte';

// Determina si el usuario está logueado basado en los datos proporcionados.
let loggedIn = data.user !== null;
</script>

<svelte:head>
	<!-- Establece el título de la página utilizando la configuración importada. -->
	<title>{config.title}</title>
	<!-- Establece la descripción de la página utilizando la configuración importada. -->
	<meta name="description" content={config.description} />
</svelte:head>

<!-- Incluye el componente ModeWatcher que permite alternar entre modos de visualización. -->
<ModeWatcher />

<!-- Renderiza el componente Header, pasando la propiedad loggedIn para indicar el estado de inicio de sesión. -->
<Header {loggedIn} />
<main>
	<!-- Renderiza el contenido dinámico proporcionado en children. -->
	{@render children()}
</main>

<!-- Renderiza el componente Footer. -->
<Footer />
