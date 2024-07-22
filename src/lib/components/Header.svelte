<script lang="ts">
	import * as config from '$lib/config';
	import DarkmodeButton from './DarkmodeButton.svelte';
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
			<li><DarkmodeButton /></li>
		</ul>

		<!-- Theme -->
	</nav>
</header>
