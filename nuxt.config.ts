export default defineNuxtConfig({
    css: [
        "primevue/resources/themes/lara-light-blue/theme.css",
        "primevue/resources/primevue.css",
        "primeflex/primeflex.css",
        '~/assets/styles/index.scss',
        'primeicons/primeicons.css'
    ],
    build: {
        transpile: ["primevue"]
    },
    runtimeConfig: {
        mongoUri: "mongodb://localhost:27017/mydatabase",
        public: {
            BASE_URL: process.env.BASE_URL,
            STORES_ENDPOINT: process.env.STORES_ENDPOINT,
            USERS_ENDPOINT: process.env.USERS_ENDPOINT
        }
    },
    nitro: {
        plugins: ["~/server/index.ts"],
    }
})
