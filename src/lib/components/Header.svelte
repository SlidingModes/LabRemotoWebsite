<script lang="ts">
	import * as config from '$lib/config';
	import DarkmodeButton from './DarkmodeButton.svelte';
</script>

<nav>
	<!-- Title -->
	<a href="/" class="title">
		<b>{config.title}</b>
	</a>

	<!-- Navigation -->
	<ul class="links">
		<li>
			<a href="/posts">Posts</a>
		</li>
	</ul>

	<!-- Theme -->
	<DarkmodeButton />
</nav>
