<script lang="ts">
	import * as config from '$lib/config';
	import DarkmodeButton from './DarkmodeButton.svelte';
	import { Separator } from 'bits-ui';
	import { pb } from '$lib/stores/pocketbase.svelte';
	let loggedIn = $derived(pb.authStoreIsValid());
</script>

<header class="pico container">
	<nav>
		<!-- Title -->
		<ul>
			<li>
				<a href="/" class="title">
					<b>{config.title}</b>
				</a>
			</li>
		</ul>

		<!-- Navigation -->
		<ul>
			<li>
				<a href="/posts">Posts</a>
			</li>
			<li>
				{#if loggedIn}
					<button
						onclick={() => {
							pb.logout();
							window.location.href = '/';
						}}>Logout</button
					>
				{:else}
					<a href="/login" class="button">Inicia sesión</a>
				{/if}
			</li>
			<li><DarkmodeButton /></li>
		</ul>
	</nav>
</header>

<style>
	.button {
		background-color: var(--pico-primary-background);
		color: var(--pico-primary-inverse);
	}
	.button:hover {
		background-color: var(--pico-primary-hover-background);
		text-decoration: none;
	}
</style>
