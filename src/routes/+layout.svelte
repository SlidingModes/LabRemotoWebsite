<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '@picocss/pico/css/pico.conditional.red.min.css';
	import '@picocss/pico/css/pico.colors.min.css';
	import '../app.css';

	import * as config from '$lib/config';
	let { children, data } = $props();
	import ModeWatcher from '$lib/components/ModeWatcher.svelte';

	let loggedIn = data.user !== null;
</script>

<svelte:head>
	<title>{config.title}</title>
	<meta name="description" content={config.description} />
</svelte:head>

<ModeWatcher />

<Header {loggedIn} />
<main>
	{@render children()}
</main>

<Footer />
