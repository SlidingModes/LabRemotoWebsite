import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

export default defineConfig({
  plugins: [sveltekit()],
  css: {
    postcss:"./postcss.config.cjs"
  }
});

//-----------------------------------------------------------------------------

/*import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
//import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [ enhancedImages(), sveltekit()]
}); */

//-----------------------------------------------------------------------------
//import { defineConfig } from 'vite';

/*
export default defineConfig({
  plugins: [svelte()],
  server: {
    hmr: {
      overlay: false, // Desactiva el overlay de errores si es necesario
    },
  },
  css: {
    postcss: {
      /*plugins: [ 
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}); */