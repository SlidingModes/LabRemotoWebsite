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
</script>

{#snippet navLinks()}
  
	<form role="group">		 
		<fieldset dir="rtl" >

			<a href="/posts">
				<button class="secondary">
						Avisos 
				</button>
			</a>

			<a href="/admin">
				<button class="secondary">
					Administrar
				</button>
			</a>

			<a href="/practicas" >
				<button class="secondary">
						Prácticas  
				</button>
			</a>

			<a href="/" >
				<button class="secondary">
							Inicio    
				</button>
			</a>

		</fieldset>
	</form>	
	

{/snippet}

<header class="pico container">
	<nav>

		<!-- Botón de inicio de sesión. -->
		<ul>
			<li><LogInButton /></li>
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

		
		
		<!-- Botones de la derecha: modo oscuro y menú desplegable. -->
		<ul>
			<li class="rightButtons">
				
				<button class="secondary" onclick={() => (openDrawer = !openDrawer)}>
					<summary>
						<Menu class="w-5 h-5" /> <!-- Ícono del menú. --> Menú
					</summary>
				</button>

				<p>&nbsp; </p>
				
				<DarkModeButton /> <!-- Botón de modo oscuro. -->
			</li>
		</ul>	
		

	</nav>
	{#if openDrawer}
		<nav transition:slide>
			<div class="container-fluid left-0">
				<aside class="text-right">
					{@render navLinks()}
				</aside>
			</div>
		</nav>
	{/if}

</header>

<style>
	.rightButtons {
		display: flex;
	}


	
</style>