<script lang="ts">
	import * as config from '$lib/config';
	import DarkModeButton from './DarkModeButton.svelte';
	import { Avatar } from 'bits-ui';
	import LogInButton from './LogInButton.svelte';
	import { Menu } from 'lucide-svelte';

	let openDrawer = $state(false);
</script>

{#snippet navLinks()}
	<!-- Navigation -->
	<ul>
		<li>
			<a href="/posts"><b>Posts</b></a>
		</li>
	</ul>
{/snippet}

<header class="pico container">
	<nav>
		<ul>
			<li><LogInButton /></li>
		</ul>
		<!-- Title -->
		<ul>
			<li>
				<a href="/" class="contrast inline-flex items-center">
					<div class="flex items-center">
						<Avatar.Root class="h-6 w-6 secondary mr-2">
							<Avatar.Image src="/icon.png" alt="Escudo Facultad de Ingeniería" />
							<Avatar.Fallback />
						</Avatar.Root>
						<b>{config.title}</b>
					</div>
				</a>
			</li>
		</ul>

		<ul>
			<li></li>
			<li>
				<div role="group">
					<DarkModeButton />
					<button class="secondary" onclick={() => (openDrawer = !openDrawer)}>
						<Menu class="w-5 h-5" />
					</button>
				</div>
			</li>
		</ul>
	</nav>
	{#if openDrawer}
		<nav>
			<div class="display-block text-right">
				{@render navLinks()}
			</div>
		</nav>
	{/if}
</header>
