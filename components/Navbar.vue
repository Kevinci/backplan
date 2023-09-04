<template>
    <div class="card relative z-2">
        <Menubar :model="items">
            <template #start>
                <strong>Bäcker Karl's Dienstplan</strong>
            </template>
            <template #end>
                Login
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { ref } from "vue";

const items = ref([

]);
</script>