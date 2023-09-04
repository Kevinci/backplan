<template>
    <div class="top-nav">
        {{ route }}
    </div>
</template>
  
<script setup>
const route = useRoute()
console.log(route.name);
</script>

<style lang="scss" scoped>
.top-nav {
    padding: 1rem;
    background: #3b82f6;
    color: #fff;
    border-bottom: 1px solid #3475dc;
    border-radius: 0;
}
</style>