<template>
    <div class="login-layout">
        <div class="login-container">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">

</script>

<style lang="scss" scoped>
.login-layout {
    background: #eeeeee;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-container {
    max-width: 400px;
    border-radius: 5px;
}
</style>