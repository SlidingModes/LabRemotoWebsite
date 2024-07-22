<script lang="ts">
	import VideoStreamPlayer from '$lib/components/VideoStreamPlayer.svelte';
	import { description } from '$lib/config';
</script>

<div class="pico container">
	<h1>{description}</h1>
	<VideoStreamPlayer streamURL="https://example.com" streamKey="1234" />
</div>

<p>
	This is a SvelteKit project. You can find the source code on{' '}
	<a href="https://kit.svelte.dev/">GitHub</a>.
</p>

<form class="pico">
	<input type="text" name="text" placeholder="Text" aria-label="Text" />
</form>
<textarea
	name="bio"
	placeholder="Write a professional short bio..."
	aria-label="Professional short bio"
>
</textarea>
