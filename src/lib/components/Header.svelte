<script lang="ts">
	import * as config from '$lib/config';
	import DarkModeButton from './DarkModeButton.svelte';
	import { Avatar } from 'bits-ui';
	import LogInButton from './LogInButton.svelte';
	import { Menu } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	let openDrawer = $state(false);
</script>

{#snippet navLinks()}
	<!-- Navigation -->
	<ul>
		<li class="text-right">
			<a href="/"><b>Inicio</b></a>
			<a href="/"><b>Prácticas</b></a>
			<a href="/"><b>Administrar</b></a>
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
		<nav transition:slide>
			<div class="container-fluid">
				<aside class="text-right">
					{@render navLinks()}
				</aside>
			</div>
		</nav>
	{/if}
</header>
