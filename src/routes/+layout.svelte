<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '@picocss/pico/css/pico.conditional.red.min.css';
	import '../app.css';
	let { children } = $props();
	import { modeWatcher } from '$lib/stores.svelte';
	import ModeWatcher from '$lib/components/ModeWatcher.svelte';
</script>

<ModeWatcher />

<div>
	<header class="pico">
		<Header />
	</header>
	<main>
		{@render children()}
	</main>
	<footer class="pico">
		<Footer />
	</footer>
</div>
