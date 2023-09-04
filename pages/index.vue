<template>
    <div>
        Home
        <NuxtLink to="/settings/">Einstellungen</NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})
</script>

<style scoped></style>