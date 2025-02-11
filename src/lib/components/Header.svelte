<!-- 
Resumen:
Este código implementa un encabezado para una página web utilizando Svelte y TypeScript. Incluye un menú de navegación con enlaces, un botón para cambiar entre modos oscuro y claro, un menú desplegable animado con transiciones, un botón de inicio de sesión, un avatar dinámico, y un título basado en configuraciones externas. Los estilos son gestionados mediante clases CSS y se utiliza un diseño responsivo.
-->

<script lang="ts">
	// Importa configuraciones globales, componentes y librerías necesarias.
	import * as config from '$lib/config'; // Configuración global (por ejemplo, el título).
	import DarkModeButton from './DarkmodeButton.svelte'; // Componente de modo oscuro.
	import { Avatar } from 'bits-ui'; // Componente de avatar.
	import LogInButton from './LogInButton.svelte'; // Botón de inicio de sesión.
	import { Menu } from 'lucide-svelte'; // Ícono del menú de navegación.
	import { slide } from 'svelte/transition'; // Transición deslizante para animaciones.

	// Variable reactiva para gestionar la visibilidad del menú desplegable.
	let openDrawer = $state(false);
	//let openDrawer = false ;

	
</script>

{#snippet navLinks()}
  
	<!-- Bloque reutilizable para generar los enlaces de navegación. -->

	<ul >
		<li  >	  
			<!-- Cada enlace incluye un botón estilizado y texto solo visible en pantallas medianas. -->
			<a href="/" class="flex justify-center items-center">
				<button class="flex justify-center items-center">
					<div class="hidden md:block ms-2">Inicio</div>
				</button>
			</a>
			
			<a href="/practicas" class="inline-flex items-center">
				<button class="inline-flex items-center">
					<div class="hidden md:block ms-2">Prácticas</div>
				</button>
			</a>
			<a href="/admin" class="inline-flex items-center">
				<button class="inline-flex items-center">
					<div class="hidden md:block ms-2">Administrar</div>
				</button>
			</a>
			<a href="/posts" class="inline-flex items-center">
				<button class="inline-flex items-center">
					<div class="hidden md:block ms-2">Avisos</div>
				</button>
			</a>	
		</li>
	</ul>

{/snippet}

<header class="pico container">
	<!-- Encabezado principal con diseño responsivo. -->
	<nav>

		<!-- Botones de la derecha: modo oscuro y menú desplegable. -->
		<ul>
			<li class="rightButtons">
				
				<button class="secondary" onclick={() => (openDrawer = !openDrawer)}>
					<Menu class="w-5 h-5" /> <!-- Ícono del menú. -->
				</button>

				<p>&nbsp; </p>

				<DarkModeButton /> <!-- Botón de modo oscuro. -->
			</li>
		</ul>		

		<!-- Enlace al inicio con avatar y título dinámico -->
		<ul>

			<Avatar.Root class="h-5 w-5 secondary mr-2">
				<Avatar.Image src="/icon_somll.png" alt="Escudo Facultad de Ingeniería" />
				<Avatar.Fallback />
			</Avatar.Root>			

			<li>
				
			<a href="/" class="contrast inline-flex items-center">

					
				<div class="flex items-center">
					
					
					<b>{config.title}</b>
				</div>
			</a>
			</li>
		</ul>

		
		<!-- Botón de inicio de sesión. -->
		<ul>
			<li><LogInButton /></li>
		</ul>
		

	</nav>

	<!-- Menú desplegable con transición animada. -->
	{#if openDrawer}
		<nav transition:slide>
			<div class="container-fluid left-0">
				<aside class="text-right">
					{@render navLinks()} <!-- Renderiza los enlaces de navegación. -->
				</aside>
			</div>
		</nav>
	{/if}

</header>

<style>
	/* Estilo para alinear los botones de la derecha en una fila. */
	.rightButtons {
		display: flex;
	}
	
</style>

