<script lang="ts">
	import { description } from '$lib/config';
	import { pb } from '$lib/stores/pocketbase.svelte';
	import { LogIn } from 'lucide-svelte';
	let loggedIn = $derived(pb.authStoreIsValid());
</script>

<div class="pico container">
	<div class="container">
		<article class="grid">
			<div class="container">
				<hgroup>
					<h4>Facultad de Ingeniería, UNAM</h4>
					<h2>{description}</h2>
					<h3>Bienvenidos</h3>
				</hgroup>
				{#if !loggedIn}
					<p>Inicia sesión para ingresar a las prácticas.</p>
					<a href="/login" class="inline-flex items-center">
						Inicia sesión
						<LogIn class="w-4 h-4 ms-2" />
					</a>
				{:else}
					<p>Puedes reservar un horario o, si ya tienes uno, ingresar a la práctica.</p>

					<div class="text-center items-center">
						<a
							href="/practicas"
							class="text-white no-underline bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
							>Prácticas</a
						>
					</div>
				{/if}
			</div>

			<figure class="container text-center items-center my-auto">
				<enhanced:img
					src="$lib/assets/cover.jpg"
					alt="Laboratorio de Análisis de Sistemas y Señales. Imagen generada por IA."
					class="aspect-video object-cover"
				></enhanced:img>

				<figcaption>Imagen de Bing Image Generator.</figcaption>
			</figure>
		</article>
	</div>
</div>

<!-- svelte-ignore css_unused_selector -->
<style>
	article {
		border-radius: 1.5rem;
		background-image: '$lib/assets/cover.jpg';
	}

	img {
		display: inline;
	}

	article figure {
		margin: auto;
	}
</style>
