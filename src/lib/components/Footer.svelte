<script lang="ts">
	import * as config from '$lib/config';
</script>

<!-- Footer -->
<footer class="pico container text-center">
	<hr />
	<p>
		{config.title} - Análisis de Sistemas y Señales &copy <a href="https://www.ingenieria.unam.mx/">FI - UNAM </a>  {new Date().getFullYear()}
	</p>
</footer>

<style>

	footer {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;  /* Hace que el footer ocupe todo el ancho */
		z-index: 10;
		background-color: var(--pico-color-primary);
		display: flex; /* Usa flexbox */
		justify-content: center; /* Centra horizontalmente */
		align-items: center; /* Centra verticalmente */
		padding: 10px; /* Agrega un poco de espacio */
		text-align: center; /* Asegura que el texto se mantenga centrado */
	}
		
</style>
