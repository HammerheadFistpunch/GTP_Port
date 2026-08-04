import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://angrysquirrel.org',
    output: 'static',

    integrations: [mdx(), tina()],

    vite: {
        plugins: [tinaAdminDevRedirect()],

        server: {
            watch: {
                ignored: ['**/.vs/**'],
            },
        },

        ssr: {
            noExternal: ['@tinacms/astro', '@tinacms/bridge'],
        },
    },
});
