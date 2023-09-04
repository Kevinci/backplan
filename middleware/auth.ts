import { useRoute } from 'vue-router'
export default defineNuxtRouteMiddleware((to, from) => {
    const route = useRoute()
    function isAuthenticated() {
        return true
    }

    if (isAuthenticated() === false) {
        return navigateTo('/login')
    } else {
        console.log('locked in')
    }
})