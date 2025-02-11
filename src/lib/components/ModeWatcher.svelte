<script lang="ts">
	/*
		RESUMEN:
		Este código asegura que el tema visual de la aplicación sea reactivo, persistente y sincronizado en tiempo real entre pestañas del navegador.
	*/

	// Importa un store personalizado llamado `modeWatcher` desde la carpeta `stores`.
	// Este store probablemente contiene métodos y propiedades relacionadas con el manejo del tema visual (modo claro/oscuro/personalizado).
	import { modeWatcher } from '$lib/stores/modeWatcher.svelte';

	// Define la función `handleStorage` para manejar el evento `storage`.
	// Este evento se activa cuando los datos en `localStorage` o `sessionStorage` cambian en otra pestaña o ventana del navegador.
	function handleStorage(event: StorageEvent) {
		// Comprueba si la clave modificada en el almacenamiento es 'theme'.
		if (event.key === 'theme') {
			// Evalúa el nuevo valor de la clave 'theme' para ajustar el tema en la aplicación.
			switch (event.newValue) {
				case null:
					// Si el valor es `null`, elimina el atributo `data-theme` del elemento raíz del documento.
					document.documentElement.removeAttribute('data-theme');
					break;
				case 'light':
					// Si el nuevo valor es 'light', establece `data-theme` en 'light' y llama a `modeWatcher.light()`.
					document.documentElement.setAttribute('data-theme', event.newValue);
					modeWatcher.light();
					break;
				case 'dark':
					// Si el nuevo valor es 'dark', establece `data-theme` en 'dark' y llama a `modeWatcher.dark()`.
					document.documentElement.setAttribute('data-theme', event.newValue);
					modeWatcher.dark();
					break;
				default:
					// Para cualquier otro valor, lo aplica como atributo `data-theme` y llama a `modeWatcher.custom()`.
					document.documentElement.setAttribute('data-theme', event.newValue);
					modeWatcher.custom(event.newValue);
					break;
			}
		}
	}

	// Usa `$effect` (un equivalente a la reactividad de Svelte) para aplicar el tema inicial.
	// Cuando `modeWatcher.mode` cambia, actualiza el atributo `data-theme` en el elemento raíz del documento.
	$effect(() => {
		document.documentElement.setAttribute('data-theme', modeWatcher.mode);
	});
</script>

<!-- Vincula la función `handleStorage` al evento `storage` del objeto `window`.
     Esto asegura que cualquier cambio en el almacenamiento relacionado con el tema (como 'theme') 
     se detecte automáticamente y actualice el tema visual. -->
<svelte:window on:storage={handleStorage} />
