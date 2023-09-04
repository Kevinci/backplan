<template>
    <div>
      <h1>{{ stores?.name }}</h1>
      Kalender
    </div>
  </template>
  
  <script setup>
    import axios from 'axios'
    import { ref } from 'vue'
    import { useRouter, useRoute } from 'vue-router'

    const route = useRoute()
    const id = route.params.id
    const stores = ref([])

    async function fetchStores() {
        try {
            const response = await axios.get('http://localhost:3000/api/stores/' + id)
            stores.value = response.data.body
            console.log('=>>', stores.value)
        } catch (error) {
            console.log(error)
        }
    }

    fetchStores()
  </script>
  
  <style>
    /* Deine Styles hier */
  </style>
  