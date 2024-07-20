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
			<a href="/about">About</a>
		</li>
		<li>
			<a href="/posts">Posts</a>
		</li>
		<li>
			<a href="/rss.xml" target="_blank">RSS</a>
		</li>
	</ul>

	<!-- Theme -->
	<DarkmodeButton />
</nav>
