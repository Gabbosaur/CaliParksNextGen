import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		alias: {
			'@lib': 'src/lib',
			'@components': 'src/lib/components',
			'@stores': 'src/lib/stores',
			'@ml': 'src/lib/ml',
			'@exercises': 'src/lib/exercises',
			'@audio': 'src/lib/audio',
			'@hardware': 'src/lib/hardware',
			'@sync': 'src/lib/sync',
			'@auth': 'src/lib/auth',
			'@config': 'src/lib/config'
		}
	}
};

export default config;
