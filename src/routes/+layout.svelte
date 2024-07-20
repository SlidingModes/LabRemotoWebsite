<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '../app.css';

	let { children } = $props();
</script>

<ModeWatcher />

<div class="layout">
	<Header />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
