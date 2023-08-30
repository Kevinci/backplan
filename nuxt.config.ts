// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        "primevue/resources/themes/lara-light-blue/theme.css",
        "primevue/resources/primevue.css",
        "primeflex/primeflex.css",
        '~/assets/styles/reset.scss',
        'primeicons/primeicons.css'
    ],
    build: {
        transpile: ["primevue"]
    },
    runtimeConfig: {
        mongoUri: process.env.MONGODB_URI,
        apiUrl: process.env.API_URL
    },
    nitro: {
        plugins: ["~/server/index.ts"],
    }
})
