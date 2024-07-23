<script>
	import VideoStreamPlayer from '$lib/components/VideoStreamPlayer.svelte';
	import { streamURL, streamKey } from '$lib/config';
</script>

<VideoStreamPlayer {streamKey} {streamURL} />
