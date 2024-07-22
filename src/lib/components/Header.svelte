<script lang="ts">
	import * as config from '$lib/config';
	import DarkmodeButton from './DarkmodeButton.svelte';
	import { Separator } from 'bits-ui';
	let loggedIn = false;
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
					<button onclick={() => (location.href = '/logout')}>Logout</button>
				{:else}
					<button onclick={() => (location.href = '/login')}>Login</button>
				{/if}
			</li>
			<li><DarkmodeButton /></li>
		</ul>
	</nav>
</header>
